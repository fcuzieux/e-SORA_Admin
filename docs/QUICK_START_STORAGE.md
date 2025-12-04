# Guide Rapide : Création du Bucket Supabase Storage

## 🚀 Étapes Rapides (5 minutes)

### 1️⃣ Créer le Bucket

1. Ouvrez votre projet Supabase : https://supabase.com/dashboard
2. Menu latéral → **Storage**
3. Cliquez sur **"New bucket"**
4. Configurez :
   ```
   Name: sora-files
   ☑️ Public bucket (IMPORTANT !)
   ```
5. Cliquez sur **"Create bucket"**

### 2️⃣ Configurer les Politiques (2 options)

#### Option A : Interface Graphique (Plus Simple)

1. Cliquez sur le bucket `sora-files`
2. Onglet **"Policies"**
3. Cliquez **"New Policy"** → **"Create a policy from scratch"**
4. Créez 4 politiques :

**Politique 1 - Upload**
```
Name: Allow authenticated users to upload files
Operation: INSERT ✓
Target roles: authenticated
USING: true
WITH CHECK: (bucket_id = 'sora-files')
```

**Politique 2 - Lecture**
```
Name: Allow public read access
Operation: SELECT ✓
Target roles: public, authenticated
USING: (bucket_id = 'sora-files')
```

**Politique 3 - Suppression**
```
Name: Allow authenticated users to delete files
Operation: DELETE ✓
Target roles: authenticated
USING: (bucket_id = 'sora-files')
```

**Politique 4 - Mise à jour**
```
Name: Allow authenticated users to update files
Operation: UPDATE ✓
Target roles: authenticated
USING: (bucket_id = 'sora-files')
WITH CHECK: (bucket_id = 'sora-files')
```

#### Option B : SQL (Plus Rapide)

1. Menu latéral → **SQL Editor**
2. Cliquez **"New query"**
3. Copiez-collez le contenu du fichier `supabase-storage-setup.sql`
4. Cliquez **"Run"**

### 3️⃣ Vérifier la Configuration

Exécutez cette requête dans le SQL Editor :

```sql
SELECT 
  'Bucket exists' as check,
  EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'sora-files') as status
UNION ALL
SELECT 
  'Bucket is public',
  (SELECT public FROM storage.buckets WHERE id = 'sora-files')
UNION ALL
SELECT 
  'Policies count',
  (SELECT COUNT(*) >= 4 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage');
```

Résultat attendu :
```
✅ Bucket exists: true
✅ Bucket is public: true
✅ Policies count: true
```

## 🧪 Tester la Configuration

1. Retournez dans votre application e-SORA Admin
2. Créez ou modifiez une étude
3. Ajoutez un fichier (KML, GeoJSON, etc.)
4. Cliquez sur **"Sauvegarder"**
5. Vérifiez dans Supabase Storage → `sora-files` que le fichier apparaît

## 📁 Structure Attendue

Après le premier upload, vous devriez voir :

```
sora-files/
└── {uuid-de-l-etude}/
    ├── geo/
    │   └── 1733348736000_zone-mission.kml
    ├── technical/
    ├── trajectory/
    └── drosera/
```

## ❌ Problèmes Courants

### "Bucket not found"
→ Vérifiez que le nom est exactement `sora-files` (avec le tiret)

### "new row violates row-level security policy"
→ Les politiques RLS ne sont pas créées. Utilisez l'Option B (SQL)

### Les fichiers ne s'affichent pas
→ Vérifiez que "Public bucket" est coché

### Erreur 401 Unauthorized
→ Vérifiez que l'utilisateur est bien connecté dans l'application

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs Supabase : Menu → **Logs** → **Storage**
3. Vérifiez que votre fichier `.env` contient bien :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon
   ```

---

**Temps estimé** : 5-10 minutes  
**Difficulté** : ⭐⭐☆☆☆ (Facile)
