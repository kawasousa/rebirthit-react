import axios from 'axios';
import api from './rebirthit-api'

async function loginUser(username, password) {
    try {
        const response = await api.post("/auth/login", {
            username: username,
            password: password
        })

        console.log('Resposta da API: ' + response.data);

        if (response.data.error) throw new Error(response.data.error);

        console.log('login bem sucedido, retornando' + response.data.profileDTO + 'para o usuario');

        return response.data.profileDTO;
    } catch (error) {
        console.log('erro capturado pelo catch: ' + error);

        let message = 'erro desconhecido'

        if (axios.isAxiosError(error)) {
            message = error.response
        }

        console.log('mensagem enviada para frente: ' + message);

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