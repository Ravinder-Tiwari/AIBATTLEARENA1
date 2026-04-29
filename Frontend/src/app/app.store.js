import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js"
import chatReducer from "../features/chat/state/chat.slice.js"


const store = configureStore({
    reducer:{
        auth:authReducer,
        chat: chatReducer
    }
})

export default store