import React, { useMemo, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
  OperationInfo,
  OperationType,
  DangerousGoods,
  DroppingMaterials,
  ControlMultipleDrones,
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
const operationType = ['VLOS – Vol en vue', 'EVLOS – Vol en vue Etendue', 'BVLOS – Vol hors vue'];
export function OperationForm({ operation, onChange }: OperationFormProps) {
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Charger les fichiers depuis les URLs lors du chargement initial
  useEffect(() => {
    const loadFilesFromUrls = async () => {
      if (!operation.geoFileUrls || operation.geoFileUrls.length === 0) {
        return;
      }

      // Ne charger que si nous n'avons pas déjà les fichiers
      if (operation.geoFiles && operation.geoFiles.length > 0) {
        return;
      }

      setLoadingFiles(true);
      try {
        const { urlToFile } = await import('../../lib/storageService');

        const filePromises = operation.geoFileUrls.map((url, index) => {
          const fileName = url.split('/').pop() || `file_${index}`;
          return urlToFile(url, fileName);
        });

        const files = await Promise.all(filePromises);
        const validFiles = files.filter((file): file is File => file !== null);

        if (validFiles.length > 0) {
          onChange({ ...operation, geoFiles: validFiles });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFilesFromUrls();
  }, [operation.geoFileUrls]); // Dépendance uniquement sur les URLs

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

  const errors = useMemo(() => ({
    operationType: operation.operationType === null,
    dangerousGoods: operation.dangerousGoods === null,
    droppingMaterials: operation.droppingMaterials === null,
    controlMultipleDrones: operation.controlMultipleDrones === null && operation.controlMultipleDronesNumber <= 0,
    dayNightOperation: operation.dayNightOperation === null,
    operationStartTime: !operation.operationStartTime.trim(),
    operationEndTime: !operation.operationEndTime.trim(),
    maxDistanceFromPilot: operation.maxDistanceFromPilot <= 0,
    visualObserversCount: operation.visualObserversCount <= 0,
    pilotCompetency: !operation.pilotCompetency.trim(),
    geoFiles: !operation.geoFiles || operation.geoFiles.length === 0,
  }), [operation]);

  const getInputClassName = (fieldName: keyof typeof errors) => {
    return `mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${errors[fieldName]
      ? 'border-red-300 focus:border-red-500 bg-red-50'
      : 'border-gray-300 focus:border-blue-500'
      }`;
  };

  const getLabelClassName = (fieldName: keyof typeof errors) => {
    return `block text-sm font-medium ${errors[fieldName] ? 'text-red-600' : 'text-gray-700'}`;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Informations sur l'opération</h2>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Informations générales</h3>

        <div>
          <Tooltip text="Expliquez brièvement le type d'opération prévu et donnez une description générale du lieu.
(par exemple, « inspection des lignes électriques en zone rurale », « livraison médicale par drone en banlieue », etc.)">
            <label className="block text-sm font-medium text-gray-700">
              Description simple de l'opération
            </label>
          </Tooltip>
          <Editor
            // tinymceScriptSrc="/tinymce/tinymce.min.js"
            apiKey={process.env.REACT_APP_TINYMCE_KEY}
            init={{
              menubar: false,
              toolbar: 'undo redo | bold italic strikethrough | bullist numlist | alignleft aligncenter alignright outdent indent',
              height: 300,
            }}
            value={operation.SimpleDescription}
            onEditorChange={(content: string) =>
              onChange({ ...operation, SimpleDescription: content })
            }
          />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
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
          </div> */}


          <div>
            <Tooltip
              text="VLOS : le télépilote maintien une ligne de vue visuelle avec l'UAS à tout moment. 
            Les opérations EVLOS permettent le vol d'un UAS au-delà de la vue visuelle du télépilote en utilisant des ' observateurs entraînés ' pour garder l'aéronef dans leur champ de vision. 
            BVLOS : l'exploitation d'un UAS au-delà d'une distance où le pilote à distance est en mesure de réagir ou d'éviter d'autres utilisateurs de l'espace aérien par des moyens visuels directs"
            >
              <label className={getLabelClassName('operationType')}>
                Type d'opération *
              </label>
            </Tooltip>
            <select
              value={operation.operationType}
              onChange={(e) =>
                onChange({
                  ...operation,
                  operationType: e.target.value as OperationType || null,
                  visualObserversCount:
                    e.target.value === 'EVLOS – Vol en vue Etendue'
                      ? operation.visualObserversCount
                      : 0,
                })
              }
              className={getInputClassName('operationType')}
            >
              <option value="">Sélectionner un type d'opération</option>

              {operationType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              {/* <option value="VLOS – Vol en vue">VLOS – Vol en vue</option>
              <option value="EVLOS – Vol en vue Etendue">
                EVLOS – Vol en vue Etendue
              </option>
              <option value="BVLOS – Vol hors vue">BVLOS – Vol hors vue</option> */}
            </select>
          </div>

          {operation.operationType === 'EVLOS – Vol en vue Etendue' ? (
            <div>
              <Tooltip text="Penser à préciser sur la cartographie un fichier kml précisant la position des observateurs.">
                <label className={getLabelClassName('visualObserversCount')}>
                  Nombre d'observateurs visuels *
                </label>
              </Tooltip>
              <input
                type="number"
                value={operation.visualObserversCount}
                min={0}
                onChange={(e) =>
                  onChange({
                    ...operation,
                    visualObserversCount: parseInt(e.target.value) || 0,
                  })
                }
                className={getInputClassName('visualObserversCount')}
              />
            </div>
          ) : <div>&nbsp;</div>}

          <div>
            <Tooltip text="GM1 Article 2 - Definitions (11)">
              <label className={getLabelClassName('dangerousGoods')}>
                Transport de marchandises dangereuses *
              </label>
            </Tooltip>
            <select
              value={operation.dangerousGoods}
              onChange={(e) =>
                onChange({
                  ...operation,
                  dangerousGoods: e.target.value as DangerousGoods || null,
                })
              }
              className={getInputClassName('dangerousGoods')}
            >
              <option value="">Sélectionner une réponse</option>
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>
          {operation.dangerousGoods === 'OUI' ? (
            <div className="md:col-span-2">
              <Tooltip text="Transport de marchandises dangereuses. Cochez cette case si l'UAS transporte des marchandises dangereuses (par exemple, des articles ou substances dangereux, des explosifs, des gaz, des substances inflammables, radioactives, toxiques ou corrosives, etc.).
                Si cette case est cochée, dressez la liste des marchandises dangereuses transportées et fournissez les procédures relatives au transport de marchandises dangereuses, en expliquant comment vous vous assurez qu'aucun risque supplémentaire n'est posé à des tiers. Joignez les preuves ou les documents justificatifs (par exemple : autorisations, procédures de manutention, instructions).">
                <label className="block text-sm font-medium text-gray-700">
                  Description des marchandises dangereuses transportées *
                </label>
              </Tooltip>
              <Editor
                // tinymceScriptSrc="/tinymce/tinymce.min.js"
                apiKey={process.env.REACT_APP_TINYMCE_KEY}
                init={{
                  menubar: false,
                  toolbar: 'undo redo | bold italic strikethrough | bullist numlist | alignleft aligncenter alignright outdent indent',
                  height: 300,
                }}
                value={operation.dangerousGoodsDescription}
                onEditorChange={(content: string) =>
                  onChange({ ...operation, dangerousGoodsDescription: content })
                }
              />
            </div>
          ) : <div>&nbsp;</div>}

          {/* // Dropping materials */}
          <div>
            <Tooltip text="GM1 Article 2 - Definitions (11)">
              <label className={getLabelClassName('droppingMaterials')}>
                Largage *
              </label>
            </Tooltip>
            <select
              value={operation.droppingMaterials}
              onChange={(e) =>
                onChange({
                  ...operation,
                  droppingMaterials: e.target.value as DroppingMaterials || null,
                })
              }
              className={getInputClassName('droppingMaterials')}
            >
              <option value="">Sélectionner une réponse</option>
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>
          {operation.droppingMaterials === 'OUI' ? (
            <div className="md:col-span-2">
              <Tooltip text="Largage de matériels. Cochez cette case si l'opération comprend le largage ou le déversement de matériels/liquides depuis l'UA (par exemple, livraison de nourriture ou de colis, pulvérisation de produits chimiques).
              Si OUI, décrivez les matériels largués et référencez les documents justificatifs (autorisations, procédures de manipulation, instructions) afin d'expliquer comment l'opération peut être effectuée en toute sécurité.">
                <label className="block text-sm font-medium text-gray-700">
                  Description des matériels largués *
                </label>
              </Tooltip>
              <Editor
                // tinymceScriptSrc="/tinymce/tinymce.min.js"
                apiKey={process.env.REACT_APP_TINYMCE_KEY}
                init={{
                  menubar: false,
                  toolbar: 'undo redo | bold italic strikethrough | bullist numlist | alignleft aligncenter alignright outdent indent',
                  height: 300,
                }}
                value={operation.droppingMaterialsDescription}
                onEditorChange={(content: string) =>
                  onChange({ ...operation, droppingMaterialsDescription: content })
                }
              />
            </div>
          ) : <div>&nbsp;</div>}



          {/* // Does the remote pilot control more than one UA simultaneously?  */}
          <div>
            <Tooltip text="GM1 Article 2 - Definitions (11)">
              <label className={getLabelClassName('controlMultipleDrones')}>
                Le pilote contrôle-t-il plusieurs UA simultanément ? *
              </label>
            </Tooltip>
            <select
              value={operation.controlMultipleDrones}
              onChange={(e) =>
                onChange({
                  ...operation,
                  controlMultipleDrones: e.target.value as ControlMultipleDrones || null,
                })
              }
              className={getInputClassName('controlMultipleDrones')}
            >
              <option value="">Sélectionner une réponse</option>
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>
          {operation.controlMultipleDrones === 'OUI' ? (
            <div className="md:col-span-2">

              <Tooltip text="Nombre d'UA contrôlés par un seul pilote">
                <label className={getLabelClassName('controlMultipleDronesNumber')}>
                  Nombre d'UA contrôlés par un seul pilote *
                </label>
              </Tooltip>
              <input
                type="number"
                value={operation.controlMultipleDronesNumber}
                min={0}
                onChange={(e) =>
                  onChange({
                    ...operation,
                    controlMultipleDronesNumber: parseFloat(e.target.value) || 0,
                  })
                }
                className={getInputClassName('controlMultipleDronesNumber')}
              />


              <Tooltip text="Si cette option est sélectionnée, précisez le nombre d'UA contrôlés par un seul pilote. Cette option n'est disponible que si le concepteur a indiqué que l'UAS a été conçu avec un niveau d'automatisation réduisant l'intervention du pilote à distance.">
                <label className="block text-sm font-medium text-gray-700">
                  Pécisez le nombre d'UA contrôlés par un seul pilote *
                </label>
              </Tooltip>
              <Editor
                // tinymceScriptSrc="/tinymce/tinymce.min.js"
                apiKey={process.env.REACT_APP_TINYMCE_KEY}
                init={{
                  menubar: false,
                  toolbar: 'undo redo | bold italic strikethrough | bullist numlist | alignleft aligncenter alignright outdent indent',
                  height: 300,
                }}
                value={operation.controlMultipleDronesDescription}
                onEditorChange={(content: string) =>
                  onChange({ ...operation, controlMultipleDronesDescription: content })
                }
              />
            </div>
          ) : <div>&nbsp;</div>}
          {/* <div>
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
          </div> */}


          <div>
            <label className={getLabelClassName('dayNightOperation')}>
              Opération de jour ou de nuit *
            </label>
            <select
              value={operation.dayNightOperation}
              onChange={(e) =>
                onChange({
                  ...operation,
                  dayNightOperation: e.target.value as DayNightOperation || null,
                })
              }
              className={getInputClassName('dayNightOperation')}
            >
              <option value="">Sélectionner une réponse</option>
              <option value="Jour">Jour</option>
              <option value="Nuit">Nuit</option>
              <option value="Jour & Nuit">Jour & Nuit</option>
            </select>
          </div>
          <div>&nbsp;</div>
          <div>
            <Tooltip text="Heure Locale">
              <label className={getLabelClassName('operationStartTime')}>
                Heure de Démarrage des opérations *
              </label>
            </Tooltip>
            <div className="mt-1 relative">
              <input
                type="time"
                value={operation.operationStartTime}
                onChange={(e) =>
                  onChange({ ...operation, operationStartTime: e.target.value })
                }
                className={`block w-full pr-10 rounded-md shadow-sm focus:ring-blue-500 ${errors.operationStartTime
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
              />
              <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <Tooltip text="Heure Locale">
              <label className={getLabelClassName('operationEndTime')}>
                Heure de Fin des opérations *
              </label>
            </Tooltip>
            <div className="mt-1 relative">
              <input
                type="time"
                value={operation.operationEndTime}
                onChange={(e) =>
                  onChange({ ...operation, operationEndTime: e.target.value })
                }
                className={`block w-full pr-10 rounded-md shadow-sm focus:ring-blue-500 ${errors.operationEndTime
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500'
                  }`}
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
              <label className={getLabelClassName('maxDistanceFromPilot')}>
                Distance maximale par rapport au télépilote (m) *
              </label>
            </Tooltip>
            <input
              type="number"
              value={operation.maxDistanceFromPilot}
              min={0}
              onChange={(e) =>
                onChange({
                  ...operation,
                  maxDistanceFromPilot: parseFloat(e.target.value) || 0,
                })
              }
              className={getInputClassName('maxDistanceFromPilot')}
            />
          </div>

          {/* <div>
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
          </div> */}

          <div className="md:col-span-2">
            <Tooltip text='Préciser le type de certificat de télépilote, si nécessaire ; sinon, indiquer "Déclaré".'>
              <label className={getLabelClassName('pilotCompetency')}>
                Compétence du télépilote *
              </label>
            </Tooltip>
            <textarea
              value={operation.pilotCompetency}
              onChange={(e) =>
                onChange({ ...operation, pilotCompetency: e.target.value })
              }
              rows={3}
              className={getInputClassName('pilotCompetency')}
            />
          </div>

          <div className="md:col-span-2">
            <Tooltip text='Préciser le type de certificat pour le personnel, autre que le télépilote, essentiel à la sécurité de l&apos;opération, si nécessaire ; sinon, indiquer "Rien à Déclaré".'>
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
          <label className={getLabelClassName('geoFiles')}>
            Zone Géographique *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${errors.geoFiles
            ? 'border-red-300 bg-red-50 hover:border-red-500'
            : 'border-gray-300 hover:border-blue-500'
            }`}>
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
                {loadingFiles
                  ? 'Chargement des fichiers...'
                  : 'Déposer des fichiers KML, KMZ ou GeoJSON ici'}
              </span>
            </label>
          </div>
        </Tooltip>

        {operation.geoFiles && operation.geoFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {operation.geoFiles
              .filter((file): file is File => file !== null && file !== undefined && file instanceof File)
              .map((file, index) => (
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
    </div >
  );
}