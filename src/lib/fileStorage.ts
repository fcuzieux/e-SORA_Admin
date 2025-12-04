import { supabase } from './supabase';

export interface FileMetadata {
    name: string;
    url: string;
    size: number;
    type: string;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param studyId - The study ID to organize files
 * @param category - Category of file (geo, technical, trajectory, drosera)
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
    file: File,
    studyId: string,
    category: 'geo' | 'technical' | 'trajectory' | 'drosera'
): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${studyId}/${category}/${timestamp}_${file.name}`;

    const { error } = await supabase.storage
        .from('sora-file')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('sora-file')
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Upload multiple files and return their metadata
 */
export async function uploadFiles(
    files: File[],
    studyId: string,
    category: 'geo' | 'technical' | 'trajectory' | 'drosera'
): Promise<FileMetadata[]> {
    const uploadPromises = files.map(async (file) => {
        const url = await uploadFile(file, studyId, category);
        return {
            name: file.name,
            url,
            size: file.size,
            type: file.type,
        };
    });

    return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
    // Extract the file path from the URL
    const urlParts = fileUrl.split('/sora-file/');
    if (urlParts.length < 2) {
        console.error('Invalid file URL:', fileUrl);
        return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
        .from('sora-file')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting file:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

/**
 * Delete all files for a study
 */
export async function deleteStudyFiles(studyId: string): Promise<void> {
    const { data: files, error: listError } = await supabase.storage
        .from('sora-file')
        .list(studyId);

    if (listError) {
        console.error('Error listing files:', listError);
        return;
    }

    if (!files || files.length === 0) {
        return;
    }

    const filePaths = files.map((file) => `${studyId}/${file.name}`);

    const { error: deleteError } = await supabase.storage
        .from('sora-file')
        .remove(filePaths);

    if (deleteError) {
        console.error('Error deleting study files:', deleteError);
        throw new Error(`Failed to delete study files: ${deleteError.message}`);
    }
}

/**
 * Convert File objects to FileMetadata for serialization
 * This should be called before saving to database
 */
export async function prepareFormDataForSave(
    formData: any,
    studyId: string
): Promise<any> {
    const prepared = { ...formData };

    // Handle drone technical documents
    if (formData.drone?.technicalDocuments?.length > 0) {
        const hasFileObjects = formData.drone.technicalDocuments.some(
            (item: any) => item instanceof File
        );
        if (hasFileObjects) {
            prepared.drone = {
                ...prepared.drone,
                technicalDocuments: await uploadFiles(
                    formData.drone.technicalDocuments,
                    studyId,
                    'technical'
                ),
            };
        }
    }

    // Handle operation geo files
    if (formData.operation?.geoFiles?.length > 0) {
        const hasFileObjects = formData.operation.geoFiles.some(
            (item: any) => item instanceof File
        );
        if (hasFileObjects) {
            prepared.operation = {
                ...prepared.operation,
                geoFiles: await uploadFiles(
                    formData.operation.geoFiles,
                    studyId,
                    'geo'
                ),
            };
        }
    }

    // Handle risk assessment trajectory files
    if (formData.RiskAssessment?.trajgeoFiles?.length > 0) {
        const hasFileObjects = formData.RiskAssessment.trajgeoFiles.some(
            (item: any) => item instanceof File
        );
        if (hasFileObjects) {
            prepared.RiskAssessment = {
                ...prepared.RiskAssessment,
                trajgeoFiles: await uploadFiles(
                    formData.RiskAssessment.trajgeoFiles,
                    studyId,
                    'trajectory'
                ),
            };
        }
    }

    // Handle drosera output files
    if (formData.RiskAssessment?.droseraOutputFile?.length > 0) {
        const hasFileObjects = formData.RiskAssessment.droseraOutputFile.some(
            (item: any) => item instanceof File
        );
        if (hasFileObjects) {
            prepared.RiskAssessment = {
                ...prepared.RiskAssessment,
                droseraOutputFile: await uploadFiles(
                    formData.RiskAssessment.droseraOutputFile,
                    studyId,
                    'drosera'
                ),
            };
        }
    }

    return prepared;
}

/**
 * Convert FileMetadata back to File-like objects for the form
 * This should be called after loading from database
 */
export function restoreFormDataFiles(formData: any): any {
    // For now, we'll keep the metadata as-is since the forms can work with URLs
    // If you need actual File objects, you'd need to fetch them
    return formData;
}
