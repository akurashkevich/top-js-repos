import { useState, useCallback } from 'react';
import { Repository } from '../types/Repository';
import { fetchRepositories } from '../api/githubApi';

export function useRepositories() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadRepositories = useCallback(async () => {
        if (!hasMore || loading) return;

        try {
            setLoading(true);
            const data = await fetchRepositories(page, 10);

            if (data.items.length === 0) {
                setHasMore(false);
                return;
            }

            setRepositories(prev => [...prev, ...data.items]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке репозиториев');
        } finally {
            setLoading(false);
        }
    }, [hasMore, page]);

    const handleDelete = (id: number) => {
        setRepositories(prev => prev.filter(repo => repo.id !== id));
    };

    const handleEdit = (id: number, updatedRepo: Repository) => {
        setRepositories(prev =>
            prev.map(repo => (repo.id === id ? updatedRepo : repo))
        );
    };

    const loadNextPage = () => {
        if (!loading) {
            setPage(prev => prev + 1);
        }
    };

    return {
        repositories,
        loading,
        error,
        hasMore,
        loadRepositories,
        handleDelete,
        handleEdit,
        loadNextPage
    };
}