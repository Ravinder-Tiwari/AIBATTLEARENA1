import express from "express"
import useGraph from "./services/graph.ai.service.js"
import cors from "cors"

type ApiError = Error & {
    status?: number
    statusCode?: number
    response?: {
        status?: number
        data?: unknown
    }
}

const app = express()

const allowedOrigins = new Set([
    "https://aibattlearena1.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
].filter(Boolean) as string[])

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true)
            return
        }

        callback(null, false)
    },
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(express.json())
app.use(express.static("./public"))

app.get("/health", (req, res) => { 
    res.status(200).json({ status: "ok" })
})  

app.post("/response", async (req, res) => {
    try {
        const { problem } = req.body ?? {}

        if (typeof problem !== "string" || !problem.trim()) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Request body must include a non-empty `problem` string."
            })
        }

        console.log("[/response] problem:", problem)
        const result = await useGraph(problem.trim())

        return res.status(200).json({
            message: "Response from graph",
            result
        })
    } catch (error) {
        const err = error as ApiError
        const status = err.status ?? err.statusCode ?? err.response?.status
        const responseStatus = typeof status === "number" && status >= 400 && status < 600
            ? status
            : 500

        console.error("[/response] failed:", {
            message: err.message,
            status: responseStatus,
            providerStatus: err.response?.status,
            providerData: err.response?.data
        })

        return res.status(responseStatus).json({
            error: responseStatus === 500 ? "Internal Server Error" : "Request Failed",
            message: err.message || "Failed to generate response."
        })
    }
})





export default app  
