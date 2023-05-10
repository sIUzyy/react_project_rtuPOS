import React from "react";
import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext'

export const ProtectedRoutes = ({children}) => {
    const { currentUser } = useAuth()

    if (!currentUser) {
        // Redirect unauthenticated users to the login page
        return <Navigate to='/login' replace />
    } else if (currentUser.role === 'admin') {
        // Redirect admin users to the /RTUApparel page if they try to access /restricted
        return <Navigate to='/RTUApparel' replace />
    } else {
        // Render the protected child routes for non-admin users
        return children
    }
}

export default ProtectedRoutes
