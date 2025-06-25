'use client';

import {
  Button,
  Group,
  Modal,
  Text,
} from '@mantine/core';

interface DeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  itemName: string;
  isDeleting?: boolean;
}

export default function DeleteModal({
                                      opened,
                                      onClose,
                                      onDelete,
                                      title,
                                      itemName,
                                      isDeleting = false,
                                    }: DeleteModalProps) {
  return (
      <Modal
          opened={opened}
          onClose={onClose}
          title={title}
          centered
          overlayProps={{
            blur: 3,
            opacity: 0.55,
          }}
          closeOnClickOutside={!isDeleting}
          closeOnEscape={!isDeleting}
      >
        <Text size="sm">Are you sure you want to delete <b>{itemName}</b>?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button color="red" onClick={onDelete} loading={isDeleting}>
            Delete
          </Button>
        </Group>
      </Modal>
  );
}