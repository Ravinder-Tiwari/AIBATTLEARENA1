 import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import useGraph from "../services/graph.ai.service.js"
import { getTitle } from "../services/title.service.js";


// Create a new chat

export async function createChat(req, res) {
    try {
        const { message } = req.body;
        const { chatId } = req.params;
        // console.log(message)

        // console.log(title)
        let title = null;
        let chat = null;
        // console.log(chatId)

        if (!chatId) {
            title = await getTitle(message)
            chat = await chatModel.create({
                user: req.user.id,
                title,
            })
        }


        console.log("Incoming message:", message);
        console.log("Type:", typeof message);

        const cleanMessage = String(message).trim();

        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: cleanMessage,
            role: "user"
        })

        // const messages = await messageModel.find({ chat: chatId || chat._id })

        // console.log(messages)

        const messages = await messageModel
            .find({ chat: chatId || chat._id })
            .sort({ createdAt: 1 });



        const latestUserMessage = messages
            .filter(m => m.role === "user")
            .at(-1);

        // const userInput = String(latestUserMessage?.content || "");
        const lastMessages = messages.slice(-6); // last 6 messages
        const conversation = lastMessages
            .map(m => `${m.role}: ${m.content}`)
            .join("\n");

        const result = await useGraph(conversation);
        // const result = await useGraph(userInput);
        console.log("Generated Response:", result)

        //         const aiOutput = result.judge_recommendation;

        //         const formatted = `
        // Winner: ${aiOutput.solution_1_score > aiOutput.solution_2_score ? "Model 1" : "Model 2"}

        // Model 1 Score: ${aiOutput.solution_1_score}
        // Reason: ${aiOutput.solution_1_reasoning}

        // Model 2 Score: ${aiOutput.solution_2_score}
        // Reason: ${aiOutput.solution_2_reasoning}
        // `;

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: JSON.stringify({
                problem: result.problem,
                solution_1: result.solution_1,
                solution_2: result.solution_2,
                judge: result.judge_recommendation
            }),
            role: "ai"
        });
        // console.log(aiMessage)

        // console.log("AI Message:", aiMessage.content)
        // console.log("DB Name:", chat.db.name)
        res.status(201).json({
            title,
            chat,
            aiMessage
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}  

// Get all chats of logged-in user

export async function getChats(req, res) {
    try {
        const user = req.user
        const chats = await chatModel.find({ user: user.id })

        res.status(200).json({
            message: "Chats fetched successfully",
            chats
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// Get messages of a specific chat

export async function getMessages(req,res){
    try{
        const {chatId} = req.params
        const messages = await messageModel.find({chat:chatId}).sort({createdAt:1})
        res.status(200).json({
            message:"Messages fetched successfully",
            messages
        })

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}


// Delete a chat

export async function deleteChat(req,res){
    try{
        const {chatId} = req.params
        await messageModel.deleteMany({chat:chatId})
        await chatModel.findByIdAndDelete(chatId)
        res.status(200).json({
            message:"Chat deleted successfully"
        })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}