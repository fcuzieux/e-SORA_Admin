# Guide de Test - Système de Sauvegarde des Fichiers

## ✅ Checklist de Test

Suivez ces étapes pour vérifier que tout fonctionne correctement.

---

## Test 1 : Nouvelle Étude avec Fichiers

### Étapes

1. **Créer une nouvelle étude**
   - Ouvrez l'application
   - Remplissez les informations de l'opérateur
   - Cliquez sur "Continuer"

2. **Ajouter des fichiers géographiques**
   - Dans l'onglet "ConOps" → Section "Informations sur l'opération"
   - Cliquez sur "Zone Géographique"
   - Ajoutez un ou plusieurs fichiers KML/KMZ/GeoJSON
   - ✅ Vérifiez que les fichiers apparaissent dans la liste
   - ✅ Vérifiez que la carte affiche les fichiers

3. **Sauvegarder l'étude**
   - Donnez un nom à l'étude (en haut)
   - Cliquez sur le bouton "Sauvegarder" (en bas à gauche)
   - ✅ Attendez le message de confirmation
   - ✅ Pas d'erreur dans la console (F12)

4. **Vérifier dans Supabase**
   - Ouvrez Supabase Dashboard → Storage → `sora-files`
   - ✅ Vous devriez voir un dossier avec l'ID de l'étude
   - ✅ À l'intérieur, un dossier `geo/` avec vos fichiers
   - ✅ Les noms de fichiers sont préfixés par un timestamp

5. **Vérifier dans la base de données**
   - Supabase Dashboard → Table Editor → `sora_studies`
   - Trouvez votre étude
   - Cliquez sur la colonne `data`
   - ✅ Dans `operation.geoFiles`, vous devriez voir des objets avec `name`, `url`, `size`, `type`
   - ✅ Les URLs pointent vers Supabase Storage

---

## Test 2 : Chargement d'une Étude Existante

### Étapes

1. **Recharger la page**
   - Appuyez sur F5 pour recharger l'application
   - Ou fermez et rouvrez l'onglet

2. **Charger l'étude**
   - Cliquez sur "Mes Études" ou le bouton de chargement
   - Sélectionnez l'étude que vous venez de créer
   - ✅ L'étude se charge

3. **Vérifier les fichiers**
   - Allez dans l'onglet "ConOps"
   - ✅ Les fichiers géographiques apparaissent dans la liste
   - ✅ Les noms de fichiers sont corrects
   - ✅ La carte affiche les fichiers correctement
   - ✅ Vous pouvez zoomer/dézoomer sur la carte

4. **Vérifier la console**
   - Ouvrez la console (F12)
   - ✅ Pas d'erreur "Failed to fetch"
   - ✅ Pas d'erreur "Bucket not found"

---

## Test 3 : Modification de Fichiers

### Étapes

1. **Charger une étude existante**
   - Chargez l'étude créée précédemment

2. **Ajouter de nouveaux fichiers**
   - Ajoutez un nouveau fichier KML/KMZ
   - ✅ Le nouveau fichier apparaît dans la liste
   - ✅ La carte affiche le nouveau fichier

3. **Supprimer un fichier**
   - Cliquez sur "Supprimer" à côté d'un fichier
   - ✅ Le fichier disparaît de la liste
   - ✅ La carte met à jour l'affichage

4. **Sauvegarder les modifications**
   - Cliquez sur "Sauvegarder"
   - ✅ Pas d'erreur

5. **Vérifier dans Supabase Storage**
   - Ouvrez Supabase Dashboard → Storage → `sora-files` → {study-id} → `geo/`
   - ✅ Le nouveau fichier est présent
   - ⚠️ Note : L'ancien fichier supprimé reste dans le storage (nettoyage manuel nécessaire)

6. **Recharger et vérifier**
   - Rechargez la page
   - Chargez l'étude
   - ✅ Les modifications sont persistées
   - ✅ Le nouveau fichier est là
   - ✅ Le fichier supprimé n'apparaît plus

---

## Test 4 : Fichiers de Trajectoire (Risk Assessment)

### Étapes

1. **Aller dans l'onglet "Initial GRC"**
   - Naviguez vers l'étape "Évaluation des Risques"

2. **Ajouter des fichiers de trajectoire**
   - Section "Mission" → "Trajectoire ou Zone d'évolution"
   - Ajoutez un fichier nommé `Trajectoire_test.kml` ou `Zone_test.kml`
   - ✅ Le fichier apparaît dans la liste
   - ✅ La carte affiche le fichier

3. **Sauvegarder**
   - Cliquez sur "Sauvegarder"
   - ✅ Pas d'erreur

