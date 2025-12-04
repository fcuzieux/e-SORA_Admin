import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStudyContext } from '../contexts/StudyContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SaveButtonProps {
  className?: string;
}

export function SaveButton({ className = '' }: SaveButtonProps) {
  const { studyId, studyName, formData, saving, setSaving, setStudyId } = useStudyContext();
  const { user, isSuperAgent } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!studyName || saving || !user) return;

    setSaving(true);
    setError(null);

    try {
      // Generate a temporary ID for new studies to organize file uploads
      const currentStudyId = studyId || `temp_${Date.now()}`;

      // Import the file storage utility
      const { prepareFormDataForSave } = await import('../lib/fileStorage');

      // Prepare form data by uploading files and converting to URLs
      const preparedData = await prepareFormDataForSave(formData, currentStudyId);

      if (studyId) {
        // Update existing study
        let updateQuery = supabase
          .from('sora_studies')
          .update({
            name: studyName,
            data: preparedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', studyId);

        if (!isSuperAgent) {
          updateQuery = updateQuery.eq('user_id', user.id);
        }

        const { error: updateError } = await updateQuery;
        if (updateError) throw updateError;

      } else {
        // Insert new study
        const { data: insertData, error: insertError } = await supabase
          .from('sora_studies')
          .insert({
            name: studyName,
            data: preparedData,
            user_id: user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (insertData) {
          setStudyId(insertData.id);

          // If we used a temporary ID, we should rename the files in storage
          // For now, we'll keep them as-is since they're organized by study ID
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la sauvegarde';
      setError(errorMessage);
      console.error('Erreur détaillée lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed bottom-3 left-8 flex flex-col items-end">
      {error && (
        <div className="mb-2 p-3 bg-red-100 text-red-700 rounded-lg max-w-md">
          {error}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saving || !studyName || !user}
        className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 ${saving || !user
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
          } ${className}`}
      >
        <Save className="w-5 h-5" />
        <span className="font-medium">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </span>
      </button>
    </div>
  );
}
