import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
        name: "chat",
        initialState: {
            chats: {},
            projects: {}, // { id: { name, chatIds: [] } }
            currentProjectId: null,
            currentChatId: null,
            isLoading: false,
            error: null
        },
        reducers: {
            createProject: (state, action) => {
                const { id, name } = action.payload
                state.projects[id] = {
                    id,
                    name,
                    chatIds: []
                }
                state.currentProjectId = id
            },
            setCurrentProjectId: (state, action) => {
                state.currentProjectId = action.payload
            },
            createNewChat: (state, action) => {
                const { chatId, title } = action.payload
                state.chats[chatId] = {
                    id: chatId,
                    title,
                    messages: [],
                    projectId: state.currentProjectId,
                    lastUpdated: new Date().toISOString(),
                }
                if (state.currentProjectId && state.projects[state.currentProjectId]) {
                    state.projects[state.currentProjectId].chatIds.push(chatId)
                }
            },
            addNewMessage: (state, action) => {
                const { chatId, content, role } = action.payload
                if (state.chats[chatId]) {
                    state.chats[chatId].messages.push({ content, role })
                }
            },
            addMessages: (state, action) => {
                const { chatId, messages } = action.payload
                if (state.chats[chatId]) {
                    state.chats[chatId].messages.push(...messages)
                }
            },
            setChats: (state, action) => {
                state.chats = action.payload
            },
            setProjects: (state, action) => {
                state.projects = action.payload
            },
            setCurrentChatId: (state, action) => {
                state.currentChatId = action.payload
            },
            setLoading: (state, action) => {
                state.isLoading = action.payload
            },
            setError: (state, action) => {
                state.error = action.payload
            },
        }
    })
export const {
        createProject,
        setCurrentProjectId,
        createNewChat,
        addNewMessage,
        setChats,
        setProjects,
        setCurrentChatId,
        addMessages,
        setLoading,
        setError
    } = chatSlice.actions
export default chatSlice.reducer