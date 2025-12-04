import { supabase } from './supabase';

const BUCKET_NAME = 'drone-documents';

/**
 * Upload un fichier vers Supabase Storage
 * @param file Le fichier à uploader
 * @param studyId L'ID de l'étude SORA
 * @param fileType Le type de fichier (ex: 'drone-photos', 'geo-files', etc.)
 * @returns L'URL publique du fichier uploadé ou null en cas d'erreur
 */
export async function uploadFile(
    file: File,
    studyId: string,
    fileType: string
): Promise<string | null> {
    try {
        // Créer un nom de fichier unique avec timestamp
        const timestamp = Date.now();
        const fileName = `${studyId}/${fileType}/${timestamp}_${file.name}`;

        // Upload le fichier vers Supabase Storage
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
            return null;
        }

        // Récupérer l'URL publique du fichier
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Erreur lors de l\'upload du fichier:', error);
        return null;
    }
}

/**
 * Upload plusieurs fichiers vers Supabase Storage
 * @param files Les fichiers à uploader
 * @param studyId L'ID de l'étude SORA
 * @param fileType Le type de fichier
 * @returns Un tableau d'URLs publiques des fichiers uploadés
 */
export async function uploadMultipleFiles(
    files: File[],
    studyId: string,
    fileType: string
): Promise<string[]> {
    const uploadPromises = files.map(file => uploadFile(file, studyId, fileType));
    const results = await Promise.all(uploadPromises);

    // Filtrer les résultats null (échecs d'upload)
    return results.filter((url): url is string => url !== null);
}

/**
 * Supprime un fichier de Supabase Storage
 * @param fileUrl L'URL du fichier à supprimer
 * @returns true si la suppression a réussi, false sinon
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
    try {
        // Extraire le chemin du fichier depuis l'URL
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);

        if (pathParts.length < 2) {
            console.error('URL de fichier invalide:', fileUrl);
            return false;
        }

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        return false;
    }
}

/**
 * Supprime plusieurs fichiers de Supabase Storage
 * @param fileUrls Les URLs des fichiers à supprimer
 * @returns Le nombre de fichiers supprimés avec succès
 */
export async function deleteMultipleFiles(fileUrls: string[]): Promise<number> {
    const deletePromises = fileUrls.map(url => deleteFile(url));
    const results = await Promise.all(deletePromises);

    return results.filter(success => success).length;
}

/**
 * Récupère un fichier depuis une URL et le convertit en objet File
 * Utile pour charger les fichiers existants depuis Supabase
 * @param url L'URL du fichier
 * @param fileName Le nom du fichier
 * @returns Un objet File ou null en cas d'erreur
 */
export async function urlToFile(url: string, fileName: string): Promise<File | null> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error('Erreur lors de la conversion URL vers File:', error);
        return null;
    }
}
