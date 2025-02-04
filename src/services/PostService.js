import api from './rebirthit-api'
import { getCurrentUser } from './authService';

export async function getAllPosts() {
    const response = await api.get("/posts");
    return response.data;
}

export async function createPost(content) {
    const user = await getCurrentUser();
    const username = user.username;

    const response = await api.post("/posts", { content, username });

    if(!response.data) throw new Error('Erro ao criar publicação')

    return response.data;
}

export async function deletePost(id) {
    try {
        const user = await getCurrentUser();
        await api.delete('/posts/' + id, { data: { requestingUsername: user.username } });
    } catch (error) {
        console.log(error);

    }
}