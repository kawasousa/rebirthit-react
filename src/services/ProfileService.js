import api from "./rebirthit-api";

export async function getAllProfiles() {
    const response = await api.get('/profiles');
    return response.data;
}