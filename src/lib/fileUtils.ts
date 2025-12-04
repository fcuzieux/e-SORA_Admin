import { FileMetadata } from '../types/sora';

/**
 * Check if an item is a File object or FileMetadata
 */
export function isFileObject(item: File | FileMetadata): item is File {
    return item instanceof File;
}

/**
 * Convert FileMetadata or File to a File object for processing
 * If it's already a File, return it as-is
 * If it's FileMetadata, fetch the file from the URL and create a File object
 */
export async function toFileObject(item: File | FileMetadata): Promise<File> {
    if (isFileObject(item)) {
        return item;
    }

    // It's FileMetadata, fetch the file from the URL
    try {
        const response = await fetch(item.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from ${item.url}: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create a File object from the blob
        return new File([blob], item.name, { type: item.type });
    } catch (error) {
        console.error('Error converting FileMetadata to File:', error);
        throw error;
    }
}

/**
 * Convert an array of File or FileMetadata to File objects
 */
export async function toFileObjects(items: (File | FileMetadata)[]): Promise<File[]> {
    return Promise.all(items.map(item => toFileObject(item)));
}

/**
 * Get the name from either a File or FileMetadata
 */
export function getFileName(item: File | FileMetadata): string {
    if (isFileObject(item)) {
        return item.name;
    }
    return item.name;
}

/**
 * Get the size from either a File or FileMetadata
 */
export function getFileSize(item: File | FileMetadata): number {
    if (isFileObject(item)) {
        return item.size;
    }
    return item.size;
}

/**
 * Get the type from either a File or FileMetadata
 */
export function getFileType(item: File | FileMetadata): string {
    if (isFileObject(item)) {
        return item.type;
    }
    return item.type;
}
