import React, {useState} from 'react';
import {Card, Text, Group, Button, TextInput, Stack, Avatar, Box} from '@mantine/core';
import { Repository } from '../../types/Repository.ts';
import styles from './ListItem.module.css';

interface ListItemProps {
    repository: Repository,
    onDelete: (id: number) => void,
    onEdit: (id: number, updatedRepo: Repository) => void,
    ref?: React.RefObject<null> | null
}

export function ListItem({repository, onDelete, onEdit, ref}: ListItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(repository.name);
    const [editedDescription, setEditedDescription] = useState(repository.description);

    const handleSave = () => {
        onEdit(repository.id, {
            ...repository,
            name: editedName,
            description: editedDescription,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(repository.name);
        setEditedDescription(repository.description);
        setIsEditing(false);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder ref={ref}>
            {isEditing ? (
                <Stack>
                    <TextInput
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        label="Название репозитория"
                    />
                    <TextInput
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        label="Описание"
                    />
                    <Group justify="flex-end">
                        <Button onClick={handleCancel} variant="light" color="red">
                            Отмена
                        </Button>
                        <Button onClick={handleSave} variant="light" color="blue">
                            Сохранить
                        </Button>
                    </Group>
                </Stack>
            ) : (
                <>
                    <Box component="a" href={repository.html_url} target="_blank" className={styles.repository__header}>
                        <Group>
                            <Avatar src={repository.owner.avatar_url} alt={repository.owner.login}/>
                            <div>
                                <Text fw={500}>
                                    {repository.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {repository.owner.login}
                                </Text>
                            </div>
                        </Group>
                    </Box>
                    <Text mt="sm" size="sm">
                        {repository.description}
                    </Text>
                    <Text mt="sm" size="sm">
                        ⭐ {repository.stargazers_count}
                    </Text>
                    <Group mt="md" justify="flex-end">
                        <Button onClick={() => setIsEditing(true)} variant="light">
                            Редактировать
                        </Button>
                        <Button onClick={() => onDelete(repository.id)} color="red" variant="light">
                            Удалить
                        </Button>
                    </Group>
                </>
            )}
        </Card>
    );
}

export default ListItem;