# Implémentation du chargement des fichiers géographiques et Drosera

## Problème résolu

Les fichiers KML, KMZ, GeoJSON et HTML (Drosera) étaient correctement sauvegardés dans Supabase Storage, mais n'étaient **pas rechargés** lors de l'ouverture d'une étude existante.

### Cause

Nous avions implémenté :
- ✅ L'upload des fichiers vers Supabase Storage
- ✅ La sauvegarde des URLs dans la base de données
- ✅ Le chargement des fichiers pour `DroneForm` uniquement

Mais il manquait :
- ❌ Le chargement des fichiers pour `OperationForm` (fichiers géographiques)
- ❌ Le chargement des fichiers pour `RiskAssessmentForm` (fichiers de trajectoire et Drosera)

## Solution implémentée

### 1. OperationForm.tsx

**Ajout du chargement des fichiers géographiques** (KML, KMZ, GeoJSON) :

```typescript
// Import de useEffect et useState
import React, { useMemo, useEffect, useState } from 'react';

// State pour le chargement
const [loadingFiles, setLoadingFiles] = useState(false);

// useEffect pour charger les fichiers depuis les URLs
useEffect(() => {
  const loadFilesFromUrls = async () => {
    if (!operation.geoFileUrls || operation.geoFileUrls.length === 0) {
      return;
    }

    // Ne charger que si nous n'avons pas déjà les fichiers
    if (operation.geoFiles && operation.geoFiles.length > 0) {
      return;
    }

    setLoadingFiles(true);
    try {
      const { urlToFile } = await import('../../lib/storageService');
      
      const filePromises = operation.geoFileUrls.map((url, index) => {
        const fileName = url.split('/').pop() || `file_${index}`;
        return urlToFile(url, fileName);
      });

      const files = await Promise.all(filePromises);
      const validFiles = files.filter((file): file is File => file !== null);

      if (validFiles.length > 0) {
        onChange({ ...operation, geoFiles: validFiles });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  loadFilesFromUrls();
}, [operation.geoFileUrls]);
```

**Indicateur de chargement** :
```typescript
<span className="text-gray-600">
  {loadingFiles 
    ? 'Chargement des fichiers...' 
    : 'Déposer des fichiers KML, KMZ ou GeoJSON ici'}
</span>
```

### 2. RiskAssessmentForm.tsx

**Ajout du chargement de DEUX types de fichiers** :

#### A. Fichiers de trajectoire (KML, GeoJSON)

```typescript
// useEffect pour charger les fichiers de trajectoire
useEffect(() => {
  const loadFilesFromUrls = async () => {
    if (!assessment.trajgeoFileUrls || assessment.trajgeoFileUrls.length === 0) {
      return;
    }

    if (assessment.trajgeoFiles && assessment.trajgeoFiles.length > 0) {
      return;
    }

    setLoadingFiles(true);
    try {
      const { urlToFile } = await import('../../lib/storageService');
      
      const filePromises = assessment.trajgeoFileUrls.map((url, index) => {
        const fileName = url.split('/').pop() || `file_${index}`;
        return urlToFile(url, fileName);
      });

      const files = await Promise.all(filePromises);
      const validFiles = files.filter((file): file is File => file !== null);

      if (validFiles.length > 0) {
        onChange({ ...assessment, trajgeoFiles: validFiles });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers de trajectoire:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  loadFilesFromUrls();
}, [assessment.trajgeoFileUrls]);
```

#### B. Fichiers Drosera (HTML)

