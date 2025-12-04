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
