import axios from 'axios';
import api from './rebirthit-api'
import Cookies from 'js-cookie'

async function loginUser(username, password) {
    try {
        const response = await api.post("/auth/login", {
            username: username,
            password: password
        })

        if (response.data.error) throw new Error(response.data.error);

        const token = response.data.token;
        if (!token) throw new Error('erro ao autenticar');

        Cookies.set('auth_token', token)
        
        return response.data.profileDTO;

    } catch (error) {
        const message = axios.isAxiosError(error)? error.response?.data?.error: 'erro desconhecido'
        throw new Error(message);
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

export { loginUser, loggoutUser, getCurrentUser, createProfile }