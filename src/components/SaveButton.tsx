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
      // Préparer les données pour la sauvegarde
      let dataToSave = { ...formData };

      // Fonction helper pour uploader les fichiers d'une section
      const uploadSectionFiles = async (
        files: File[] | undefined,
        existingUrls: string[] | undefined,
        fileType: string,
        currentStudyId: string
      ): Promise<string[]> => {
        if (!files || files.length === 0) {
          return existingUrls || [];
        }

        const { uploadMultipleFiles } = await import('../lib/storageService');
        const uploadedUrls = await uploadMultipleFiles(files, currentStudyId, fileType);
        return [...(existingUrls || []), ...uploadedUrls];
      };

      // Si nous avons un studyId, uploader les nouveaux fichiers
      if (studyId) {
        // Upload des fichiers du drone
        if (formData.drone.technicalDocuments && formData.drone.technicalDocuments.length > 0) {
          const uploadedUrls = await uploadSectionFiles(
            formData.drone.technicalDocuments,
            formData.drone.technicalDocumentUrls,
            'drone-photos',
            studyId
          );

          dataToSave = {
            ...dataToSave,
            drone: {
              ...dataToSave.drone,
              technicalDocumentUrls: uploadedUrls,
              technicalDocuments: []
            }
          };
        }

        // Upload des fichiers géographiques de l'opération
        if (formData.operation.geoFiles && formData.operation.geoFiles.length > 0) {
          const uploadedUrls = await uploadSectionFiles(
            formData.operation.geoFiles,
            formData.operation.geoFileUrls,
            'operation-geo-files',
            studyId
          );

          dataToSave = {
            ...dataToSave,
            operation: {
              ...dataToSave.operation,
              geoFileUrls: uploadedUrls,
              geoFiles: []
            }
          };
        }

        // Upload des fichiers de trajectoire (RiskAssessment)
        if (formData.RiskAssessment.trajgeoFiles && formData.RiskAssessment.trajgeoFiles.length > 0) {
          const uploadedUrls = await uploadSectionFiles(
            formData.RiskAssessment.trajgeoFiles,
            formData.RiskAssessment.trajgeoFileUrls,
            'risk-assessment-traj-files',
            studyId
          );

          dataToSave = {
            ...dataToSave,
            RiskAssessment: {
              ...dataToSave.RiskAssessment,
              trajgeoFileUrls: uploadedUrls,
              trajgeoFiles: []
            }
          };
        }

        // Upload des fichiers de sortie Drosera
        if (formData.RiskAssessment.droseraOutputFile && formData.RiskAssessment.droseraOutputFile.length > 0) {
          const uploadedUrls = await uploadSectionFiles(
            formData.RiskAssessment.droseraOutputFile,
            formData.RiskAssessment.droseraOutputFileUrls,
            'drosera-output-files',
            studyId
          );

          dataToSave = {
            ...dataToSave,
            RiskAssessment: {
              ...dataToSave.RiskAssessment,
              droseraOutputFileUrls: uploadedUrls,
              droseraOutputFile: []
            }
          };
        }

        // Mise à jour de l'étude existante
        let updateQuery = supabase
          .from('sora_studies')
          .update({
            name: studyName,
            data: dataToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', studyId);

        if (!isSuperAgent) {
          updateQuery = updateQuery.eq('user_id', user.id);
        }

        const { error: updateError } = await updateQuery;
        if (updateError) throw updateError;

      } else {
        // Création d'une nouvelle étude
        const { data: insertData, error: insertError } = await supabase
          .from('sora_studies')
          .insert({
            name: studyName,
            data: dataToSave,
            user_id: user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (insertData) {
          setStudyId(insertData.id);

          // Upload de tous les fichiers après la création de l'étude
          let hasFilesToUpload = false;
          let updatedData = { ...dataToSave };

          // Upload des fichiers du drone
          if (formData.drone.technicalDocuments && formData.drone.technicalDocuments.length > 0) {
            const uploadedUrls = await uploadSectionFiles(
              formData.drone.technicalDocuments,
              [],
              'drone-photos',
              insertData.id
            );

            updatedData = {
              ...updatedData,
              drone: {
                ...updatedData.drone,
                technicalDocumentUrls: uploadedUrls,
                technicalDocuments: []
              }
            };
            hasFilesToUpload = true;
          }

          // Upload des fichiers géographiques de l'opération
          if (formData.operation.geoFiles && formData.operation.geoFiles.length > 0) {
            const uploadedUrls = await uploadSectionFiles(
              formData.operation.geoFiles,
              [],
              'operation-geo-files',
              insertData.id
            );

            updatedData = {
              ...updatedData,
              operation: {
                ...updatedData.operation,
                geoFileUrls: uploadedUrls,
                geoFiles: []
              }
            };
            hasFilesToUpload = true;
          }

          // Upload des fichiers de trajectoire
          if (formData.RiskAssessment.trajgeoFiles && formData.RiskAssessment.trajgeoFiles.length > 0) {
            const uploadedUrls = await uploadSectionFiles(
              formData.RiskAssessment.trajgeoFiles,
              [],
              'risk-assessment-traj-files',
              insertData.id
            );

            updatedData = {
              ...updatedData,
              RiskAssessment: {
                ...updatedData.RiskAssessment,
                trajgeoFileUrls: uploadedUrls,
                trajgeoFiles: []
              }
            };
            hasFilesToUpload = true;
          }

          // Upload des fichiers Drosera
          if (formData.RiskAssessment.droseraOutputFile && formData.RiskAssessment.droseraOutputFile.length > 0) {
            const uploadedUrls = await uploadSectionFiles(
              formData.RiskAssessment.droseraOutputFile,
              [],
              'drosera-output-files',
              insertData.id
            );

            updatedData = {
              ...updatedData,
              RiskAssessment: {
                ...updatedData.RiskAssessment,
                droseraOutputFileUrls: uploadedUrls,
                droseraOutputFile: []
              }
            };
            hasFilesToUpload = true;
          }

          // Mettre à jour l'étude avec les URLs si des fichiers ont été uploadés
          if (hasFilesToUpload) {
            await supabase
              .from('sora_studies')
              .update({ data: updatedData })
              .eq('id', insertData.id);
          }
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
