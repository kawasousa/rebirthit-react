import axios from 'axios';
import api from './rebirthit-api'

async function loginUser(uniqueCredential, password) {
    try {
        const response = await api.post("/auth/login", {
            uniqueCredential: uniqueCredential,
            password: password
        })
        if (response.data.error) throw new Error(response.data.error);

        return response.data.profileDTO;
    } catch (error) {
        let message = 'erro desconhecido';

        if (axios.isAxiosError(error)) {
            message = error.response.data.message
        }
        console.log(message);

        throw new Error(message);
    }
}

async function logoutUser(navigate) {
    await api.post("/auth/logout");
    navigate("/login");
}

async function createProfile(username, email, password, name, icon) {
    try {
        await api.post("/auth/register", {
            username, email, password, name, icon, role: "Default"
        })
        return;
    } catch (error) {
        let message = 'erro desconhecido';
        if (axios.isAxiosError(error)) {
            message = error.response.data.message
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