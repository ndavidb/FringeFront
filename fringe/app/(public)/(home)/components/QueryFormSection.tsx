'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextInput,
  Textarea,
  Title,
  Container,
  Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function QueryFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      message: (value) => (value.length < 10 ? 'Message too short' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/userquery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) console.log('Something went wrong');

      setSubmitted(true);
      setError(null);
      form.reset();
    } catch (err) {
      setError(`Failed to submit query. Please try again., ${err}`);
    }
  };

  return (
    <Box bg="#fff0f6" py="xl" mt="md">
      <Container size="sm">
        <Title order={2} ta="center" mb="md">
          Submit a Query
        </Title>

        {submitted && (
          <Notification
            icon={<IconCheck size={16} />}
            color="teal"
            title="Success"
            onClose={() => setSubmitted(false)}
            mb="md"
          >
            Your query has been submitted!
          </Notification>
        )}

        {error && (
          <Notification
            icon={<IconX size={16} />}
            color="red"
            title="Error"
            onClose={() => setError(null)}
            mb="md"
          >
            {error}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            mb="sm"
          />
          <Textarea
            label="Message"
            placeholder="Your message"
            autosize
            minRows={4}
            {...form.getInputProps('message')}
            mb="md"
          />

          <Button type="submit" color="purple" fullWidth radius="md">
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
}
