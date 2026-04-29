import { setError, setUser, setLoading } from "../state/auth.slice.js"
import { register,login,getMyProfile,logout } from "../services/auth.api.js"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"

const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    async function handleRegister({ email, username, password, contact }) {

        setLoading(true)
        const data = await register({ email, username, password, contact })
        dispatch(setUser(data.user))
        dispatch(setError(null))
        setLoading(false)

    }

    async function handleLogin({email, password}) {
            setLoading(true)
            const data = await login({email, password})
            // console.log(data)
            dispatch(setUser(data.user))
            dispatch(setError(null))
            setLoading(false)
    }

    async function handleGetMyProfile() {
        setLoading(true)
        const data = await getMyProfile()   
        dispatch(setUser(data.user))
        dispatch(setError(null))
        setLoading(false)
    }

    async function handleLogout(){
        console.log("hii")
            await logout()
            dispatch(setUser(null))
            dispatch(setError(null))
            navigate("/login")
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMyProfile,
        handleLogout
    }
}

export default useAuth