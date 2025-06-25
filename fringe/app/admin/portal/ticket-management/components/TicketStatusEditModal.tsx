'use client';

import {
  Modal,
  Group,
  Button,
  Alert,
  Stack,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertTriangle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Props {
  opened: boolean;
  onClose: () => void;
  bookingRef: string;
  onSubmit: (data: { isCheckedIn: boolean; cancelled: boolean }) => void;

  currentIsCheckedIn: boolean;
  currentCancelled: boolean;
}

export default function TicketStatusEditModal({
  opened,
  onClose,
  bookingRef,
  onSubmit,
  currentIsCheckedIn,
  currentCancelled,
}: Props) {
  const form = useForm({
    initialValues: {
      isCheckedIn: false,
      cancelled: false,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (values.isCheckedIn && values.cancelled) {
      notifications.show({
        title: 'Invalid Action',
        message: 'You can only select one status: Checked-In or Cancelled.',
        color: 'red',
      });
      return;
    }

    if (
      values.isCheckedIn === currentIsCheckedIn &&
      values.cancelled === currentCancelled
    ) {
      notifications.show({
        title: 'No Changes Detected',
        message: 'Please change the status before submitting.',
        color: 'yellow',
      });
      return;
    }

    onSubmit(values);
    onClose();
  };

  const handleCheckboxChange = (field: 'isCheckedIn' | 'cancelled') => {
    const opposite = field === 'isCheckedIn' ? 'cancelled' : 'isCheckedIn';
    form.setFieldValue(field, !form.values[field]);
    form.setFieldValue(opposite, false); // uncheck the other one
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Bulk Update Tickets - ${bookingRef}`}
      size="md"
      centered
    >
      <Stack gap="md">
        <Alert
          icon={<IconAlertTriangle size={18} />}
          color="red"
          title="Bulk Action Warning"
        >
          This will update the <strong>status of all tickets</strong> under booking reference <strong>{bookingRef}</strong>. You can only apply <strong>one status at a time</strong>.
        </Alert>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Checkbox
              label="Mark all as Checked-In"
              checked={form.values.isCheckedIn}
              onChange={() => handleCheckboxChange('isCheckedIn')}
            />
            <Checkbox
              label="Mark all as Cancelled"
              checked={form.values.cancelled}
              onChange={() => handleCheckboxChange('cancelled')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                Update Status
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
