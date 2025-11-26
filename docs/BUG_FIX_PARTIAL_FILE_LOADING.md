# Correction du rechargement partiel des fichiers

## Problème identifié

Lorsque plusieurs fichiers étaient sauvegardés pour un même champ (ex: plusieurs fichiers KML), il arrivait que tous ne soient pas rechargés lors de la réouverture de l'étude.

### Cause du problème

La condition de chargement dans les `useEffect` était trop restrictive :

```typescript
// AVANT - Condition incorrecte
if (files && files.length > 0) {
  return; // Ne rien faire si AU MOINS UN fichier est présent
}
```

Cette condition empêchait le rechargement si, par exemple, 1 fichier était présent en mémoire mais qu'il y avait 3 URLs sauvegardées.

## Solution appliquée

J'ai modifié la condition dans tous les formulaires pour comparer le **nombre de fichiers présents** avec le **nombre d'URLs sauvegardées** :

```typescript
// APRÈS - Condition correcte
const currentFileCount = files?.length || 0;
if (currentFileCount === fileUrls.length) {
  return; // Ne rien faire seulement si TOUS les fichiers sont présents
}
```

## Fichiers modifiés

1. **`src/components/forms/OperationForm.tsx`**
   - Correction pour `geoFiles` vs `geoFileUrls`

2. **`src/components/forms/RiskAssessmentForm.tsx`**
   - Correction pour `trajgeoFiles` vs `trajgeoFileUrls`
   - Correction pour `droseraOutputFile` vs `droseraOutputFileUrls`

3. **`src/components/forms/DroneForm.tsx`**
   - Correction pour `technicalDocuments` vs `technicalDocumentUrls`

## Résultat

✅ Si le nombre de fichiers chargés est différent du nombre d'URLs, le système recharge tous les fichiers depuis Supabase.
✅ Cela garantit que tous les fichiers sauvegardés sont bien affichés à l'utilisateur.
✅ Évite les rechargements inutiles si tout est déjà là.

## Test

Pour vérifier la correction :
1. Ajouter plusieurs fichiers (ex: 3 fichiers KML) dans OperationForm
2. Sauvegarder l'étude
3. Recharger la page
4. Vérifier que les 3 fichiers apparaissent bien dans la liste
