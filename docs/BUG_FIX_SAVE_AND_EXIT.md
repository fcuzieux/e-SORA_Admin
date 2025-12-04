# Correction du bug "Sauvegarder et quitter"

## Problème identifié

Lorsque l'utilisateur cliquait sur **"Sauvegarder et quitter"** dans la boîte de dialogue de confirmation, les fichiers n'étaient pas uploadés vers Supabase Storage, ce qui causait le même problème de chargement que précédemment.

### Cause du problème

Le composant `HomeButton.tsx` utilisait l'**ancienne logique de sauvegarde** qui ne gérait pas l'upload des fichiers :

```typescript
// AVANT - Logique incorrecte
const handleSaveAndExit = async () => {
  if (studyId) {
    await supabase
      .from('sora_studies')
      .update({
        name: studyName,
        data: formData,  // ❌ Sauvegarde directe sans upload des fichiers
        updated_at: new Date().toISOString()
      })
      .eq('id', studyId);
  }
  navigate('/');
};
```

**Conséquence** : Les fichiers restaient dans les tableaux `File[]` au lieu d'être uploadés, et lors du rechargement, ces fichiers devenaient `undefined`.

## Solution appliquée

### Mise à jour de HomeButton.tsx

J'ai remplacé la fonction `handleSaveAndExit()` par la **même logique complète** que dans `SaveButton.tsx` :

```typescript
// APRÈS - Logique correcte
const handleSaveAndExit = async () => {
  // 1. Préparer les données
  let dataToSave = { ...formData };

  // 2. Fonction helper pour uploader les fichiers
  const uploadSectionFiles = async (...) => {
    // Upload vers Supabase Storage
    const uploadedUrls = await uploadMultipleFiles(files, studyId, fileType);
    return [...existingUrls, ...uploadedUrls];
  };

  // 3. Upload de tous les types de fichiers
  if (studyId) {
    // Upload images du drone
    if (formData.drone.technicalDocuments?.length > 0) {
      const urls = await uploadSectionFiles(...);
      dataToSave.drone.technicalDocumentUrls = urls;
      dataToSave.drone.technicalDocuments = [];
    }

    // Upload fichiers géographiques de l'opération
    if (formData.operation.geoFiles?.length > 0) {
      const urls = await uploadSectionFiles(...);
      dataToSave.operation.geoFileUrls = urls;
      dataToSave.operation.geoFiles = [];
    }

    // Upload fichiers de trajectoire
    if (formData.RiskAssessment.trajgeoFiles?.length > 0) {
      const urls = await uploadSectionFiles(...);
      dataToSave.RiskAssessment.trajgeoFileUrls = urls;
      dataToSave.RiskAssessment.trajgeoFiles = [];
    }

    // Upload fichiers Drosera
    if (formData.RiskAssessment.droseraOutputFile?.length > 0) {
      const urls = await uploadSectionFiles(...);
      dataToSave.RiskAssessment.droseraOutputFileUrls = urls;
      dataToSave.RiskAssessment.droseraOutputFile = [];
    }

    // 4. Sauvegarder avec les URLs
    await supabase
      .from('sora_studies')
      .update({
        name: studyName,
        data: dataToSave,  // ✅ Données avec URLs au lieu de File[]
        updated_at: new Date().toISOString()
      })
      .eq('id', studyId);
  }

  navigate('/');
};
```

## Fichiers modifiés

1. **`src/components/HomeButton.tsx`**
   - Remplacement complet de la fonction `handleSaveAndExit()`
   - Ajout de la fonction helper `uploadSectionFiles()`
   - Upload de tous les types de fichiers avant sauvegarde
   - Gestion des nouvelles études et des mises à jour
   - Suppression de l'import React inutilisé

## Résultat

✅ Les fichiers sont maintenant correctement uploadés lors du "Sauvegarder et quitter"
✅ Les URLs sont sauvegardées dans la base de données
✅ Les tableaux de fichiers sont vidés après upload
✅ Plus d'erreur lors du rechargement de l'étude
✅ Comportement identique entre "Sauvegarder" et "Sauvegarder et quitter"

## Comparaison des flux

### Avant la correction

```
Utilisateur clique sur "Sauvegarder et quitter"
  ↓
Sauvegarde directe de formData (avec File[] non uploadés)
  ↓
Navigation vers l'accueil
  ↓
Rechargement de l'étude
  ↓
❌ Erreur: fichiers undefined
```

### Après la correction

```
Utilisateur clique sur "Sauvegarder et quitter"
  ↓
Upload des fichiers vers Supabase Storage
  ↓
Récupération des URLs
  ↓
Sauvegarde de formData (avec URLs au lieu de File[])
  ↓
Navigation vers l'accueil
  ↓
Rechargement de l'étude
  ↓
✅ Chargement correct des fichiers depuis les URLs
```

## Points clés

1. **Cohérence** : `SaveButton` et `HomeButton` utilisent maintenant la même logique
2. **Réutilisabilité** : La fonction `uploadSectionFiles()` est dupliquée mais pourrait être extraite dans un service partagé
3. **Robustesse** : Tous les types de fichiers sont gérés de manière uniforme

## Recommandation future

Pour éviter la duplication de code, créer un service partagé :

```typescript
// src/lib/saveService.ts
export async function saveStudyWithFiles(
  studyId: string | null,
  studyName: string,
  formData: SoraForm,
  user: User,
  isSuperAgent: boolean
): Promise<void> {
  // Logique commune d'upload et de sauvegarde
}
```

Puis l'utiliser dans `SaveButton` et `HomeButton` :

```typescript
await saveStudyWithFiles(studyId, studyName, formData, user, isSuperAgent);
```

## Test

Pour vérifier la correction :
1. Créer ou ouvrir une étude
2. Ajouter des fichiers (images, KML, etc.)
3. Cliquer sur le bouton "Home" (🏠)
4. Choisir "Sauvegarder et quitter"
5. ✅ Les fichiers doivent être uploadés
6. Rouvrir l'étude
7. ✅ Les fichiers doivent se charger correctement
