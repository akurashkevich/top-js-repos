import { fetchRepositories } from './githubApi';

describe('githubApi', () => {
    let mockFetch: jest.Mock;

    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        process.env.VITE_API_KEY = 'test-token';
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('успешно получает репозитории', async () => {
        const mockResponse = {
            total_count: 1,
            items: [{
                id: 1,
                name: 'test-repo',
                description: 'Test description',
                stargazers_count: 1000,
                html_url: 'https://github.com/test/repo',
                owner: {
                    login: 'testuser',
                    avatar_url: 'https://avatar.url'
                }
            }]
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await fetchRepositories(1, 10);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.github.com/search/repositories?q=JavaScript+language:javascript&sort=stars&order=desc&page=1&per_page=10',
            {
                headers: {
                    Authorization: 'Bearer test-token'
                }
            }
        );
        expect(result).toEqual(mockResponse);
    });

    it('выбрасывает ошибку при неуспешном ответе', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(fetchRepositories(1, 10)).rejects.toThrow('Failed to fetch repositories');
    });

    it('выбрасывает ошибку при сетевых проблемах', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(fetchRepositories(1, 10)).rejects.toThrow('Network error');
    });
}); 