import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test-utils/test-utils';
import { ListItem } from './ListItem';

const mockRepository = {
    id: 1,
    name: 'test-repo',
    description: 'Test description',
    stargazers_count: 1000,
    html_url: 'https://github.com/test/repo',
    owner: {
        login: 'testuser',
        avatar_url: 'https://avatar.url'
    }
};

describe('ListItem', () => {
    const mockOnDelete = jest.fn();
    const mockOnEdit = jest.fn();

    it('отображает информацию о репозитории', () => {
        render(
            <ListItem 
                repository={mockRepository} 
                onDelete={mockOnDelete} 
                onEdit={mockOnEdit}
            />
        );

        expect(screen.getByText('test-repo')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('⭐ 1000')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('вызывает функцию удаления при нажатии на кнопку удаления', () => {
        render(
            <ListItem 
                repository={mockRepository} 
                onDelete={mockOnDelete} 
                onEdit={mockOnEdit}
            />
        );

        fireEvent.click(screen.getByText('Удалить'));
        expect(mockOnDelete).toHaveBeenCalledWith(mockRepository.id);
    });

    it('переключается в режим редактирования при нажатии на кнопку редактирования', () => {
        render(
            <ListItem 
                repository={mockRepository} 
                onDelete={mockOnDelete} 
                onEdit={mockOnEdit}
            />
        );

        fireEvent.click(screen.getByText('Редактировать'));
        expect(screen.getByLabelText('Название репозитория')).toBeInTheDocument();
        expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    });

    it('сохраняет изменения при редактировании', () => {
        render(
            <ListItem 
                repository={mockRepository} 
                onDelete={mockOnDelete} 
                onEdit={mockOnEdit}
            />
        );

        fireEvent.click(screen.getByText('Редактировать'));
        
        const nameInput = screen.getByLabelText('Название репозитория');
        const descInput = screen.getByLabelText('Описание');

        fireEvent.change(nameInput, { target: { value: 'new name' } });
        fireEvent.change(descInput, { target: { value: 'new description' } });
        
        fireEvent.click(screen.getByText('Сохранить'));

        expect(mockOnEdit).toHaveBeenCalledWith(mockRepository.id, {
            ...mockRepository,
            name: 'new name',
            description: 'new description'
        });
    });

    it('отменяет редактирование при нажатии на кнопку отмены', () => {
        render(
            <ListItem 
                repository={mockRepository} 
                onDelete={mockOnDelete} 
                onEdit={mockOnEdit}
            />
        );

        fireEvent.click(screen.getByText('Редактировать'));
        
        const nameInput = screen.getByLabelText('Название репозитория');
        fireEvent.change(nameInput, { target: { value: 'new name' } });
        
        fireEvent.click(screen.getByText('Отмена'));

        expect(screen.getByText('test-repo')).toBeInTheDocument();
    });
}); 