import api from './rebirthit-api'
import Cookies from 'js-cookie'

async function logginUser(username, password, navigate) {
    const response = await api.post("/auth/login", {
        username: username,
        password: password
    })

    const token = response.data.token;

    if (!token) throw new Error(response.data.error);

    Cookies.set('auth_token', token)

    navigate("/")
}

function loggoutUser(navigate) {
    api.post("/auth/loggout");
    navigate("/login");
}

async function createProfile(navigate, username, password, name, icon) {
    const response = await api.post("/auth/register", {
        username, password, name, icon, role: "Default"
    })

    if (!response) throw new Error('Error while registering')

    navigate("/");
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