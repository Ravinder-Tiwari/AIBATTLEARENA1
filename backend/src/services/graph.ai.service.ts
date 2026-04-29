import { HumanMessage } from "@langchain/core/messages";
import {
  StateSchema,
  StateGraph,
  START,
  END
} from "@langchain/langgraph";
import type {
  CompiledStateGraph,
  GraphNode
} from "@langchain/langgraph";

import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";
import z from "zod";

// ✅ State Schema
const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge_recommendation: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reasoning: z.string().default(""),
    solution_2_reasoning: z.string().default("")
  }).default({
    solution_1_score: 0,
    solution_2_score: 0,
    solution_1_reasoning: "",
    solution_2_reasoning: ""
  })
});

// ✅ Solution Node
// const solutionNode: GraphNode<typeof state> = async (state) => {
//   const [mistral_solution, cohere_solution] = await Promise.all([
//     mistralModel.invoke(state.problem),
//     cohereModel.invoke(state.problem)
//   ]);

//   return {
//     solution_1: mistral_solution.text,
//     solution_2: cohere_solution.text
//   };
// };

const solutionNode: GraphNode<typeof state> = async (state) => {
  const results = await Promise.allSettled([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem)
  ]);

  return {
    solution_1:
      results[0].status === "fulfilled"
        ? results[0].value.text
        : "Mistral failed. Try again.",

    solution_2:
      results[1].status === "fulfilled"
        ? results[1].value.text
        : "Cohere failed. Try again."
  };
};

// ✅ Judge Node
// const judgeNode: GraphNode<typeof state> = async (state) => {
//   const { problem, solution_1, solution_2 } = state;

//   const judge = createAgent({
//     model: geminiModel,
//     tools: [],
//     responseFormat: providerStrategy(
//       z.object({
//         solution_1_score: z.number().default(0),
//         solution_2_score: z.number().default(0),
//         solution_1_reasoning: z.string().default(""),
//         solution_2_reasoning: z.string().default(""),
//       })
//     ),
//     systemPrompt: `You are a judge evaluating two AI solutions. Score each from 0–10 based on correctness, completeness, and clarity. Also provide reasoning.`
//   });

//   const judge_response = await judge.invoke({
//     messages: [
//       new HumanMessage(`
// Problem: ${problem}
// Solution 1: ${solution_1}
// Solution 2: ${solution_2}

// Evaluate both and return scores + reasoning.
//       `)
//     ]
//   });

//   return {
//     judge_recommendation: judge_response.structuredResponse
//   };
// };

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const models = [geminiModel, mistralModel, cohereModel];

  for (const model of models) {
    try {
      const judge = createAgent({
        model,
        tools: [],
        responseFormat: providerStrategy(
          z.object({
            solution_1_score: z.number(),
            solution_2_score: z.number(),
            solution_1_reasoning: z.string(),
            solution_2_reasoning: z.string(),
          })
        ),
        systemPrompt: `You are a judge evaluating two AI solutions.`
      });

      const res = await judge.invoke({
        messages: [
          new HumanMessage(`
Problem: ${problem}
Solution 1: ${solution_1}
Solution 2: ${solution_2}
          `)
        ]
      });

      return {
        judge_recommendation: res.structuredResponse
      };

    } catch (err) {
      console.log("Judge model failed, trying next...");
    }
  }

  throw new Error("All judge models failed");
};

// ✅ Properly typed graph (FIXES TS2883)
const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

// ✅ Main function
const useGraph = async (message: string) => {
  const result = await graph.invoke({ problem: message });
  return result;
};

export default useGraph;