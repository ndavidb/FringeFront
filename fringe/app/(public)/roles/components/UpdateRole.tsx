"use client";

import { Role } from '@/types/role';
import { updateRole } from '@/services/rolesService';
import {
    Button,
    TextInput,
    Checkbox,
    Group,
    Stack,
    Title,
    SimpleGrid,
    Alert,
    rem,
    Modal
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from "@tanstack/react-query";
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

interface UpdateRoleFormProps {
    role: Role | null;
    opened: boolean;
    onClose: () => void;
}

export default function UpdateRoleForm({ role, opened, onClose }: UpdateRoleFormProps) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm({
        initialValues: {
            roleId: role?.roleId || 0,
            roleName: role?.roleName || '',
            canCreate: role?.canCreate || false,
            canRead: role?.canRead || false,
            canEdit: role?.canEdit || false,
            canDelete: role?.canDelete || false,
        },
        validate: {
            roleName: (value) => (!value ? 'Role name is required' : null),
        },
    });

    // Update form when role changes
    if (role && role.roleId !== form.values.roleId) {
        form.setValues({
            roleId: role.roleId,
            roleName: role.roleName,
            canCreate: role.canCreate,
            canRead: role.canRead,
            canEdit: role.canEdit,
            canDelete: role.canDelete,
        });
    }

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError('');

        try {
            const updatedRole: Role = {
                ...values,
                roleId: role?.roleId || 0
            };

            await updateRole(updatedRole);
            await queryClient.invalidateQueries({ queryKey: ['roles'] });
            onClose();
        } catch (err) {
            setError('Failed to update role. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Role" centered>
            {error && (
                <Alert
                    icon={<IconAlertCircle size={rem(16)} />}
                    title="Error"
                    color="red"
                    mb="md"
                    variant="light"
                >
                    {error}
                </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        required
                        label="Role Name"
                        placeholder="Enter role name"
                        {...form.getInputProps('roleName')}
                    />

                    <Title order={6} mt="xs">Permissions</Title>
                    <SimpleGrid cols={{ base: 1, xs: 2, sm: 2 }}>
                        <Checkbox
                            label="Can Create"
                            {...form.getInputProps('canCreate', { type: 'checkbox' })}
                        />
                        <Checkbox
                            label="Can Read"
                            {...form.getInputProps('canRead', { type: 'checkbox' })}
                        />
                        <Checkbox
                            label="Can Edit"
                            {...form.getInputProps('canEdit', { type: 'checkbox' })}
                        />
                        <Checkbox
                            label="Can Delete"
                            {...form.getInputProps('canDelete', { type: 'checkbox' })}
                        />
                    </SimpleGrid>

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" loading={loading} color="blue">
                            Update Role
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}