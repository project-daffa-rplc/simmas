import { Navigate } from "react-router-dom"
import { currentRole, currentToken, nameUser } from "../api/helper"
import type React from "react"

const AuthMiddleware = ({children}: {children: React.ReactNode}) => {
    if(!currentToken.get() && !currentRole.get() && !nameUser.get()) {
        return <Navigate to={"/login"}/>
    } else {
        return (children)
    }
}

export default AuthMiddleware