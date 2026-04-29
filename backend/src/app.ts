import express,{urlencoded} from "express"
import useGraph from "./services/graph.ai.service.js"
import cors from "cors"
import appConfig from "./config/config"
import passport from "passport"
import rateLimit from "express-rate-limit";
// @ts-ignore
import cookieparser from "cookie-parser"
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20"
// import session from "express-session";
// @ts-ignore
import authRouter from "./routes/auth.routes.js"
// @ts-ignore
import chatRouter from "./routes/chat.routes.js"

import morgan from "morgan"



type ApiError = Error & {
    status?: number
    statusCode?: number
    response?: {
        status?: number
        data?: unknown
    }
}

const app = express()



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: {
    message: "Too many requests, please try again later"
  }
});
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
app.use(cookieparser())
app.use(morgan("dev"))
app.use(urlencoded({extended:true}))
app.use(express.static("./public"))
// app.use(session({
//   secret: "supersecret",   // use env in production
//   resave: false,
//   saveUninitialized: false,
// }));
app.use(passport.initialize())
// app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: appConfig.GOOGLE_CLIENT_ID,
    clientSecret: appConfig.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
}, (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
    // Here you would typically find or create a user in your database
    // For this example, we'll just return the profile
    return done(null, profile)
}))






app.use("/api/auth", authRouter)
app.use("/api/chat", chatRouter)

export default app  
