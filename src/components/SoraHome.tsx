import React, { useEffect, useState } from 'react';
import { Plane, SquarePen as PenSquare, Plus, Trash2, ShieldBan, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StudyNameDialog } from './dialogs/StudyNameDialog';
import { DeleteConfirmDialog } from './dialogs/DeleteConfirmDialog';
import { useStudyContext } from '../contexts/StudyContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogoutButton } from './LogoutButton';
import LogoCedFrance from '../image/LOGO_CED_FRANCE.png';

interface SavedStudy {
  id: string;
  name: string;
  updated_at: string;
  data: any;
  user_id: string;
  user_email?: string;
}

//TESTCHANGE

export function SoraHome() {
  const navigate = useNavigate();
  const { setStudyName, setFormData, setStudyId } = useStudyContext();
  const { user, isSuperAgent } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState<SavedStudy | null>(null);
  const [studies, setStudies] = useState<SavedStudy[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudies();
  }, [user]);

  const loadStudies = async () => {
    if (!user) return;

    let query = supabase
      .from('sora_studies')
      .select('*')
      .order('updated_at', { ascending: false });

    // If not super agent, only show user's own studies
    if (!isSuperAgent) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors du chargement des études:', error);
      setError('Erreur lors du chargement des études');
    } else {
      // For super agents, fetch user emails
      if (isSuperAgent && data && data.length > 0) {
        const userIds = [...new Set(data.map(study => study.user_id))];
        const { data: usersData } = await supabase.auth.admin.listUsers();

        const userEmailMap = new Map(
          usersData?.users?.map(u => [u.id, u.email]) || []
        );

        const transformedData = data.map(study => ({
          ...study,
          user_email: userEmailMap.get(study.user_id) || 'Email non disponible'
        }));
        setStudies(transformedData);
      } else {
        setStudies(data || []);
      }
      setError(null);
    }
  };

  const handleNewEvaluation = () => {
    setIsDialogOpen(true);
  };

  const handleStudyNameSubmit = (name: string) => {
    setStudyName(name);
    setStudyId(null);
    navigate('/evaluation/new');
  };

  const handleEditEvaluation = (study: SavedStudy) => {
    setStudyName(study.name);
    setFormData(study.data);
    setStudyId(study.id);
    navigate(`/evaluation/${study.id}`);
  };

  const handleDeleteClick = (study: SavedStudy) => {
    setStudyToDelete(study);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studyToDelete || !user) return;

    try {
      const { error } = await supabase
        .from('sora_studies')
        .delete()
        .eq('id', studyToDelete.id)
        .eq('user_id', isSuperAgent ? studyToDelete.user_id : user.id);

      if (error) throw error;

      setStudies(studies.filter(s => s.id !== studyToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudyToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'évaluation');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <LogoutButton />
      <div className="flex flex-col items-center mb-8">
        <img 
          src={LogoCedFrance}
          alt="Centres d'Essais Drones France" 
          className="w-64 h-auto mb-6"
        />
        {user && (
          <p className="text-gray-600 mb-4">
            Bonjour {user.email}, heureux de vous revoir parmi nous.
          </p>
        )}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Évaluation SORA
                {isSuperAgent ? (
                  <span className="text-lg text-blue-600 ml-2">(Mode Super Agent)</span>
                ) : (
                  <span className="text-lg text-blue-600 ml-2">(Mode Utilisateur)</span>
                )}
            </h1>
          </div>
          
          {/* {isSuperAgent ? ( */}
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Administrateur 
            </button>
           {/* ) : null} */}
          

          <button
            onClick={handleNewEvaluation}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle évaluation
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isSuperAgent ? 'Toutes les évaluations SORA' : 'Mes évaluations SORA'}
        </h2>
        
        <div className="space-y-4">
          {studies.length > 0 ? (
            studies.map((study) => (
              <div
                key={study.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{study.name}</h3>
                  {isSuperAgent && (
                    <p className="text-sm text-blue-600">
                      Utilisateur : {study.user_email}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Dernière modification : {new Date(study.updated_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditEvaluation(study)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title={isSuperAgent ? "Voir l'évaluation" : "Modifier l'évaluation"}
                  >
                    <PenSquare className="w-5 h-5" />
                  </button>
                  {(study.user_id === user.id || isSuperAgent) && (
                    <button
                      onClick={() => handleDeleteClick(study)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Supprimer l'évaluation"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{isSuperAgent ? 'Aucune évaluation dans le système' : 'Aucune évaluation sauvegardée'}</p>
              <p className="text-sm mt-2">
                {isSuperAgent ? 'Les utilisateurs peuvent créer des évaluations' : 'Cliquez sur "Nouvelle évaluation" pour commencer'}
              </p>
            </div>
          )}
        </div>
      </div>

      <StudyNameDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleStudyNameSubmit}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        studyName={studyToDelete?.name || ''}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setStudyToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}