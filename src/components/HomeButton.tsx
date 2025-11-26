import { useState } from 'react';
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

        await updateQuery;
      } else if (studyName) {
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
