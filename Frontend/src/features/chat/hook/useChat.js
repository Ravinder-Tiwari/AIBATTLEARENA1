import { createChat, getMyChats, getMessages } from "../services/chat.api"
import {
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    createNewChat,
    addNewMessage,
    addMessages,
    createProject,
    setCurrentProjectId
} from "../state/chat.slice"
import { useDispatch, useSelector } from "react-redux"

const useChat = () => {

    const dispatch = useDispatch()
    const { chats = {} } = useSelector(state => state.chat || {})

    const handleCreateProject = (name) => {
        const id = `project-${Date.now()}`;
        dispatch(createProject({ id, name }));
        return id;
    };

    const handleSetCurrentProject = (projectId) => {
        dispatch(setCurrentProjectId(projectId));
    };

    const handleChat = async ({ message, chatId }) => {
        try {
            dispatch(setLoading(true));

            const response = await createChat({ message, chatId });

            const newChatId = chatId || response.chat._id;

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: newChatId,
                    title: response.title
                }));

                dispatch(setCurrentChatId(newChatId));
            }

            dispatch(addNewMessage({
                chatId: newChatId,
                content: message,
                role: "user"
            }));

            if (response.aiMessage) {
                dispatch(addNewMessage({
                    chatId: newChatId,
                    content: response.aiMessage.content,
                    role: "ai"
                }));
            }

        } catch (err) {
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetMyChats = async () => {
        try {
            const response = await getMyChats()
            const chatsData = {}
            if (response.chats) {
                response.chats.forEach(chat => {
                    chatsData[chat._id] = {
                        id: chat._id,
                        title: chat.title,
                        messages: [],
                        lastUpdated: chat.updatedAt || chat.createdAt,
                    }
                })
                dispatch(setChats(chatsData))
            }
            return response
        }
        catch (err) {
            throw err?.response?.data || { message: "Failed to fetch chats" }
        }
    }

    const handleGetMessages = async (chatId) => {
        try {
            dispatch(setLoading(true));
            const response = await getMessages(chatId);
            
            if (response.messages) {
                // To avoid duplicate messages if already loaded
                if (chats[chatId]?.messages.length === 0) {
                    dispatch(addMessages({
                        chatId,
                        messages: response.messages.map(msg => ({
                            content: msg.content,
                            role: msg.role
                        }))
                    }));
                }
            }
            dispatch(setCurrentChatId(chatId));
            return response;
        } catch (err) {
            throw err?.response?.data || { message: "Failed to fetch messages" }
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleChat,
        handleGetMyChats,
        handleGetMessages,
        handleCreateProject,
        handleSetCurrentProject
    }
}

export default useChat