import axios from 'axios';
import api from './rebirthit-api'

async function loginUser(username, password) {
    try {
        const response = await api.post("/auth/login", {
            username: username,
            password: password
        })
        if (response.data.error) throw new Error(response.data.error);

        return response.data.profileDTO;
    } catch (error) {
        let message = 'erro desconhecido';

        if (axios.isAxiosError(error)) {
            message = error.response?.data?.error || error.message
        }
        throw new Error(message);
    }
}

async function logoutUser(navigate) {
    await api.post("/auth/loggout");
    navigate("/login");
}

async function createProfile(username, password, name, icon) {
    try {
        const response = await api.post("/auth/register", {
            username, password, name, icon, role: "Default"
        })

        if (!response.data.profileDTO) throw new Error(response.data.error)

        return response.data.profileDTO;
    } catch (error) {
        let message = 'erro desconhecido';

        if (axios.isAxiosError(error)) {
            message = error.response?.data?.error || error.message

            if(Array.isArray(message) && message.length>0) message = message[0].message;
            console.log(message);
        }
        throw new Error(message);
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

export { loginUser, logoutUser, getCurrentUser, createProfile }