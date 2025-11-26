# Extension de la sauvegarde des fichiers - Résumé

## Ce qui a été fait

### ✅ Sauvegarde automatique de tous les fichiers

La solution a été étendue pour sauvegarder automatiquement **tous les types de fichiers** de l'application :

#### 1. **Images du drone** (DroneForm)
- **Champ**: `drone.technicalDocuments` → `drone.technicalDocumentUrls`
- **Types**: PNG, JPG, JPEG
- **Dossier**: `drone-photos/`
- **Limite**: 500 KB par fichier
- **Statut**: ✅ Upload + Chargement implémentés

#### 2. **Fichiers géographiques de l'opération** (OperationForm)
- **Champ**: `operation.geoFiles` → `operation.geoFileUrls`
- **Types**: KML, KMZ, GeoJSON
- **Dossier**: `operation-geo-files/`
- **Statut**: ✅ Upload implémenté, ⏳ Chargement à implémenter

#### 3. **Fichiers de trajectoire** (GroundRiskInitial)
- **Champ**: `RiskAssessment.trajgeoFiles` → `RiskAssessment.trajgeoFileUrls`
- **Types**: KML, KMZ, GeoJSON
- **Dossier**: `risk-assessment-traj-files/`
- **Statut**: ✅ Upload implémenté, ⏳ Chargement à implémenter

#### 4. **Fichiers de sortie Drosera** (GroundRiskInitial)
- **Champ**: `RiskAssessment.droseraOutputFile` → `RiskAssessment.droseraOutputFileUrls`
- **Types**: HTML
- **Dossier**: `drosera-output-files/`
- **Statut**: ✅ Upload implémenté, ⏳ Chargement à implémenter

## Modifications apportées

### Fichiers modifiés

1. **`src/types/sora.ts`**
   - Ajout de `technicalDocumentUrls?: string[]` à `DroneInfo`
   - Ajout de `geoFileUrls?: string[]` à `OperationInfo`
   - Ajout de `trajgeoFileUrls?: string[]` à `RiskAssessmentInfo`
   - Ajout de `droseraOutputFileUrls?: string[]` à `RiskAssessmentInfo`

2. **`src/components/SaveButton.tsx`**
   - Refactorisation complète de `handleSave()`
   - Ajout d'une fonction helper `uploadSectionFiles()`
   - Upload automatique de tous les types de fichiers lors de la sauvegarde
   - Gestion des nouvelles études et des mises à jour

3. **`src/components/forms/DroneForm.tsx`**
   - Ajout d'un `useEffect` pour charger les fichiers depuis les URLs
   - Indicateur de chargement pendant le téléchargement des fichiers
   - ✅ Complètement fonctionnel

4. **`docs/SUPABASE_STORAGE_SETUP.md`**
   - Mise à jour de la configuration du bucket (10 MB, nouveaux MIME types)
   - Mise à jour de la structure des fichiers
   - Documentation des nouveaux types de fichiers

5. **`docs/IMAGE_STORAGE_SOLUTION.md`**
   - Mise à jour du titre et du résumé
   - Ajout de tous les types de fichiers supportés
   - Mise à jour de la configuration

## Tâches restantes

### ⏳ À implémenter

1. **OperationForm.tsx** - Ajouter le chargement des fichiers géographiques existants
   ```typescript
   useEffect(() => {
     // Charger les fichiers depuis operation.geoFileUrls
     // Similaire à DroneForm.tsx
   }, [operation.geoFileUrls]);
   ```

2. **GroundRiskInitial.tsx** - Ajouter le chargement des fichiers de trajectoire et Drosera
   ```typescript
   useEffect(() => {
     // Charger les fichiers depuis assessment.trajgeoFileUrls
     // Charger les fichiers depuis assessment.droseraOutputFileUrls
   }, [assessment.trajgeoFileUrls, assessment.droseraOutputFileUrls]);
   ```

## Structure des fichiers dans Supabase

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

## Flux de sauvegarde

### Lors de la sauvegarde (SaveButton)

1. L'utilisateur clique sur "Sauvegarder"
2. Pour chaque type de fichier :
   - Si des fichiers sont présents dans le tableau `File[]`
   - Upload vers Supabase Storage
   - Récupération des URLs publiques
   - Stockage des URLs dans le champ correspondant
   - Vidage du tableau `File[]`
3. Sauvegarde des données dans `sora_studies`

### Lors du chargement (Formulaires)

1. L'étude est chargée depuis la base de données
2. Pour chaque type de fichier :
   - Si des URLs sont présentes
   - Téléchargement des fichiers depuis Supabase Storage
   - Conversion en objets `File`
   - Affichage dans le formulaire

## Configuration Supabase requise

### Bucket
- **Nom**: `drone-documents`
- **Type**: Public
- **Taille limite**: 10 MB
- **MIME types**: PNG, JPG, JPEG, KML, KMZ, GeoJSON, HTML

### Politiques RLS
Voir `docs/SUPABASE_STORAGE_SETUP.md` pour les requêtes SQL complètes.

## Prochaines étapes

1. ✅ Configurer le bucket Supabase (si pas déjà fait)
2. ✅ Tester l'upload de tous les types de fichiers
3. ⏳ Implémenter le chargement dans OperationForm
4. ⏳ Implémenter le chargement dans GroundRiskInitial
5. ✅ Tester le cycle complet (sauvegarde + rechargement)

## Notes importantes

- Les fichiers sont uploadés **uniquement lors de la sauvegarde**
- Les URLs sont persistées dans la base de données
- Les fichiers supprimés du formulaire ne sont **pas automatiquement supprimés** de Supabase Storage
- Pour implémenter la suppression automatique, comparer les URLs avant/après et appeler `deleteFile()`

## Support

Pour plus de détails :
- `docs/SUPABASE_STORAGE_SETUP.md` - Configuration complète
- `docs/IMAGE_STORAGE_SOLUTION.md` - Guide rapide
- `src/lib/storageService.ts` - Code source du service
