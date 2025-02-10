import { useState, useEffect } from "react";
import { getAllProfiles } from "../services/ProfileService";

export function useProfiles() {
    const [profiles, setProfiles] = useState([]);
    const [profilesLoading, setLoading] = useState(true);
    const [profilesError, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllProfiles();
                setProfiles(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    return { profiles, profilesLoading, profilesError }
}