4. **Vérifier dans Supabase Storage**
   - Storage → `sora-files` → {study-id} → `trajectory/`
   - ✅ Le fichier de trajectoire est présent

---

## Test 5 : Documents Techniques du Drone

### Étapes

1. **Aller dans l'onglet "ConOps"**
   - Section "Informations sur le Drone"

2. **Ajouter des documents techniques**
   - Cherchez le champ "Documents Techniques"
   - Ajoutez un PDF ou autre document
   - ✅ Le document apparaît dans la liste

3. **Sauvegarder**
   - Cliquez sur "Sauvegarder"
   - ✅ Pas d'erreur

4. **Vérifier dans Supabase Storage**
   - Storage → `sora-files` → {study-id} → `technical/`
   - ✅ Le document est présent

---

## Test 6 : Gestion des Erreurs

### Test 6.1 : Fichier Invalide

1. Essayez d'ajouter un fichier .txt ou .jpg
2. ✅ Le système devrait rejeter le fichier
3. ✅ Un message d'erreur devrait apparaître

### Test 6.2 : Fichier Trop Gros

1. Essayez d'ajouter un fichier > 50 MB
2. ✅ Le système devrait rejeter le fichier
3. ✅ Un message d'erreur devrait apparaître

### Test 6.3 : Sauvegarde Sans Connexion

1. Ouvrez les DevTools (F12) → Network
2. Activez "Offline"
3. Essayez de sauvegarder
4. ✅ Un message d'erreur devrait apparaître
5. ✅ Les données ne sont pas perdues

---

## 🐛 Problèmes Courants et Solutions

### Problème : "Bucket not found"

**Solution** :
1. Vérifiez que le bucket `sora-files` existe dans Supabase
2. Vérifiez le nom (doit être exactement `sora-files`)

### Problème : "Failed to upload file"

**Solutions** :
1. Vérifiez les politiques RLS dans Supabase
2. Vérifiez que l'utilisateur est authentifié
3. Vérifiez la console pour plus de détails

### Problème : Les fichiers ne s'affichent pas après chargement

**Solutions** :
1. Vérifiez la console pour les erreurs
2. Vérifiez que les URLs dans la base de données sont correctes
3. Vérifiez que le bucket est public
4. Testez l'URL directement dans le navigateur

### Problème : "CORS error"

**Solutions** :
1. Vérifiez les paramètres CORS dans Supabase
2. Normalement, Supabase gère CORS automatiquement pour les buckets publics

---

## 📊 Résultats Attendus

Après tous les tests, vous devriez avoir :

### Dans Supabase Storage (`sora-files/`)
```
{study-id-1}/
├── geo/
│   ├── 1733348736000_zone-mission.kml
│   └── 1733348737000_autre-zone.kml
├── technical/
│   └── 1733348738000_manuel.pdf
├── trajectory/
│   └── 1733348739000_Trajectoire_test.kml
└── drosera/
    └── (vide pour l'instant)

{study-id-2}/
└── ...
```

### Dans la Base de Données (`sora_studies`)
```json
{
  "id": "uuid-de-l-etude",
  "name": "Mon Étude Test",
  "data": {
    "operation": {
      "geoFiles": [
        {
          "name": "zone-mission.kml",
          "url": "https://xxx.supabase.co/storage/v1/object/public/sora-files/...",
          "size": 12345,
          "type": "application/vnd.google-earth.kml+xml"
        }
      ]
    },
    "drone": {
      "technicalDocuments": [
        {
          "name": "manuel.pdf",
          "url": "https://xxx.supabase.co/storage/v1/object/public/sora-files/...",
          "size": 54321,
          "type": "application/pdf"
        }
      ]
    },
    "RiskAssessment": {
      "trajgeoFiles": [
        {
          "name": "Trajectoire_test.kml",
          "url": "https://xxx.supabase.co/storage/v1/object/public/sora-files/...",
          "size": 6789,
          "type": "application/vnd.google-earth.kml+xml"
        }
      ]
    }
  }
}
```

---

## ✅ Checklist Finale

- [ ] Test 1 : Nouvelle étude avec fichiers ✓
- [ ] Test 2 : Chargement d'une étude existante ✓
- [ ] Test 3 : Modification de fichiers ✓
- [ ] Test 4 : Fichiers de trajectoire ✓
- [ ] Test 5 : Documents techniques ✓
- [ ] Test 6 : Gestion des erreurs ✓
- [ ] Vérification Supabase Storage ✓
- [ ] Vérification Base de Données ✓
- [ ] Pas d'erreurs dans la console ✓

---

**Si tous les tests passent, le système de sauvegarde des fichiers fonctionne correctement ! 🎉**
