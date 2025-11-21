import React from 'react';
import {
  OperationInfo,
  OperationType,
  DangerousGoods,
  DayNightOperation,
  ConfinementLevel,
} from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Upload, Clock } from 'lucide-react';
import { OperationMap } from './OperationMap';
import { getGeoFileMimeTypes, isValidGeoFile } from '../../lib/kmzProcessor';

interface OperationFormProps {
  operation: OperationInfo;
  onChange: (operation: OperationInfo) => void;
}

export function OperationForm({ operation, onChange }: OperationFormProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(isValidGeoFile);
      
      if (validFiles.length !== files.length) {
        const invalidFiles = Array.from(files).filter(file => !isValidGeoFile(file));
        alert(`Fichiers non supportés ignorés: ${invalidFiles.map(f => f.name).join(', ')}\nFormats supportés: KML, KMZ, GeoJSON`);
      }

      if (validFiles.length > 0) {
        onChange({
          ...operation,
          geoFiles: [...(operation.geoFiles || []), ...validFiles],
        });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(operation.geoFiles || [])];
    newFiles.splice(index, 1);
    onChange({ ...operation, geoFiles: newFiles });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Informations sur l'opération</h2>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Informations générales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Tooltip text="Indiquer la distance maximale en km à prendre en compte pour la zone adjacente, à partir des limites de la zone tampon pour les risques liés au sol.">
              <label className="block text-sm font-medium text-gray-700">
                Étendue de la zone adjacente (km)
              </label>
            </Tooltip>
            <input
              type="number"
              value={operation.adjacentAreaExtent}
              onChange={(e) =>
                onChange({
                  ...operation,
                  adjacentAreaExtent: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Tooltip
              text="VLOS : le télépilote maintien une ligne de vue visuelle avec l'UAS à tout moment. 
            Les opérations EVLOS permettent le vol d'un UAS au-delà de la vue visuelle du télépilote en utilisant des ' observateurs entraînés ' pour garder l'aéronef dans leur champ de vision. 
            BVLOS : l'exploitation d'un UAS au-delà d'une distance où le pilote à distance est en mesure de réagir ou d'éviter d'autres utilisateurs de l'espace aérien par des moyens visuels directs"
            >
              <label className="block text-sm font-medium text-gray-700">
                Type d'opération
              </label>
            </Tooltip>
            <select
              value={operation.operationType}
              onChange={(e) =>
                onChange({
                  ...operation,
                  operationType: e.target.value as OperationType,
                  visualObserversCount:
                    e.target.value === 'EVLOS – Vol en vue Etendue'
                      ? operation.visualObserversCount
                      : 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="VLOS – Vol en vue">VLOS – Vol en vue</option>
              <option value="EVLOS – Vol en vue Etendue">
                EVLOS – Vol en vue Etendue
              </option>
              <option value="BVLOS – Vol hors vue">BVLOS – Vol hors vue</option>
            </select>
          </div>

          {operation.operationType === 'EVLOS – Vol en vue Etendue' && (
            <div>
              <Tooltip text="Penser à préciser sur la cartographie un fichier kml précisant la position des observateurs.">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre d'observateurs visuels
                </label>
              </Tooltip>
              <input
                type="number"
                value={operation.visualObserversCount}
                onChange={(e) =>
                  onChange({
                    ...operation,
                    visualObserversCount: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <Tooltip text="GM1 Article 2 - Definitions (11)">
              <label className="block text-sm font-medium text-gray-700">
                Transport de marchandises dangereuses
              </label>
            </Tooltip>
            <select
              value={operation.dangerousGoods}
              onChange={(e) =>
                onChange({
                  ...operation,
                  dangerousGoods: e.target.value as DangerousGoods,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>

          <div>
            <Tooltip text="Insérer l'altitude maximale de vol, exprimée en mètres et en pieds entre parenthèses, du volume opérationnel approuvé (en ajoutant le tampon pour le risque aérien, le cas échéant) en utilisant la référence AGL lorsque la limite supérieure est inférieure à 150 m (492 ft), ou en utilisant la référence MSL lorsque la limite supérieure est supérieure à 150 m (492 ft).">
              <label className="block text-sm font-medium text-gray-700">
                Hauteur maximale du volume d'opération
              </label>
            </Tooltip>
            <input
              type="number"
              value={operation.maxOperationHeight}
              onChange={(e) =>
                onChange({
                  ...operation,
                  maxOperationHeight: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Opération de jour ou de nuit
            </label>
            <select
              value={operation.dayNightOperation}
              onChange={(e) =>
                onChange({
                  ...operation,
                  dayNightOperation: e.target.value as DayNightOperation,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Jour">Jour</option>
              <option value="Nuit">Nuit</option>
              <option value="Jour & Nuit">Jour & Nuit</option>
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
                value={operation.operationStartTime}
                onChange={(e) =>
                  onChange({ ...operation, operationStartTime: e.target.value })
                }
                className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <Tooltip text="Heure Locale">
              <label className="block text-sm font-medium text-gray-700">
                Heure de Fin des opérations
              </label>
            </Tooltip>
            <div className="mt-1 relative">
              <input
                type="time"
                value={operation.operationEndTime}
                onChange={(e) =>
                  onChange({ ...operation, operationEndTime: e.target.value })
                }
                className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium mt-8">
          Cohérence des plans de vol et distance de sécurité multi-opérateurs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Tooltip text="Indiquer la distance maximale en m à prendre en compte par rapport à la zone d'évolution">
              <label className="block text-sm font-medium text-gray-700">
                Distance maximale par rapport au télépilote (m)
              </label>
            </Tooltip>
            <input
              type="number"
              value={operation.maxDistanceFromPilot}
              onChange={(e) =>
                onChange({
                  ...operation,
                  maxDistanceFromPilot: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Niveau de confinement atteint
            </label>
            <select
              value={operation.confinementLevel}
              onChange={(e) =>
                onChange({
                  ...operation,
                  confinementLevel: e.target.value as ConfinementLevel,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Basic">Basic</option>
              <option value="Enhanced">Enhanced</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Tooltip text='Préciser le type de certificat de télépilote, si nécessaire ; sinon, indiquer "Déclaré".'>
              <label className="block text-sm font-medium text-gray-700">
                Compétence du télépilote
              </label>
            </Tooltip>
            <textarea
              value={operation.pilotCompetency}
              onChange={(e) =>
                onChange({ ...operation, pilotCompetency: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <Tooltip text='Préciser le type de certificat pour le personnel, autre que le télépilote, essentiel à la sécurité de l&apos;opération, si nécessaire ; sinon, indiquer "Déclaré".'>
              <label className="block text-sm font-medium text-gray-700">
                Compétence du personnel, autre que le télépilote, essentielle à
                la sécurité de l'opération
              </label>
            </Tooltip>
            <textarea
              value={operation.otherPersonnelCompetency}
              onChange={(e) =>
                onChange({
                  ...operation,
                  otherPersonnelCompetency: e.target.value,
                })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Lister les Types d'événements à signaler à l'autorité compétente
              [en plus de ceux requis par le règlement (UE) no 376/2014]
            </label>
            <textarea
              value={operation.reportableEvents}
              onChange={(e) =>
                onChange({ ...operation, reportableEvents: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <Tooltip text="Déposez des fichiers KML, KMZ ou GeoJSON détaillant la mission">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zone Géographique
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept={getGeoFileMimeTypes()}
              onChange={handleFileChange}
              className="hidden"
              id="geo-upload"
              multiple
            />
            <label
              htmlFor="geo-upload"
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Déposer des fichiers KML, KMZ ou GeoJSON ici
              </span>
            </label>
          </div>
        </Tooltip>

        {operation.geoFiles && operation.geoFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {operation.geoFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  {file.name}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </span>
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

        <OperationMap geoFiles={operation.geoFiles || []} />
      </div>
    </div>
  );
}