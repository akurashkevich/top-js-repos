import {Repository} from "../types/Repository";

const GITHUB_API_URL = 'https://api.github.com/search/repositories';

interface Response {
    total_count: number;
    items: Repository[];
}

export const fetchRepositories = async (page: number, perPage: number): Promise<Response> => {
    const token = import.meta.env.VITE_API_KEY;
    const response = await fetch(`${GITHUB_API_URL}?q=JavaScript+language:javascript&sort=stars&order=desc&page=${page}&per_page=${perPage}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }

    return response.json();
};
