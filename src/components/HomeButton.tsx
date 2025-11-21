import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { SaveConfirmDialog } from './dialogs/SaveConfirmDialog';
import { useStudyContext } from '../contexts/StudyContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function HomeButton() {
  const navigate = useNavigate();
  const { user, isSuperAgent } = useAuth();
  const { studyId, studyName, formData, saving, setSaving } = useStudyContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleHomeClick = () => {
    setIsDialogOpen(true);
  };

  const handleSaveAndExit = async () => {
    if (!user || saving) return;

    setSaving(true);
    try {
      if (studyId) {
        let updateQuery = supabase
          .from('sora_studies')
          .update({
            name: studyName,
            data: formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', studyId);

        // Only add user_id restriction for regular users
        if (!isSuperAgent) {
          updateQuery = updateQuery.eq('user_id', user.id);
        }

        await updateQuery;
      } else if (studyName) {
        await supabase
          .from('sora_studies')
          .insert({
            name: studyName,
            data: formData,
            user_id: user.id
          });
      }
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
      setIsDialogOpen(false);
    }
  };

  const handleExitWithoutSaving = () => {
    setIsDialogOpen(false);
    navigate('/');
  };

  return (
    <>
      <button
        onClick={handleHomeClick}
        className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        title="Retour à l'accueil"
      >
        <Home className="w-6 h-6 text-gray-600" />
      </button>

      <SaveConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
      />
    </>
  );
}
