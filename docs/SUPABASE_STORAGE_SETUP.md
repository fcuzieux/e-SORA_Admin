# Configuration de Supabase Storage pour les fichiers DroneForm

## Vue d'ensemble

Ce document explique comment configurer Supabase Storage pour sauvegarder les images et documents techniques du formulaire DroneForm.

## Étapes de configuration dans Supabase

### 1. Créer un bucket de stockage

1. Connectez-vous à votre tableau de bord Supabase
2. Allez dans **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Configurez le bucket avec les paramètres suivants :
   - **Name**: `drone-documents`
   - **Public bucket**: Cochez cette option pour permettre l'accès public aux fichiers
   - **File size limit**: 10 MB (pour supporter les fichiers KML/KMZ)
   - **Allowed MIME types**: 
     - `image/png`, `image/jpeg`, `image/jpg` (images du drone)
     - `application/vnd.google-earth.kml+xml` (fichiers KML)
     - `application/vnd.google-earth.kmz` (fichiers KMZ)
     - `application/geo+json`, `application/json` (fichiers GeoJSON)
     - `text/html` (fichiers de sortie Drosera)

### 2. Configurer les politiques de sécurité (RLS)

Pour permettre aux utilisateurs authentifiés d'uploader et de lire leurs fichiers, créez les politiques suivantes :

#### Politique de lecture (SELECT)
```sql
CREATE POLICY "Permettre la lecture publique des fichiers"
ON storage.objects FOR SELECT
USING (bucket_id = 'drone-documents');
```

#### Politique d'upload (INSERT)
```sql
CREATE POLICY "Permettre l'upload aux utilisateurs authentifiés"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'drone-documents' 
  AND auth.role() = 'authenticated'
);
```

#### Politique de mise à jour (UPDATE)
```sql
CREATE POLICY "Permettre la mise à jour aux propriétaires"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'drone-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'drone-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Politique de suppression (DELETE)
```sql
CREATE POLICY "Permettre la suppression aux propriétaires"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'drone-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Structure des fichiers

Les fichiers sont organisés selon la structure suivante :
```
drone-documents/
  └── {studyId}/
      ├── drone-photos/
      │   └── {timestamp}_{filename}.jpg|png
      ├── operation-geo-files/
      │   └── {timestamp}_{filename}.kml|kmz|geojson
      ├── risk-assessment-traj-files/
      │   └── {timestamp}_{filename}.kml|kmz|geojson
      └── drosera-output-files/
          └── {timestamp}_{filename}.html
```

Exemple :
```
drone-documents/
  └── 123e4567-e89b-12d3-a456-426614174000/
      ├── drone-photos/
      │   ├── 1701234567890_drone_front.jpg
      │   ├── 1701234567891_drone_side.jpg
      │   └── 1701234567892_schema.png
      ├── operation-geo-files/
      │   ├── 1701234567893_zone_operation.kml
      │   └── 1701234567894_trajectory.kmz
      ├── risk-assessment-traj-files/
      │   └── 1701234567895_Trajectoire_Mission1.kml
      └── drosera-output-files/
          └── 1701234567896_drosera_output.html
```

## Fonctionnement du système

### 1. Upload de fichiers

Lorsque l'utilisateur clique sur "Sauvegarder" :

1. Le composant `SaveButton` récupère les fichiers du formulaire
2. Si un `studyId` existe, les fichiers sont uploadés vers Supabase Storage
3. Les URLs publiques des fichiers uploadés sont récupérées
4. Ces URLs sont stockées dans le champ `technicalDocumentUrls` de l'objet `DroneInfo`
5. Les données sont sauvegardées dans la table `sora_studies`

### 2. Chargement de fichiers existants

Lorsqu'une étude existante est chargée :

1. Le composant `DroneForm` détecte la présence d'URLs dans `technicalDocumentUrls`
2. Il télécharge les fichiers depuis ces URLs
3. Les fichiers sont convertis en objets `File` pour l'affichage dans le formulaire
4. L'utilisateur peut voir les images existantes et en ajouter de nouvelles

### 3. Suppression de fichiers

Lorsqu'un fichier est supprimé du formulaire :

1. Le fichier est retiré du tableau `technicalDocuments`
2. Lors de la prochaine sauvegarde, seuls les fichiers restants seront uploadés
3. Les anciens fichiers restent dans Supabase Storage (pas de suppression automatique)

**Note**: Pour implémenter la suppression automatique des fichiers non utilisés, vous devrez :
- Comparer les URLs existantes avec les nouvelles URLs après upload
- Appeler `deleteFile()` pour chaque URL qui n'est plus utilisée

## Services disponibles

Le fichier `src/lib/storageService.ts` fournit les fonctions suivantes :

### `uploadFile(file: File, studyId: string, fileType: string): Promise<string | null>`
Upload un seul fichier vers Supabase Storage.

### `uploadMultipleFiles(files: File[], studyId: string, fileType: string): Promise<string[]>`
Upload plusieurs fichiers en parallèle.

### `deleteFile(fileUrl: string): Promise<boolean>`
Supprime un fichier depuis Supabase Storage.

### `deleteMultipleFiles(fileUrls: string[]): Promise<number>`
Supprime plusieurs fichiers en parallèle.

### `urlToFile(url: string, fileName: string): Promise<File | null>`
Convertit une URL en objet File (utile pour charger les fichiers existants).

## Limitations actuelles

1. **Taille des fichiers**: Limitée à 500 Ko par fichier (configurable dans `DroneForm.tsx`)
2. **Types de fichiers**: Uniquement PNG, JPG, JPEG
3. **Suppression**: Les fichiers supprimés du formulaire ne sont pas automatiquement supprimés de Supabase Storage

## Améliorations futures possibles

1. **Nettoyage automatique**: Implémenter la suppression automatique des fichiers non utilisés
2. **Compression d'images**: Compresser les images avant l'upload pour réduire la taille
3. **Miniatures**: Générer des miniatures pour un chargement plus rapide
4. **Barre de progression**: Afficher la progression de l'upload pour les gros fichiers
5. **Validation côté serveur**: Ajouter une validation des fichiers côté serveur avec Supabase Edge Functions

## Dépannage

### Les fichiers ne s'uploadent pas
- Vérifiez que le bucket `drone-documents` existe
- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur est authentifié
- Consultez la console du navigateur pour les erreurs

### Les fichiers ne se chargent pas
- Vérifiez que les URLs sont correctement stockées dans la base de données
- Vérifiez que le bucket est configuré comme public
- Vérifiez la politique de lecture (SELECT)

### Erreur CORS
- Assurez-vous que votre domaine est autorisé dans les paramètres Supabase
- Vérifiez la configuration CORS dans les paramètres du projet Supabase
