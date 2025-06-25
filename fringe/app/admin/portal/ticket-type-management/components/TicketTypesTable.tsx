'use client';

import {Table, Group, Tooltip, ActionIcon, Card} from '@mantine/core';
import {IconEdit, IconTrash} from '@tabler/icons-react';
import {TicketType} from "@/types/api/TicketType";
import React from "react";

interface Props {
    data: TicketType[];
    onEdit: (item: TicketType) => void;
    onDelete: (item: TicketType) => void;
}

export default function TicketTypesTable({data, onEdit, onDelete}: Props) {
    return (
        <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Type Name</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((item) => (
                        <Table.Tr key={item.ticketTypeId}>
                            <Table.Td>{item.typeName}</Table.Td>
                            <Table.Td>{item.description}</Table.Td>

                            <Table.Td>
                                <Group gap="xs">

                                    <Tooltip label="Edit">
                                        <ActionIcon variant="light" color="green" onClick={() => onEdit(item)}>
                                            <IconEdit size="1rem"/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Delete">
                                        <ActionIcon variant="light" color="red" onClick={() => onDelete(item)}>
                                            <IconTrash size="1rem"/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            </Card>
            );
            }
