# Système de Sauvegarde des Fichiers - Documentation

## 📋 Vue d'Ensemble

Ce document explique comment le système de sauvegarde des fichiers fonctionne dans l'application e-SORA Admin après la mise à jour pour utiliser Supabase Storage.

## 🔄 Flux de Sauvegarde

### 1. Upload de Fichiers par l'Utilisateur

Quand l'utilisateur ajoute des fichiers (KML, KMZ, GeoJSON, etc.) dans les formulaires :
- Les fichiers sont stockés temporairement comme objets `File` dans le state React
- Ils sont affichés dans l'interface utilisateur
- Les cartes peuvent les traiter et les afficher immédiatement

### 2. Sauvegarde de l'Étude

Quand l'utilisateur clique sur "Sauvegarder" :

```typescript
// Dans SaveButton.tsx
const handleSave = async () => {
  // 1. Générer un ID temporaire si nouvelle étude
  const currentStudyId = studyId || `temp_${Date.now()}`;
  
  // 2. Préparer les données (upload des fichiers)
  const preparedData = await prepareFormDataForSave(formData, currentStudyId);
  
  // 3. Sauvegarder dans la base de données
  await supabase.from('sora_studies').insert({ data: preparedData });
}
```

### 3. Conversion File → FileMetadata

La fonction `prepareFormDataForSave()` effectue les opérations suivantes :

```typescript
// Pour chaque type de fichier
if (formData.operation?.geoFiles?.length > 0) {
  // Vérifier si ce sont des objets File
  const hasFileObjects = formData.operation.geoFiles.some(
    (item) => item instanceof File
  );
  
  if (hasFileObjects) {
    // Upload vers Supabase Storage
    const metadata = await uploadFiles(
      formData.operation.geoFiles,
      studyId,
      'geo'
    );
    
    // Remplacer les File par FileMetadata
    prepared.operation.geoFiles = metadata;
  }
}
```

### 4. Structure des Fichiers dans Storage

Les fichiers sont organisés ainsi :

```
sora-files/
└── {study-id}/
    ├── geo/                    # Fichiers géographiques de l'opération
    │   └── {timestamp}_{filename}.kml
    ├── technical/              # Documents techniques du drone
    │   └── {timestamp}_{filename}.pdf
    ├── trajectory/             # Fichiers de trajectoire (risk assessment)
    │   └── {timestamp}_{filename}.kml
    └── drosera/                # Fichiers de sortie Drosera
        └── {timestamp}_{filename}.html
```

### 5. Métadonnées Sauvegardées

Au lieu de sauvegarder l'objet `File` (impossible), on sauvegarde :

```typescript
interface FileMetadata {
  name: string;      // "zone-mission.kml"
  url: string;       // "https://{project}.supabase.co/storage/v1/object/public/sora-files/..."
  size: number;      // 12345 (en bytes)
  type: string;      // "application/vnd.google-earth.kml+xml"
}
```

## 🔄 Flux de Chargement

### 1. Chargement d'une Étude

Quand l'utilisateur charge une étude existante :

```typescript
const { data } = await supabase
  .from('sora_studies')
  .select('*')
  .eq('id', studyId)
  .single();

// data.data contient les FileMetadata au lieu des File
setFormData(data.data);
```

### 2. Affichage dans les Formulaires

Les composants de formulaire acceptent maintenant les deux types :

```typescript
interface OperationFormProps {
  operation: OperationInfo;  // geoFiles: (File | FileMetadata)[]
}
```

### 3. Affichage dans les Cartes

Les composants de carte convertissent automatiquement :

```typescript
// Dans OperationMap.tsx
useEffect(() => {
  const loadFiles = async () => {
    // Convertir FileMetadata → File si nécessaire
    const fileObjects = await toFileObjects(geoFiles);
    
    // Traiter les fichiers normalement
    for (const file of fileObjects) {
      const processedFiles = await processGeoFile(file);
      // ...
    }
  };
}, [geoFiles]);
```

### 4. Conversion FileMetadata → File

La fonction `toFileObject()` télécharge le fichier depuis l'URL :

```typescript
export async function toFileObject(item: File | FileMetadata): Promise<File> {
  if (item instanceof File) {
    return item;  // Déjà un File
  }
  
  // Télécharger depuis Supabase Storage
  const response = await fetch(item.url);
  const blob = await response.blob();
  
  // Créer un objet File
  return new File([blob], item.name, { type: item.type });
}
```

## 📁 Fichiers Modifiés

### Nouveaux Fichiers

