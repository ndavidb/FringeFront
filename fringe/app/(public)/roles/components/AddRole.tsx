"use client";
// components/AddRoleForm.tsx
import {Role} from '@/types/role';
import {addRole} from '@/services/rolesService';
import {
    Button,
    TextInput,
    Checkbox,
    Group,
    Stack,
    Paper,
    Title,
    SimpleGrid,
    Alert,
    rem
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useQueryClient} from "@tanstack/react-query";
import {IconAlertCircle} from '@tabler/icons-react';
import {useState} from 'react';

export default function AddRoleForm() {
    const queryClient = useQueryClient();

    const form = useForm({
        initialValues: {
            roleName: '',
            canCreate: false,
            canRead: false,
            canEdit: false,
            canDelete: false,
        },

        validate: {
            roleName: (value) => (!value ? 'Role name is required' : null),
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError('');

        try {
            const newRole: Role = {
                roleId: 0,
                ...values
            };

            await addRole(newRole);
            form.reset();
            await queryClient.invalidateQueries({queryKey: ['roles']});
        } catch (err) {
            setError('Failed to add role. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Title order={3} mb="md">Test Create Role</Title>
            <Paper p="md" withBorder radius="md">

                {error && (
                    <Alert
                        icon={<IconAlertCircle size={rem(16)}/>}
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
                        <SimpleGrid cols={{base: 1, xs: 2, sm: 4}}>
                            <Checkbox
                                label="Can Create"
                                {...form.getInputProps('canCreate', {type: 'checkbox'})}
                            />
                            <Checkbox
                                label="Can Read"
                                {...form.getInputProps('canRead', {type: 'checkbox'})}
                            />
                            <Checkbox
                                label="Can Edit"
                                {...form.getInputProps('canEdit', {type: 'checkbox'})}
                            />
                            <Checkbox
                                label="Can Delete"
                                {...form.getInputProps('canDelete', {type: 'checkbox'})}
                            />
                        </SimpleGrid>

                        <Group justify="flex-end" mt="md">
                            <Button type="submit" loading={loading} color="red">
                                Add Role
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </div>
    );
}