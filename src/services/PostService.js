import api from './api'
import { getCurrentUser } from './authService';

export async function getAllPosts() {
    const response = await api.get("/posts");
    return response.data;
}

export async function createPost(content) {
    const user = await getCurrentUser();
    const username = user.username;

    try {
        const response = await api.post("/posts", { content, username });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(id) {
    try {
        const user = await getCurrentUser();
        await api.delete('/posts/' + id,{data: { requestingUsername: user.username }});
    } catch (error) {
        console.log(error);

    }
}