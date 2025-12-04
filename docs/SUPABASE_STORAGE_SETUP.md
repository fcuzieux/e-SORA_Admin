# Configuration Supabase Storage pour e-SORA Admin

Ce guide vous explique comment configurer le stockage de fichiers dans Supabase pour l'application e-SORA Admin.

## Étape 1 : Créer le Bucket

1. **Accédez à votre projet Supabase**
   - Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sélectionnez votre projet e-SORA Admin

2. **Naviguez vers Storage**
   - Dans le menu latéral gauche, cliquez sur **Storage**
   - Vous verrez la liste des buckets existants (probablement vide)

3. **Créez un nouveau bucket**
   - Cliquez sur le bouton **"New bucket"** ou **"Create bucket"**
   - Remplissez les informations :
     - **Name** : `sora-files`
     - **Public bucket** : ✅ **Cochez cette case** (important pour que les URLs soient accessibles)
     - **File size limit** : Laissez par défaut ou définissez selon vos besoins (ex: 50 MB)
     - **Allowed MIME types** : Laissez vide pour autoriser tous les types
   - Cliquez sur **"Create bucket"**

## Étape 2 : Configurer les Politiques d'Accès (RLS Policies)

Par défaut, même un bucket public nécessite des politiques d'accès. Voici comment les configurer :

### Option A : Via l'Interface Supabase (Recommandé)

1. **Accédez aux politiques du bucket**
   - Cliquez sur le bucket `sora-files` que vous venez de créer
   - Cliquez sur l'onglet **"Policies"** en haut

2. **Créez une politique pour l'upload (INSERT)**
   - Cliquez sur **"New Policy"**
   - Sélectionnez **"Create a policy from scratch"**
   - Remplissez :
     - **Policy name** : `Allow authenticated users to upload files`
     - **Allowed operation** : Cochez **INSERT**
     - **Target roles** : `authenticated`
     - **USING expression** : `true`
     - **WITH CHECK expression** : `(bucket_id = 'sora-files')`
   - Cliquez sur **"Review"** puis **"Save policy"**

3. **Créez une politique pour la lecture (SELECT)**
   - Cliquez sur **"New Policy"**
   - Remplissez :
     - **Policy name** : `Allow public read access`
     - **Allowed operation** : Cochez **SELECT**
     - **Target roles** : `public`, `authenticated`
     - **USING expression** : `(bucket_id = 'sora-files')`
   - Cliquez sur **"Review"** puis **"Save policy"**

4. **Créez une politique pour la suppression (DELETE)**
   - Cliquez sur **"New Policy"**
   - Remplissez :
     - **Policy name** : `Allow authenticated users to delete their files`
     - **Allowed operation** : Cochez **DELETE**
     - **Target roles** : `authenticated`
     - **USING expression** : `(bucket_id = 'sora-files')`
   - Cliquez sur **"Review"** puis **"Save policy"**

### Option B : Via SQL (Alternative)

Si vous préférez utiliser SQL, allez dans **SQL Editor** et exécutez :

```sql
-- Politique pour permettre aux utilisateurs authentifiés d'uploader des fichiers
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sora-files');

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sora-files');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer leurs fichiers
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sora-files');

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs fichiers
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sora-files')
WITH CHECK (bucket_id = 'sora-files');
```

## Étape 3 : Vérifier la Configuration

1. **Testez l'upload**
   - Retournez dans votre application e-SORA Admin
   - Essayez de sauvegarder une étude avec des fichiers
   - Vérifiez dans Supabase Storage que les fichiers apparaissent

2. **Vérifiez la structure des dossiers**
   - Les fichiers devraient être organisés ainsi :
     ```
     sora-files/
     ├── {study-id}/
     │   ├── geo/
     │   │   └── {timestamp}_{filename}.kml
     │   ├── technical/
     │   │   └── {timestamp}_{filename}.pdf
     │   ├── trajectory/
     │   │   └── {timestamp}_{filename}.kml
     │   └── drosera/
     │       └── {timestamp}_{filename}.html
     ```

## Étape 4 : Configuration Avancée (Optionnel)

### Limiter la taille des fichiers

Dans les paramètres du bucket, vous pouvez définir :
- **Maximum file size** : 50 MB (ou selon vos besoins)

### Définir des types MIME autorisés

Pour plus de sécurité, vous pouvez restreindre les types de fichiers :
- `application/vnd.google-earth.kml+xml` (KML)
- `application/vnd.google-earth.kmz` (KMZ)
- `application/geo+json` (GeoJSON)
- `text/html` (HTML pour Drosera)
- `application/pdf` (PDF pour documents techniques)
- `image/*` (Images)

### Configurer la durée de vie des fichiers (TTL)

Si vous souhaitez supprimer automatiquement les anciens fichiers :
1. Allez dans **Database** > **Functions**
2. Créez une fonction pour nettoyer les fichiers orphelins

## Dépannage

### Erreur "new row violates row-level security policy"
- Vérifiez que les politiques RLS sont bien créées
- Assurez-vous que l'utilisateur est authentifié

### Erreur "Bucket not found"
- Vérifiez que le nom du bucket est exactement `sora-files`
- Vérifiez que le bucket est bien créé dans le bon projet

### Les fichiers ne s'affichent pas
- Vérifiez que le bucket est **public**
- Vérifiez que la politique SELECT existe pour `public`

### Erreur CORS
- Supabase gère automatiquement CORS pour les buckets publics
- Si vous avez des problèmes, vérifiez les paramètres CORS dans les settings du projet

## Structure des Métadonnées Sauvegardées

Après l'upload, les fichiers sont remplacés par des objets de métadonnées :

```typescript
{
  name: "mon-fichier.kml",
  url: "https://{project-ref}.supabase.co/storage/v1/object/public/sora-files/{study-id}/geo/{timestamp}_mon-fichier.kml",
  size: 12345,
  type: "application/vnd.google-earth.kml+xml"
}
```

Ces métadonnées sont ensuite sauvegardées dans la base de données PostgreSQL avec le reste du formulaire.

## Prochaines Étapes

Une fois le bucket configuré :
1. ✅ Testez la sauvegarde d'une étude avec des fichiers
2. ✅ Vérifiez que les fichiers apparaissent dans Storage
3. ✅ Testez le chargement d'une étude existante
4. ✅ Vérifiez que les cartes affichent correctement les fichiers

---

**Note** : Si vous rencontrez des problèmes, vérifiez les logs dans la console du navigateur et les logs Supabase dans l'onglet "Logs" de votre projet.

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
