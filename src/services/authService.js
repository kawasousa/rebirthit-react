import api from './rebirthit-api'
import Cookies from 'js-cookie'

async function logginUser(username, password) {
    try {
        const response = await api.post("/auth/login", {
            username: username,
            password: password
        })

        const token = response.data.token;

        if (!token) throw new Error(response.data.error);

        Cookies.set('auth_token', token)

    } catch (error) {
        throw new Error(error.error);
    }
}

async function loggoutUser(navigate) {
    await api.post("/auth/loggout");
    navigate("/login");
}

async function createProfile(username, password, name, icon) {
    try {
        const response = await api.post("/auth/register", {
            username, password, name, icon, role: "Default"
        })
    
        if (!response.data.profileDTO) throw new Error(response.data.error)
    } catch (error) {
        throw new Error(error.error)
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