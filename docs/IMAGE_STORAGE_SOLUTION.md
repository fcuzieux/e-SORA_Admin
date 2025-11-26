# Sauvegarde des images dans Supabase - Guide rapide

## Résumé de la solution

Cette solution permet de sauvegarder les images et documents techniques du formulaire DroneForm dans Supabase Storage.

## Fichiers modifiés/créés

### Nouveaux fichiers
1. **`src/lib/storageService.ts`** - Service de gestion du stockage Supabase
2. **`docs/SUPABASE_STORAGE_SETUP.md`** - Documentation complète de configuration

### Fichiers modifiés
1. **`src/types/sora.ts`** - Ajout du champ `technicalDocumentUrls` à l'interface `DroneInfo`
2. **`src/components/SaveButton.tsx`** - Ajout de la logique d'upload des fichiers
3. **`src/components/forms/DroneForm.tsx`** - Ajout du chargement des fichiers existants

## Configuration requise dans Supabase

### 1. Créer le bucket de stockage
```
Nom: drone-documents
Type: Public
Taille limite: 500 KB
Types MIME: image/png, image/jpeg, image/jpg
```

### 2. Configurer les politiques RLS
Voir le fichier `docs/SUPABASE_STORAGE_SETUP.md` pour les politiques SQL complètes.

## Comment ça fonctionne

### Lors de la sauvegarde
1. L'utilisateur remplit le formulaire DroneForm et ajoute des images
2. Lorsqu'il clique sur "Sauvegarder" :
   - Les fichiers sont uploadés vers Supabase Storage
   - Les URLs des fichiers sont récupérées
   - Les URLs sont sauvegardées dans le champ `technicalDocumentUrls`
   - Les données du formulaire sont sauvegardées dans la table `sora_studies`

### Lors du chargement d'une étude existante
1. Les URLs des fichiers sont récupérées depuis la base de données
2. Les fichiers sont téléchargés depuis Supabase Storage
3. Les fichiers sont affichés dans le formulaire
4. L'utilisateur peut ajouter de nouveaux fichiers ou supprimer les existants

## Structure des données

### Avant (fichiers en mémoire uniquement)
```typescript
{
  drone: {
    technicalDocuments: [File, File, ...] // Perdu après rechargement
  }
}
```

### Après (fichiers persistés)
```typescript
{
  drone: {
    technicalDocuments: [File, File, ...], // Fichiers en mémoire
    technicalDocumentUrls: [
      "https://xxx.supabase.co/storage/v1/object/public/drone-documents/study-id/drone-photos/123_image1.jpg",
      "https://xxx.supabase.co/storage/v1/object/public/drone-documents/study-id/drone-photos/124_image2.jpg"
    ] // URLs persistées
  }
}
```

## API du service de stockage

```typescript
// Upload un fichier
const url = await uploadFile(file, studyId, 'drone-photos');

// Upload plusieurs fichiers
const urls = await uploadMultipleFiles(files, studyId, 'drone-photos');

// Supprimer un fichier
const success = await deleteFile(fileUrl);

// Convertir une URL en File
const file = await urlToFile(url, 'filename.jpg');
```

## Prochaines étapes

1. **Configurer Supabase Storage** selon `docs/SUPABASE_STORAGE_SETUP.md`
2. **Tester l'upload** en créant une nouvelle étude et en ajoutant des images
3. **Tester le chargement** en rechargeant une étude existante
4. **(Optionnel) Implémenter la suppression automatique** des fichiers non utilisés

## Notes importantes

- Les fichiers sont limités à 500 Ko par défaut (modifiable dans `DroneForm.tsx`)
- Seuls les formats PNG, JPG et JPEG sont acceptés
- Les fichiers supprimés du formulaire ne sont pas automatiquement supprimés de Supabase Storage
- Assurez-vous que le bucket est configuré comme **public** pour permettre l'accès aux URLs

## Support

Pour plus de détails, consultez :
- `docs/SUPABASE_STORAGE_SETUP.md` - Configuration détaillée
- `src/lib/storageService.ts` - Code source du service
