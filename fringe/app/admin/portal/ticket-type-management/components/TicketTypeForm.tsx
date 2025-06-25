'use client';

import { Modal, TextInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

interface Props {
  opened: boolean;
  onClose: () => void;
  initialValues?: { typeName: string; description: string };
  onSubmit: (data: { typeName: string; description: string }) => void;
}

export default function TicketTypeForm({ opened, onClose, initialValues, onSubmit }: Props) {
  const form = useForm({
    initialValues: {
      typeName: initialValues?.typeName || '',
      description: initialValues?.description || '',
    },
    validate: {
      typeName: (value) => {
        if (value.length < 2) return 'Type name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Type name can only contain letters and spaces';
        return null;
      },
      description: (value) => {
        if (value.length < 2) return 'Description must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Description can only contain letters and spaces';
        return null;
      }
    },
  });

  // Reinitialize form values when editing
  useEffect(() => {
    form.setValues({
      typeName: initialValues?.typeName || '',
      description: initialValues?.description || '',
    });
  }, [initialValues]);

  const handleSubmit = () => {
    if (form.isValid()) {
      onSubmit(form.values);
      onClose();
    }
  };

  // Optional: Prevent typing non-letter characters
  const handleTypeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    // Only update if empty or contains only letters and spaces
    if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
      form.setFieldValue('typeName', value);
    }
  };

  return (
      <Modal
          opened={opened}
          onClose={onClose}
          title={initialValues ? 'Edit Ticket Type' : 'Add Ticket Type'}
          centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
              label="Type Name"
              placeholder="e.g. Student, VIP"
              {...form.getInputProps('typeName')}
              onChange={handleTypeNameChange}
          />
          <TextInput
              label="Description"
              placeholder="Optional description"
              mt="md"
              {...form.getInputProps('description')}
          />
          <Group mt="lg" justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialValues ? 'Update' : 'Create'}</Button>
          </Group>
        </form>
      </Modal>
  );
}