```typescript
// useEffect pour charger les fichiers Drosera
useEffect(() => {
  const loadDroseraFilesFromUrls = async () => {
    if (!assessment.droseraOutputFileUrls || assessment.droseraOutputFileUrls.length === 0) {
      return;
    }

    if (assessment.droseraOutputFile && assessment.droseraOutputFile.length > 0) {
      return;
    }

    try {
      const { urlToFile } = await import('../../lib/storageService');
      
      const filePromises = assessment.droseraOutputFileUrls.map((url, index) => {
        const fileName = url.split('/').pop() || `drosera_${index}.html`;
        return urlToFile(url, fileName);
      });

      const files = await Promise.all(filePromises);
      const validFiles = files.filter((file): file is File => file !== null);

      if (validFiles.length > 0) {
        onChange({ ...assessment, droseraOutputFile: validFiles });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers Drosera:', error);
    }
  };

  loadDroseraFilesFromUrls();
}, [assessment.droseraOutputFileUrls]);
```

## Fichiers modifiés

1. **`src/components/forms/OperationForm.tsx`**
   - Ajout de `useEffect` et `useState`
   - Chargement des fichiers géographiques depuis `operation.geoFileUrls`
   - Indicateur de chargement dans le label

2. **`src/components/forms/RiskAssessmentForm.tsx`**
   - Ajout de `useEffect` et `useState`
   - Chargement des fichiers de trajectoire depuis `assessment.trajgeoFileUrls`
   - Chargement des fichiers Drosera depuis `assessment.droseraOutputFileUrls`
   - Indicateur de chargement dans le label

## Flux complet de gestion des fichiers

### Sauvegarde (SaveButton / HomeButton)
```
Utilisateur ajoute des fichiers
  ↓
Fichiers stockés dans File[]
  ↓
Utilisateur clique sur "Sauvegarder"
  ↓
Upload vers Supabase Storage
  ↓
Récupération des URLs
  ↓
Sauvegarde des URLs dans la BDD
  ↓
Vidage des File[]
```

### Chargement (Formulaires)
```
Utilisateur ouvre une étude
  ↓
Chargement des données depuis la BDD
  ↓
Détection des URLs de fichiers
  ↓
useEffect déclenché
  ↓
Téléchargement des fichiers depuis Supabase
  ↓
Conversion en objets File
  ↓
Stockage dans File[]
  ↓
Affichage dans l'interface
```

## Types de fichiers gérés

| Type | Formulaire | Champ URLs | Champ Files | Formats |
|------|------------|------------|-------------|---------|
| **Images du drone** | DroneForm | `technicalDocumentUrls` | `technicalDocuments` | PNG, JPG, JPEG |
| **Fichiers géographiques** | OperationForm | `geoFileUrls` | `geoFiles` | KML, KMZ, GeoJSON |
| **Fichiers de trajectoire** | RiskAssessmentForm | `trajgeoFileUrls` | `trajgeoFiles` | KML, GeoJSON |
| **Fichiers Drosera** | RiskAssessmentForm | `droseraOutputFileUrls` | `droseraOutputFile` | HTML |

## Résultat

✅ **Tous les types de fichiers** sont maintenant correctement :
- Uploadés vers Supabase Storage lors de la sauvegarde
- Rechargés depuis Supabase lors de l'ouverture d'une étude
- Affichés dans les formulaires
- Utilisables par les cartes et composants

✅ **Indicateurs de chargement** affichés pendant le téléchargement

✅ **Gestion des erreurs** avec logs dans la console

## Test

Pour vérifier que tout fonctionne :

1. **Créer une nouvelle étude**
2. **Ajouter des fichiers** :
   - Images dans DroneForm
   - Fichiers KML/KMZ/GeoJSON dans OperationForm
   - Fichiers de trajectoire dans RiskAssessmentForm
   - Fichiers Drosera dans GroundRiskInitial
3. **Sauvegarder** l'étude
4. **Fermer** et **rouvrir** l'étude
5. ✅ **Vérifier** que tous les fichiers sont rechargés et affichés

## Notes

- Les fichiers sont chargés **automatiquement** lors de l'ouverture d'une étude
- Le chargement se fait **uniquement si** les URLs existent et que les fichiers ne sont pas déjà présents
- Les erreurs de chargement sont **loguées dans la console** mais n'empêchent pas l'utilisation de l'application
- Le service `urlToFile` gère la conversion des URLs en objets `File` avec le bon type MIME
