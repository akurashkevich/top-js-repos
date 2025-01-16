import { renderHook, act } from '@testing-library/react';
import { useRepositories } from './useRepositories';
import { fetchRepositories } from '../api/githubApi';

jest.mock('../api/githubApi');

const mockFetchRepositories = fetchRepositories as jest.MockedFunction<typeof fetchRepositories>;

const mockRepositories = [
    {
        id: 1,
        name: 'repo-1',
        description: 'Description 1',
        stargazers_count: 1000,
        html_url: 'https://github.com/test/repo1',
        owner: {
            login: 'user1',
            avatar_url: 'https://avatar1.url'
        }
    }
];

describe('useRepositories', () => {
    beforeEach(() => {
        mockFetchRepositories.mockClear();
    });

    it('загружает репозитории успешно', async () => {
        mockFetchRepositories.mockResolvedValueOnce({
            total_count: 1,
            items: mockRepositories
        });

        const { result } = renderHook(() => useRepositories());

        await act(async () => {
            await result.current.loadRepositories();
        });

        expect(result.current.repositories).toEqual(mockRepositories);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('обрабатывает ошибку при загрузке', async () => {
        mockFetchRepositories.mockRejectedValueOnce(new Error('API Error'));

        const { result } = renderHook(() => useRepositories());

        await act(async () => {
            await result.current.loadRepositories();
        });

        expect(result.current.error).toBe('API Error');
        expect(result.current.loading).toBe(false);
    });

    it('удаляет репозиторий', async () => {
        mockFetchRepositories.mockResolvedValueOnce({
            total_count: 1,
            items: mockRepositories
        });

        const { result } = renderHook(() => useRepositories());

        await act(async () => {
            await result.current.loadRepositories();
        });

        act(() => {
            result.current.handleDelete(1);
        });

        expect(result.current.repositories).toHaveLength(0);
    });

    it('редактирует репозиторий', async () => {
        mockFetchRepositories.mockResolvedValueOnce({
            total_count: 1,
            items: mockRepositories
        });

        const { result } = renderHook(() => useRepositories());

        await act(async () => {
            await result.current.loadRepositories();
        });

        const updatedRepo = {
            ...mockRepositories[0],
            name: 'updated-name'
        };

        act(() => {
            result.current.handleEdit(1, updatedRepo);
        });

        expect(result.current.repositories[0].name).toBe('updated-name');
    });

    it('устанавливает hasMore в false когда нет элементов', async () => {
        mockFetchRepositories.mockResolvedValueOnce({
            total_count: 0,
            items: []
        });

        const { result } = renderHook(() => useRepositories());

        await act(async () => {
            await result.current.loadRepositories();
        });

        expect(result.current.hasMore).toBe(false);
    });
}); 