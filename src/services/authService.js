import api from './api'
import Cookies from 'js-cookie'

async function logginUser(email, password, navigate) {
    try {
        const response = await api.post("/auth/login", {
            email: email,
            password: password
        })

        Cookies.set('auth_token', response.data.token)

        navigate("/")
    } catch (error) {

    }
}

function loggoutUser(navigate) {
    api.post("/auth/loggout");
    navigate("/login");
}

function createProfile(navigate, username, email, password, name, icon) {
    try {
        api.post("/auth/register", {
            username, email, password, name, icon, role: "Default"
        })

        navigate("/");
    }
    catch (error) {
        console.log(error);

    }
}

async function getCurrentUser() {
    try {
        const response = await api.get("auth/me");
        return response.data.profile;
        
    } catch (error) {
        return null;
    }
}

export { logginUser, loggoutUser, getCurrentUser, createProfile }