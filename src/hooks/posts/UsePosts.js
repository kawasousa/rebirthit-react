import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/PostService";

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllPosts();
                setPosts(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []
    )

    return { posts, setPosts, loading, error }
}