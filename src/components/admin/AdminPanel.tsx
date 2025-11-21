import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, Shield, Trash2 } from 'lucide-react';
import { HomeButton } from '../HomeButton';

interface UserWithRole {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null); // <-- nouvel état pour infos de debug

  // Nouveau: état pour info utilisateur courant
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCurrentUserInfo();
    }
    if (isAdmin) {
      loadUsers();
    }
  }, [user, isAdmin]);

  // Nouveau: récupère et combine user Supabase + ligne user_roles
  const fetchCurrentUserInfo = async () => {
    setCurrentUserLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('supabase.auth.getUser error:', userError);
        setDebug(prev => prev ?? JSON.stringify({ userError }, null, 2));
      }
      const current = userData?.user ?? user;

      // Cherche la ligne de rôle dans la table user_roles (maybeSingle pour ne pas throw si absent)
      const { data: roleRow, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', current?.id)
        .maybeSingle();

      if (roleError) {
        console.error('Erreur en récupérant user_roles pour current user:', roleError);
        setDebug(prev => prev ?? JSON.stringify({ roleError }, null, 2));
      }

      setCurrentUserInfo({
        user: current ?? null,
        roleRow: roleRow ?? null,
        derivedIsAdmin: (current?.id && roleRow?.role === 'admin') || !!isAdmin
      });
    } catch (err: any) {
      console.error('fetchCurrentUserInfo:', err);
      setDebug(prev => prev ?? (typeof err === 'object' ? JSON.stringify(err, Object.getOwnPropertyNames(err), 2) : String(err)));
    } finally {
      setCurrentUserLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    setDebug(null);
    try {
      // Get all user emails using the admin function
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_user_emails');

      if (usersError) {
        console.error('Erreur en récupérant les emails utilisateurs:', usersError);
        setDebug(JSON.stringify({ usersData: usersData ?? null, usersError }, null, 2));
        throw usersError;
      }

      // Get all users with roles from user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Erreur en récupérant user_roles:', rolesError);
        setDebug(JSON.stringify({ rolesData: rolesData ?? null, rolesError }, null, 2));
        throw rolesError;
      }

      // Combine user data with roles
      const usersWithRoles = (usersData || []).map((authUser: any) => {
        const userRole = (rolesData || []).find((role: any) => role.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || 'Email non disponible',
          role: userRole?.role || 'user',
          created_at: authUser.created_at || new Date().toISOString()
        };
      });

      setUsers(usersWithRoles);
      setDebug(JSON.stringify({ usersCount: usersWithRoles.length }, null, 2));
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err?.message ? `Erreur: ${err.message}` : 'Erreur lors du chargement des utilisateurs');
      if (!debug) {
        try { setDebug(JSON.stringify(err, Object.getOwnPropertyNames(err), 2)); } catch { setDebug(String(err)); }
      }
    } finally {
      setLoading(false);
    }
  };
const updateUserRole = async (userId: string, newRole: string) => {
  try {
    // Check if the user role already exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingRole) {
      // Update the existing role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Insert a new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
    }

    // Update local state
    setUsers(users.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    ));
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    setError('Erreur lors de la mise à jour du rôle');
  }
};
  // const updateUserRole = async (userId: string, newRole: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('user_roles')
  //       .upsert({
  //         user_id: userId,
  //         role: newRole,
  //         updated_at: new Date().toISOString()
  //       });

  //     if (error) throw error;

  //     // Update local state
  //     setUsers(users.map(u => 
  //       u.id === userId ? { ...u, role: newRole } : u
  //     ));
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour du rôle:', error);
  //     setError('Erreur lors de la mise à jour du rôle');
  //   }
  // };

if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Accès refusé. Vous devez être administrateur pour accéder à cette page.
        </div>

        {/* Diagnostic: afficher infos utilisateur courant et droits */}
        <div className="mt-4 bg-white shadow rounded p-4">
          <h3 className="font-medium mb-2">Diagnostic utilisateur courant</h3>

          {currentUserLoading ? (
            <div>Chargement des informations utilisateur...</div>
          ) : (
            <details>
              <summary className="cursor-pointer text-sm text-gray-600">Voir les détails techniques</summary>
              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify({
                  userFromContext: user ?? null,
                  currentUserInfo
                }, null, 2)}
              </pre>
            </details>
          )}

          <p className="text-sm text-gray-600 mt-2">
            Si "derivedIsAdmin" est false, l'appel supabase.auth.admin.listUsers() renverra 403 (not_admin).
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <HomeButton />
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Panneau d'Administration</h1>
      </div>

      {/* Afficher diagnostic utilisateur courant en haut pour faciliter le debug */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-medium mb-2">Infos utilisateur courant</h3>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600">Voir les détails techniques</summary>
          <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify({ userFromContext: user ?? null, currentUserInfo, isAdmin }, null, 2)}
          </pre>
        </details>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
          {debug && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-600">Détails techniques (debug)</summary>
              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">{debug}</pre>
            </details>
          )}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Gestion des Utilisateurs
        </h2>
        
        <div className="space-y-4">
          {users.map((userItem) => (
            <div
              key={userItem.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{userItem.email}</h3>
                <p className="text-sm text-gray-500">
                  Créé le : {new Date(userItem.created_at).toLocaleDateString()}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  userItem.role === 'admin' ? 'bg-red-100 text-red-800' :
                  userItem.role === 'super_agent' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userItem.role === 'admin' ? 'Administrateur' :
                   userItem.role === 'super_agent' ? 'Super Agent' :
                   'Utilisateur'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={userItem.role}
                  onChange={(e) => updateUserRole(userItem.id, e.target.value)}
                  className="text-sm rounded-md border-gray-300"
                  disabled={userItem.id === user?.id} // Can't change own role
                >
                  <option value="user">Utilisateur</option>
                  <option value="super_agent">Super Agent</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}