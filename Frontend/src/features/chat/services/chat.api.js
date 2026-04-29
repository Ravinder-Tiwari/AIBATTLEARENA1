import axios from "axios"


const chatApiInstance = axios.create({
    baseURL:"/api/chat",
    withCredentials:true
})


export const createChat = async ({message, chatId}) => {
    try{
        if(chatId) {
            const response = await chatApiInstance.post(`/${chatId}/message`, {
                message
            })
            return response.data
        }
        const response = await chatApiInstance.post("/", {
            message
        })
        return response.data
    }catch(error) {
        throw error.response?.data || {message:"Chat creation failed"}
    }
}

export const getMyChats = async ()=>{
    try{
        const response = await chatApiInstance.get("/getMyChats")
        return response.data
    }
    catch(err){
        throw err.response?.data || {message:"Failed to fetch chats"}
    }
}

export const getMessages = async (chatId) => {
    try{
        const response = await chatApiInstance.get(`/${chatId}/messages`)
        return response.data
    }
    catch(err){
        throw err.response?.data || {message:"Failed to fetch messages"}
    }
}