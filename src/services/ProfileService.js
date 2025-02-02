import api from "./api";

export async function getAllProfiles() {
    const response = await api.get('/profiles/');
    return response.data.profiles;
}