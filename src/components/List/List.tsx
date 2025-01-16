import {useEffect, useRef} from 'react';
import {Container, Loader, Stack, Title, Text} from '@mantine/core';
import ListItem from '../ListItem/ListItem.tsx';
import { useRepositories } from '../../hooks/useRepositories.tsx';

export function List() {
    const {
        repositories,
        loading,
        error,
        hasMore,
        loadRepositories,
        handleDelete,
        handleEdit,
        loadNextPage
    } = useRepositories();

    const observerTarget = useRef(null);

    useEffect(() => {
        loadRepositories();
    }, [loadRepositories]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadNextPage();
                }
            },
            {
                threshold: 0.5
            }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loading, loadNextPage]);

    return (
        <Container size="sm">
            <Title order={1} ta="center" py="20px">Most Starred JavaScript Repositories</Title>
            <Stack align="center">
                {repositories.map((repo, index) => (
                    <ListItem
                        key={repo.id}
                        repository={repo}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        ref={index === repositories.length - 1 ? observerTarget : null}
                    />
                ))}
                {loading && <Loader size="md" />}
                {error && <Text c="red">{error}</Text>}
                {!hasMore && !error && <Text>Больше репозиториев нет</Text>}
            </Stack>
        </Container>
    );
}

export default List;