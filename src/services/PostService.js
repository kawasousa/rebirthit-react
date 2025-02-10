import api from './rebirthit-api'
import { getCurrentUser } from './authService';

export async function getAllPosts() {
    const response = await api.get("/posts");
    return response.data;
}

export async function createPost(content, isAdvanced, title = undefined) {
    const user = await getCurrentUser();
    const username = user.username;
    
    let response;
    
    if (isAdvanced === false) {
        response = await api.post("/posts", { content, username, ...(title !== undefined && { title }) });
    }
    else {
        response = await api.post("/posts/advanced", { content, username, ...(title !== undefined && { title }) });
    }

    if (!response.data) throw new Error('Erro ao criar publicação')

    return response.data;
}

export async function createAdvancedPost(content) {
    const user = await getCurrentUser();
    const username = user.username;

    const response = await api.post("/posts/advanced", { content, username });

    if (!response.data) throw new Error('Erro ao criar publicação')

    return response.data;
}

export async function deletePost(id, interactions = undefined) {
    try {
        const user = await getCurrentUser();
        if(interactions){
            await api.delete('/posts/advanced/' + id, { data: { requestingUsername: user.username } });
        }
        else{
            await api.delete('/posts/' + id, { data: { requestingUsername: user.username } });
        }
    } catch (error) {
        console.log(error);

    }
}