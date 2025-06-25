'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Text,
    Image,
    Button,
    Group,
    FileButton,
    Stack,
    Progress,
    Flex,
    ActionIcon
} from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { uploadFile } from '@/services/fileUploadService';

interface ImageUploaderProps {
    label: string;
    currentImageUrl?: string;
    onImageSelected: (file: File | null) => void;
    onImageUploaded?: (path: string) => void;
    uploadType?: 'venue' | 'show';
    showUploadButton?: boolean;
}

export function ImageUploader({
                                  label,
                                  currentImageUrl = '',
                                  onImageSelected,
                                  onImageUploaded,
                                  uploadType = 'venue',
                                  showUploadButton = false
                              }: ImageUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const resetRef = useRef<() => void>(null);

    // Handle file selection
    const handleFileChange = (file: File | null) => {
        // Reset states
        setError(null);
        setProgress(0);

        if (!file) {
            setSelectedFile(null);
            setPreviewUrl(currentImageUrl);
            onImageSelected(null);
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please select a JPG, PNG, or GIF file.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('File is too large. Maximum size is 5MB.');
            return;
        }

        // Create a preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setSelectedFile(file);

        // Notify parent component
        onImageSelected(file);

        // Simulate progress for better UX
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev < 100) return prev + 5;
                clearInterval(interval);
                return prev;
            });
        }, 100);

        // If we want immediate upload, trigger it
        if (!showUploadButton && onImageUploaded) {
            handleUpload(file);
        }
    };

    // Handle the actual upload process
    const handleUpload = async (fileToUpload: File) => {
        if (!fileToUpload || !onImageUploaded) return;

        try {
            setUploading(true);
            setError(null);

            // Upload the file
            const path = await uploadFile(fileToUpload, uploadType);

            // Complete the progress bar
            setProgress(100);

            // Notify parent component
            onImageUploaded(path);

            // Reset progress after a short delay
            setTimeout(() => {
                setProgress(0);
                setUploading(false);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
            setUploading(false);
            setProgress(0);
        }
    };

    // Reset the component
    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(currentImageUrl);
        setProgress(0);
        setError(null);
        if (resetRef.current) {
            resetRef.current();
        }
        onImageSelected(null);
    };

    return (
        <Box>
            <Text fw={500} size="sm" mb={5}>{label}</Text>

            {(previewUrl || selectedFile) ? (
                <Box mb="md" pos="relative">
                    <Image
                        src={previewUrl}
                        alt={label}
                        radius="md"
                        h={200}
                        fit="contain"
                        fallbackSrc="https://placehold.co/600x400?text=No+Image"
                    />
                    <ActionIcon
                        color="red"
                        radius="xl"
                        variant="filled"
                        pos="absolute"
                        top={5}
                        right={5}
                        onClick={handleReset}
                    >
                        <IconX size="1rem" />
                    </ActionIcon>
                </Box>
            ) : (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    h={200}
                    bg="gray.1"
                    mb="md"
                    style={{ border: '2px dashed #ced4da', borderRadius: '8px' }}
                >
                    <IconPhoto size={48} stroke={1.5} color="#ced4da" />
                    <Text c="dimmed" size="sm" mt="xs" ta="center">
                        No image selected
                    </Text>
                </Flex>
            )}

            {progress > 0 && (
                <Progress
                    value={progress}
                    size="sm"
                    color={progress === 100 ? 'green' : 'blue'}
                    mb="md"
                    striped
                    animated={progress < 100}
                />
            )}

            {error && (
                <Text c="red" size="sm" mb="md">
                    {error}
                </Text>
            )}

            <Stack>
                <Group>
                    <FileButton
                        resetRef={resetRef}
                        accept="image/png,image/jpeg,image/gif,image/jpg"
                        onChange={handleFileChange}
                    >
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={<IconUpload size="1rem" />}
                                variant="outline"
                                loading={uploading}
                                disabled={uploading}
                            >
                                Select image
                            </Button>
                        )}
                    </FileButton>

                    {showUploadButton && selectedFile && onImageUploaded && (
                        <Button
                            onClick={() => handleUpload(selectedFile)}
                            loading={uploading}
                            disabled={!selectedFile || uploading}
                            color="green"
                        >
                            Upload
                        </Button>
                    )}
                </Group>

                <Text size="xs" c="dimmed">
                    Accepts JPG, PNG and GIF. Max file size 5MB.
                </Text>
            </Stack>
        </Box>
    );
}