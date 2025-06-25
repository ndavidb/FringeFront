// app/(public)/(home)/roles/components/RolesTable.tsx
"use client";

import { deleteRoles, getRoles } from "@/services/rolesService";
import { Table, Badge, Group, Alert, Skeleton, Button, Title, Box } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { Role } from "@/types/role";
import UpdateRoleForm from "./UpdateRole";

export default function RolesTable() {
    const queryClient = useQueryClient();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const { data: roles = [], isLoading, error } = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles
    });

    const handleDelete = async (roleId: number) => {
        try {
            await deleteRoles(roleId);
            await queryClient.invalidateQueries({ queryKey: ['roles'] });
        } catch (err) {
            console.error("Failed to delete role:", err);
        }
    };

    const openUpdateModal = (role: Role) => {
        setSelectedRole(role);
        setUpdateModalOpen(true);
    };

    return (
        <div>
            <Title order={3} mb="md">Test Get, Put, and Delete</Title>

            {isLoading && (
                <>
                    <Skeleton height={40} mb="md" width="100%" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} mb="sm">
                            <Skeleton height={50} width="100%" />
                        </Box>
                    ))}
                </>
            )}

            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                    mb="md"
                >
                    {(error as Error).message}
                </Alert>
            )}

            {!isLoading && !error && (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Role Name</Table.Th>
                            <Table.Th>Permissions</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {roles.map((role) => (
                            <Table.Tr key={role.roleId}>
                                <Table.Td>{role.roleName}</Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        {role.canCreate && <Badge color="green">Create</Badge>}
                                        {role.canRead && <Badge color="blue">Read</Badge>}
                                        {role.canEdit && <Badge color="yellow">Edit</Badge>}
                                        {role.canDelete && <Badge color="red">Delete</Badge>}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Button onClick={() => openUpdateModal(role)} color="blue">Edit</Button>
                                        <Button onClick={() => handleDelete(role.roleId)} color="red">Delete</Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <UpdateRoleForm
                role={selectedRole}
                opened={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
            />
        </div>
    );
}