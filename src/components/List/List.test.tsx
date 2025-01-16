import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../test-utils/test-utils';
import { List } from './List';
import { useRepositories } from '../../hooks/useRepositories';

jest.mock('../../hooks/useRepositories');

const mockUseRepositories = useRepositories as jest.MockedFunction<typeof useRepositories>;

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
    },
    {
        id: 2,
        name: 'repo-2',
        description: 'Description 2',
        stargazers_count: 2000,
        html_url: 'https://github.com/test/repo2',
        owner: {
            login: 'user2',
            avatar_url: 'https://avatar2.url'
        }
    }
];

describe('List', () => {
    let mockIntersectionObserver: jest.Mock;

    beforeEach(() => {
        mockIntersectionObserver = jest.fn();
        (global as any).IntersectionObserver = jest.fn().mockImplementation((callback) => ({
            observe: mockIntersectionObserver,
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));

        mockUseRepositories.mockReturnValue({
            repositories: mockRepositories,
            loading: false,
            error: null,
            hasMore: true,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: jest.fn()
        });
    });

    it('отображает список репозиториев', () => {
        render(<List />);

        expect(screen.getByText('repo-1')).toBeInTheDocument();
        expect(screen.getByText('repo-2')).toBeInTheDocument();
    });

    it('отображает loader при загрузке', () => {
        mockUseRepositories.mockReturnValue({
            repositories: [],
            loading: true,
            error: null,
            hasMore: true,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: jest.fn()
        });

        render(<List />);

        const loader = document.querySelector('.mantine-Loader-root');
        expect(loader).toBeInTheDocument();
    });

    it('отображает сообщение об ошибке', () => {
        const errorMessage = 'Ошибка загрузки';
        mockUseRepositories.mockReturnValue({
            repositories: [],
            loading: false,
            error: errorMessage,
            hasMore: true,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: jest.fn()
        });

        render(<List />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('отображает сообщение когда нет больше репозиториев', () => {
        mockUseRepositories.mockReturnValue({
            repositories: mockRepositories,
            loading: false,
            error: null,
            hasMore: false,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: jest.fn()
        });

        render(<List />);

        expect(screen.getByText('Больше репозиториев нет')).toBeInTheDocument();
    });

    it('вызывает loadNextPage при пересечении последнего элемента', () => {
        const mockLoadNextPage = jest.fn();
        mockUseRepositories.mockReturnValue({
            repositories: mockRepositories,
            loading: false,
            error: null,
            hasMore: true,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: mockLoadNextPage
        });

        render(<List />);

        const [observerCallback] = (global.IntersectionObserver as jest.Mock).mock.calls[0];

        observerCallback([
            {
                isIntersecting: true
            }
        ]);

        expect(mockLoadNextPage).toHaveBeenCalled();
    });

    it('не вызывает loadNextPage если нет пересечения последнего элемента', () => {
        const mockLoadNextPage = jest.fn();
        mockUseRepositories.mockReturnValue({
            repositories: mockRepositories,
            loading: false,
            error: null,
            hasMore: true,
            loadRepositories: jest.fn(),
            handleDelete: jest.fn(),
            handleEdit: jest.fn(),
            loadNextPage: mockLoadNextPage
        });

        render(<List />);

        const [observerCallback] = (global.IntersectionObserver as jest.Mock).mock.calls[0];

        observerCallback([
            {
                isIntersecting: false
            }
        ]);

        expect(mockLoadNextPage).not.toHaveBeenCalled();
    });
}); 