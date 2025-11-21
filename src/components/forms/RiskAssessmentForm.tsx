import React, { useRef, useState } from 'react';
import {
  RiskAssessmentInfo,
  assessmentTypeHauteurVol,
  assessmentCriticalArea,
  PopulationDensityModulation,
  SailLevel,
} from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Upload, Clock } from 'lucide-react';
import { RiskAssessmentMap } from './RiskAssessmentMap';

interface RiskAssessmentFormProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
  showOnly?: Array<keyof RiskAssessmentInfo>;
}

export function RiskAssessmentForm({
  assessment,
  onChange,
  showOnly,
}: RiskAssessmentFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const invalidFiles = newFiles.filter(
        (file) =>
          !file.name.startsWith('Trajectoire_') &&
          (file.name.endsWith('.kml') || file.name.endsWith('.geojson'))
      );

      if (invalidFiles.length > 0) {
        setErrorMessage(
          "ERREUR : votre fichier doit avoir un nom de la forme 'Trajectoire_Nom-de-la-trajectoire' et être un fichier .kml ou .geojson"
        );
        return;
      }

      setErrorMessage(null);

      const fileCopies = await Promise.all(
        newFiles.map(async (file) => {
          const content = await file.text();
          return new File([content], file.name, { type: file.type });
        })
      );

      onChange({
        ...assessment,
        trajgeoFiles: [...(assessment.trajgeoFiles || []), ...fileCopies],
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(assessment.trajgeoFiles || [])];
    newFiles.splice(index, 1);
    onChange({ ...assessment, trajgeoFiles: newFiles });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Évaluation des Risques</h2>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Mission</h3>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text="Option Hauteur de vol">
                <label className="block text-sm font-medium text-gray-700">
                  Hauteur de Vol
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentTypeHauteurVol}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentTypeHauteurVol: e.target
                      .value as assessmentTypeHauteurVol,
                    followTerrainHeight:
                      e.target.value === 'Hauteur de vol en suivi de terrain'
                        ? assessment.followTerrainHeight
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Hauteur de vol suivant trajectoire(s)">
                  Hauteur de vol suivant trajectoire(s)
                </option>
                <option value="Hauteur de vol en suivi de terrain">
                  Hauteur de vol en suivi de terrain
                </option>
              </select>
            </div>

            {assessment.assessmentTypeHauteurVol ===
              'Hauteur de vol en suivi de terrain' && (
              <div>
                <Tooltip text="Hauteur qui sera appliquée suivant la topographie terrain.">
                  <label className="block text-sm font-medium text-gray-700">
                    Hauteur de la trajectoire
                  </label>
                </Tooltip>
                <input
                  type="number"
                  value={assessment.followTerrainHeight}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      followTerrainHeight: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <Tooltip text=" XXX ">
                <label className="block text-sm font-medium text-gray-700">
                  Moduler la densité de population en fonction du temps de vol
                  le long de la trajectoire du drone
                </label>
              </Tooltip>
              <select
                value={assessment.PopulationDensityModulation}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    PopulationDensityModulation: e.target
                      .value as PopulationDensityModulation,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="NON">NON</option>
                <option value="OUI">OUI</option>
              </select>
            </div>

            <div>
              <Tooltip text="Heure Locale">
                <label className="block text-sm font-medium text-gray-700">
                  Heure de Démarrage des opérations
                </label>
              </Tooltip>
              <div className="mt-1 relative">
                <input
                  type="time"
                  value={assessment.assessmentStartTime}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      assessmentStartTime: e.target.value,
                    })
                  }
                  className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <Tooltip text="Insérez vos trajectoires : un fichier par tajectoire sous le nom Trajectoire_Nom-de-la-trajectoire">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trajectoire
              </label>
            </Tooltip>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".kml,.geojson"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Déposer des fichiers KML ou GeoJSON ici
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                {errorMessage}
              </div>
            )}
            {assessment.trajgeoFiles && assessment.trajgeoFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {assessment.trajgeoFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}

            <RiskAssessmentMap geoFiles={assessment.trajgeoFiles || []} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">
          iGRC : Intrinsic Ground Risk Class
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text="Aussi appelée Critical Area ou Surface de Crash">
                <label className="block text-sm font-medium text-gray-700">
                  Surface Critique
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentCriticalArea}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentCriticalArea: e.target
                      .value as assessmentCriticalArea,
                    CriticalArea:
                      e.target.value === 'Spécifiée par le déposant'
                        ? assessment.CriticalArea
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Calcul selon les table SORA">
                  Calcul selon les table SORA
                </option>
                <option value="Spécifiée par le déposant">
                  Spécifiée par le déposant
                </option>
              </select>
            </div>

            {assessment.assessmentCriticalArea ===
              'Spécifiée par le déposant' && (
              <div>
                <Tooltip text="Valeur de la Surface Critique déclarée (m²) A justifier par l'opérateur en annexe ! ">
                  <label className="block text-sm font-medium text-gray-700">
                    Valeur de la Surface Critique déclarée (m²)
                  </label>
                </Tooltip>
                <input
                  type="number"
                  value={assessment.CriticalArea}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      CriticalArea: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Ground Risk Assessment</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scénario opérationnel
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="VLOS">VLOS</option>
              <option value="BVLOS">BVLOS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Densité de population
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="low">Faible</option>
              <option value="moderate">Modérée</option>
              <option value="high">Élevée</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
