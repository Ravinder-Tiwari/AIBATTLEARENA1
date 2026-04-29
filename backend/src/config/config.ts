import { config } from "dotenv"
config()

type CONFIG = {
    readonly GOOGLE_API_KEY: string,
    readonly MISTRAL_API_KEY: string,
    readonly COHERE_API_KEY: string,
    readonly GOOGLE_CLIENT_ID: string,
    readonly GOOGLE_CLIENT_SECRET: string,
    readonly MONGO_URI?: string,
    readonly JWT_SECRET?: string
}

if(!process.env.GOOGLE_API_KEY) {
    console.warn("⚠️ GOOGLE_API_KEY is not set in environment variables.")
}   
if(!process.env.MISTRAL_API_KEY) {
    console.warn("⚠️ MISTRAL_API_KEY is not set in environment variables.")
}

if(!process.env.COHERE_API_KEY) {
    console.warn("⚠️ COHERE_API_KEY is not set in environment variables.")
}

if(!process.env.MONGO_URI) {    
    console.warn("⚠️ MONGO_URI is not set in environment variables. Database connection will not be established.")
}

if(!process.env.GOOGLE_CLIENT_ID) {
    console.warn("⚠️ GOOGLE_CLIENT_ID is not set in environment variables. Google OAuth will not work.")
}   

if(!process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️ GOOGLE_CLIENT_SECRET is not set in environment variables. Google OAuth will not work.")
}

if(!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET is not set in environment variables. JWT-based authentication will not work.")
}   

const appConfig: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    JWT_SECRET: process.env.JWT_SECRET || ""
}

export default appConfig