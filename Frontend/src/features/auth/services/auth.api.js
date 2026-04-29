import axios from "axios"

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})


export const register  = async ({email,username,password,contact}) => {
    try {
        const response = await authApiInstance.post("/register",{
            email,
            username,
            password,
            contact
        })

        return response.data
    }
    catch (error) {
        throw error.response?.data || { message: "Registration failed" }
    }
}

export const login = async ({email, password}) => {
    try {
        const response = await authApiInstance.post("/login", {
            email,
            password
        })
        return response.data
    }
    catch (error) {
        throw error.response?.data || { message: "Login failed" }   
    }
}

export const getMyProfile = async () => {
    try {
        const response = await authApiInstance.get("/getMe")
        return response.data
    }
    catch (error) {
        throw error.response?.data || { message: "Failed to fetch profile" }
    }
}

export const logout = async () => {
    try {
        const response = await authApiInstance.post("/logout")
        return response.data
    }
    catch(error){
        throw error.response?.data || {message: "Logout failed"}
    }
}