1. **`src/lib/fileStorage.ts`** - Gestion de l'upload/suppression de fichiers
   - `uploadFile()` - Upload un fichier vers Supabase Storage
   - `uploadFiles()` - Upload plusieurs fichiers
   - `prepareFormDataForSave()` - Convertit File → FileMetadata avant sauvegarde
   - `deleteFile()` - Supprime un fichier
   - `deleteStudyFiles()` - Supprime tous les fichiers d'une étude

2. **`src/lib/fileUtils.ts`** - Utilitaires pour manipuler File et FileMetadata
   - `isFileObject()` - Vérifie si c'est un File ou FileMetadata
   - `toFileObject()` - Convertit FileMetadata → File
   - `toFileObjects()` - Convertit un tableau
   - `getFileName()`, `getFileSize()`, `getFileType()` - Helpers

### Fichiers Modifiés

1. **`src/types/sora.ts`**
   - Ajout de l'interface `FileMetadata`
   - Mise à jour des types pour accepter `(File | FileMetadata)[]`

2. **`src/components/SaveButton.tsx`**
   - Appel de `prepareFormDataForSave()` avant sauvegarde
   - Upload automatique des fichiers

3. **`src/components/forms/OperationMap.tsx`**
   - Accepte `(File | FileMetadata)[]`
   - Convertit FileMetadata → File avant traitement

4. **`src/components/forms/RiskAssessmentMap.tsx`**
   - Même modifications que OperationMap

## 🔒 Sécurité

### Politiques RLS (Row Level Security)

Les politiques Supabase garantissent que :
- ✅ Les utilisateurs authentifiés peuvent uploader des fichiers
- ✅ Tout le monde peut lire les fichiers (bucket public)
- ✅ Les utilisateurs authentifiés peuvent supprimer leurs fichiers
- ✅ Les fichiers sont automatiquement supprimés quand l'étude est supprimée

### Validation des Fichiers

Les fichiers sont validés :
- Type MIME vérifié lors de l'upload
- Extension de fichier vérifiée
- Taille maximale respectée (configurée dans Supabase)

## 🧪 Tests

### Test de Sauvegarde

1. Créer une nouvelle étude
2. Ajouter des fichiers KML/KMZ/GeoJSON
3. Cliquer sur "Sauvegarder"
4. Vérifier dans Supabase Storage que les fichiers apparaissent
5. Vérifier dans la base de données que les métadonnées sont sauvegardées

### Test de Chargement

1. Charger une étude existante avec des fichiers
2. Vérifier que les fichiers apparaissent dans les formulaires
3. Vérifier que les cartes affichent correctement les fichiers
4. Vérifier que les noms de fichiers sont corrects

### Test de Modification

1. Charger une étude existante
2. Ajouter de nouveaux fichiers
3. Supprimer des fichiers existants
4. Sauvegarder
5. Vérifier que les changements sont persistés

## 🐛 Dépannage

### Les fichiers ne s'affichent pas après chargement

**Cause** : Les FileMetadata ne sont pas convertis en File
**Solution** : Vérifier que `toFileObjects()` est appelé dans les composants de carte

### Erreur "Failed to fetch file"

**Cause** : L'URL du fichier n'est pas accessible
**Solution** : 
- Vérifier que le bucket est public
- Vérifier les politiques RLS
- Vérifier que l'URL est correcte

### Les fichiers sont dupliqués à chaque sauvegarde

**Cause** : `prepareFormDataForSave()` upload même les FileMetadata
**Solution** : La fonction vérifie déjà si ce sont des File avant d'uploader

### Erreur "Bucket not found"

**Cause** : Le bucket `sora-files` n'existe pas
**Solution** : Créer le bucket dans Supabase Storage

## 📊 Performance

### Optimisations

- Les fichiers ne sont téléchargés que quand nécessaire (affichage de carte)
- Les FileMetadata sont légers et rapides à charger
- Les fichiers sont mis en cache par le navigateur
- Les uploads sont parallélisés

### Limites

- Taille maximale par fichier : 50 MB (configurable)
- Nombre de fichiers : Illimité
- Bande passante : Selon le plan Supabase

## 🔮 Améliorations Futures

- [ ] Compression des fichiers avant upload
- [ ] Génération de miniatures pour les images
- [ ] Versioning des fichiers
- [ ] Partage de fichiers entre études
- [ ] Export/Import d'études avec fichiers
- [ ] Nettoyage automatique des fichiers orphelins
- [ ] Statistiques d'utilisation du stockage

---

**Dernière mise à jour** : 2025-12-04
**Version** : 1.0.0
