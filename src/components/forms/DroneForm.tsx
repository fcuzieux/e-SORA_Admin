import React, { useRef, useState, useEffect, useMemo } from 'react';
import { DroneInfo, DroneClass, UasType, FileMetadata } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';

interface DroneFormProps {
  drone: DroneInfo;
  onChange: (drone: DroneInfo) => void;
}

const droneClasses: DroneClass[] = ['Sans', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'Prototype', 'Specifique', 'Certifie'];
const uasTypes: UasType[] = ['Avion', 'Hélicoptère', 'Multirotor', 'Hybride/VTOL', 'Plus léger que l\'air', 'Autre'];

const FilePreview = ({ file }: { file: File | FileMetadata }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Check if it's a FileMetadata (has url property)
    if ('url' in file) {
      // It's FileMetadata from Supabase
      if (file.type.startsWith('image/')) {
        setPreview(file.url);
      } else {
        setPreview(null);
      }
      return;
    }

    // It's a File object
    if (!file.type.startsWith('image/')) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  const fileName = 'name' in file ? file.name : (file as File).name;

  return (
    <div className="flex justify-center bg-gray-100 rounded-lg p-2 mb-2">
      <img
        src={preview}
        alt={fileName}
        className="max-h-40 object-contain rounded"
      />
    </div>
  );
};

export function DroneForm({ drone, onChange }: DroneFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTechnicalRequirements, setShowTechnicalRequirements] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Charger les fichiers depuis les URLs lors du chargement initial
  useEffect(() => {
    const loadFilesFromUrls = async () => {
      if (!drone.technicalDocumentUrls || drone.technicalDocumentUrls.length === 0) {
        return;
      }

      // Ne charger que si le nombre de fichiers ne correspond pas au nombre d'URLs
      const currentFileCount = drone.technicalDocuments?.length || 0;
      if (currentFileCount === drone.technicalDocumentUrls.length) {
        return;
      }

      setLoadingFiles(true);
      try {
        const { urlToFile } = await import('../../lib/storageService');

        const filePromises = drone.technicalDocumentUrls.map((url, index) => {
          const fileName = url.split('/').pop() || `file_${index}`;
          return urlToFile(url, fileName);
        });

        const files = await Promise.all(filePromises);
        const validFiles = files.filter((file): file is File => file !== null);

        if (validFiles.length > 0) {
          onChange({ ...drone, technicalDocuments: validFiles });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFilesFromUrls();
  }, [drone.technicalDocumentUrls]); // Dépendance uniquement sur les URLs

  const errors = useMemo(() => ({
    manufacturer: !drone.manufacturer.trim(),
    model: !drone.model.trim(),
    uasType: drone.uasType === null,
    serialNumber: !drone.serialNumber.trim(),
    classIdentification: drone.classIdentification === null,
    maxCharacteristicDimension: drone.maxCharacteristicDimension <= 0,
    VCruise: drone.VCruise <= 0,
    maxSpeed: drone.maxSpeed <= 0,
    MTOW: drone.MTOW <= 0,
    maxWindSpeedTakeoff: drone.environmentalLimitations.maxWindSpeedTakeoff <= 0,
    maxGustSpeed: drone.environmentalLimitations.maxGustSpeed <= 0,
    minTemperature: drone.environmentalLimitations.minTemperature === -999,
    maxTemperature: drone.environmentalLimitations.maxTemperature === 999,
    visibility: drone.environmentalLimitations.visibility === -999,
  }), [drone]);

  const getInputClassName = (fieldName: keyof typeof errors) => {
    return `mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${errors[fieldName]
      ? 'border-red-300 focus:border-red-500 bg-red-50'
      : 'border-gray-300 focus:border-blue-500'
      }`;
  };

  const getLabelClassName = (fieldName: keyof typeof errors) => {
    return `block text-sm font-medium ${errors[fieldName] ? 'text-red-600' : 'text-gray-700'}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      newFiles.forEach(file => {
        if (file.size <= 500 * 1024) { // 500KB limit
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        alert(`Les fichiers suivants dépassent la taille limite de 500 Ko et n'ont pas été ajoutés :\n${invalidFiles.join('\n')}`);
      }

      if (validFiles.length > 0) {
        onChange({ ...drone, technicalDocuments: [...(drone.technicalDocuments || []), ...validFiles] });
      }

      // Reset input to allow selecting the same file again if needed
      event.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(drone.technicalDocuments || [])];
    newFiles.splice(index, 1);
    onChange({ ...drone, technicalDocuments: newFiles });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Informations sur le drone</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Tooltip text="Fabricant de l'UAS tel qu'il a été déclaré au cours de la procédure d'enregistrement. (Design Organisation)">
            <label className={getLabelClassName('manufacturer')}>Fabricant *</label>
          </Tooltip>
          <input
            type="text"
            value={drone.manufacturer}
            onChange={(e) => onChange({ ...drone, manufacturer: e.target.value })}
            className={getInputClassName('manufacturer')}
          />
        </div>

        <div>
          <label className={getLabelClassName('model')}>Modèle *</label>
          <input
            type="text"
            value={drone.model}
            onChange={(e) => onChange({ ...drone, model: e.target.value })}
            className={getInputClassName('model')}
          />
        </div>

        <div>
          <label className={getLabelClassName('uasType')}>Type d'UAS *</label>
          <select
            value={drone.uasType}
            onChange={(e) => onChange({ ...drone, uasType: e.target.value as UasType || null })}
            className={getInputClassName('uasType')}
          >
            <option value="">Sélectionner un type d'UAS</option>
            {uasTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={getLabelClassName('serialNumber')}>Numéro de série *</label>
          <input
            type="text"
            value={drone.serialNumber}
            onChange={(e) => onChange({ ...drone, serialNumber: e.target.value })}
            className={getInputClassName('serialNumber')}
          />
        </div>

        <div>
          <Tooltip text="Si requis">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de Certificat de Type (TC) ou de DVR
            </label>
          </Tooltip>
          <input
            type="text"
            value={drone.typeCertificateNumber}
            onChange={(e) => onChange({ ...drone, typeCertificateNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Tooltip text="Si requis">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de Certificat de Navigabilité (CofA)
            </label>
          </Tooltip>
          <input
            type="text"
            value={drone.airworthinessCertificateNumber}
            onChange={(e) => onChange({ ...drone, airworthinessCertificateNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Tooltip text="Si requis">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de Certificat Acoustique
            </label>
          </Tooltip>
          <input
            type="text"
            value={drone.acousticCertificateNumber}
            onChange={(e) => onChange({ ...drone, acousticCertificateNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <Tooltip text="Si une classe est apposée sur le drone">
            <label className={getLabelClassName('classIdentification')}>Identification de Classe *</label>
          </Tooltip>
          <select
            value={drone.classIdentification || ''}
            onChange={(e) => onChange({
              ...drone,
              classIdentification: e.target.value as DroneClass || null
            })}
            className={getInputClassName('classIdentification')}
          >
            <option value="">Sélectionner une classe</option>
            {droneClasses.map((classId) => (
              <option key={classId} value={classId}>
                Classe {classId}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos et description schématique du système UAS
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg"
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
                {loadingFiles
                  ? 'Chargement des fichiers...'
                  : 'Télécharger des fichiers image(.png, .jpg, .jpeg) ici ou cliquer pour parcourir (taille limite de 500 Ko)'}
              </span>
            </div>
          </div>
          {drone.technicalDocuments && drone.technicalDocuments.length > 0 && (
            <div className="mt-2 space-y-2">
              {drone.technicalDocuments.map((file, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                  <FilePreview file={file} />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium">Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Longueur (m)</label>
              <input
                type="number"
                value={drone.dimensions.length}
                min={0}
                onChange={(e) => onChange({
                  ...drone,
                  dimensions: { ...drone.dimensions, length: parseFloat(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Largeur (m)</label>
              <input
                type="number"
                value={drone.dimensions.width}
                min={0}
                onChange={(e) => onChange({
                  ...drone,
                  dimensions: { ...drone.dimensions, width: parseFloat(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hauteur (m)</label>
              <input
                type="number"
                value={drone.dimensions.height}
                min={0}
                onChange={(e) => onChange({
                  ...drone,
                  dimensions: { ...drone.dimensions, height: parseFloat(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <Tooltip text={
            <div>
              Exemples de dimensions caractéristiques maximales de l'UA :
              <br />
              i. Envergure d'une aile fixe,
              <br />
              ii. Diamètre des pales pour les giravions,
              <br />
              iii. Distance maximale entre les extrémités des pales pour les multicoptères.
            </div>
          }>

            <label className={getLabelClassName('maxCharacteristicDimension')}>Dimensions caractéristiques maximales (m) *</label>
          </Tooltip>
          <input
            type="number"
            value={drone.maxCharacteristicDimension}
            min={0}
            onChange={(e) => onChange({ ...drone, maxCharacteristicDimension: parseFloat(e.target.value) })}
            step="0.1" // Ajoutez cet attribut pour définir l'incrément de l'input
            className={getInputClassName('maxCharacteristicDimension')}
          />
        </div>

        <div> &nbsp;</div>

        <h3 className="text-lg font-medium">Vitesses Caractéristiques</h3>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Vitesse de Croisière (m/s)</label>
          <input
            type="number"
            value={drone.CruiseSpeed}
            step="0.1"
            max={drone.maxSpeed}
            min={drone.minSpeed}
            onChange={(e) => onChange({ ...drone, CruiseSpeed: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div> */}

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Vitesse minimale (m/s)</label>
          <input
            type="number"
            value={drone.minSpeed}
            step="0.1"
            min={0}
            onChange={(e) => onChange({ ...drone, minSpeed: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div> */}
        <div> &nbsp;</div>
        <div>
          <label className={getLabelClassName('VCruise')}>Vitesse de Croisière (m/s) *</label>
          <input
            type="number"
            value={drone.VCruise}
            step="0.1"
            min={0}
            onChange={(e) => onChange({ ...drone, VCruise: parseFloat(e.target.value) })}
            className={getInputClassName('VCruise')}
          />
        </div>
        <div>
          <Tooltip text="Vitesse Sol maximale du drone en (m/s) ">
            <label className={getLabelClassName('maxSpeed')}>Vitesse maximale (m/s) *</label>
          </Tooltip>
          <input
            type="number"
            value={drone.maxSpeed}
            step="0.1"
            min={0}
            onChange={(e) => onChange({ ...drone, maxSpeed: parseFloat(e.target.value) })}
            className={getInputClassName('maxSpeed')}
          />
        </div>

        <h3 className="text-lg font-medium">Masses Caractéristiques</h3>
        <div> &nbsp;</div>
        <div>
          <Tooltip text="Masse Maximale au décolage MTOM (kg) ">
            <label className={getLabelClassName('MTOW')}>MTOM (kg) *</label>
          </Tooltip>
          <input
            type="number"
            value={drone.MTOW}
            min={0}
            step="0.1"
            onChange={(e) => onChange({ ...drone, MTOW: parseFloat(e.target.value) })}
            className={getInputClassName('MTOW')}
          />
        </div>

      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium">Limitations environnementales</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Tooltip text="Vitesse ne pouvant excéder la vitesse maximale du drone ">
              <label className={getLabelClassName('maxWindSpeedTakeoff')}>
                Vitesse maximale du vent au décollage (m/s) *
              </label>
            </Tooltip>

            <input
              type="number"
              value={drone.environmentalLimitations.maxWindSpeedTakeoff}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  maxWindSpeedTakeoff: parseFloat(e.target.value)
                }
              })}
              min={0}
              max={drone.maxSpeed}
              className={getInputClassName('maxWindSpeedTakeoff')}
            />
          </div>




          <div>
            <Tooltip text="Vitesse ne pouvant excéder la vitesse maximale du drone  et ne pouvant être inférieure à la vitesse maximale du vent au décollage">
              <label className={getLabelClassName('maxGustSpeed')}>
                Vitesse maximale de tenue à la rafale en évolution (m/s) *
              </label>
            </Tooltip>
            <input
              type="number"
              value={drone.environmentalLimitations.maxGustSpeed}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  maxGustSpeed: parseFloat(e.target.value)
                }
              })}
              min={drone.environmentalLimitations.maxWindSpeedTakeoff}
              max={drone.maxSpeed}
              className={getInputClassName('maxGustSpeed')}
            />
          </div>

          <div>
            <Tooltip text="Température minimale pour l'opération du drone">
              <label className={getLabelClassName('minTemperature')}>Température [Min] (°C) *</label>
            </Tooltip>
            <input
              type="number"
              value={drone.environmentalLimitations.minTemperature}
              min={-100}
              max={25}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  minTemperature: parseFloat(e.target.value)
                }
              })}
              className={getInputClassName('minTemperature')}
            />
          </div>

          <div>
            <Tooltip text="Température maximale pour l'opération du drone">
              <label className={getLabelClassName('maxTemperature')}>Température [Max] (°C) *</label>
            </Tooltip>
            <input
              type="number"
              value={drone.environmentalLimitations.maxTemperature}
              min={-100}
              max={100}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  maxTemperature: parseFloat(e.target.value)
                }
              })}
              className={getInputClassName('maxTemperature')}
            />
          </div>

          <div>
            <Tooltip text="Visibilité minimale pour l'opération du drone exprimée en mètres">
              <label className={getLabelClassName('visibility')}>Visibilité [m]*</label>
            </Tooltip>
            <input
              type="number"
              value={drone.environmentalLimitations.visibility}
              min={0}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  visibility: parseFloat(e.target.value)
                }
              })}
              className={getInputClassName('visibility')}
            />
          </div>



          <div className="md:col-span-2">
            <Tooltip text="Autres limitations environnementales inscrites au manuel de l'UAS">
              <label className="block text-sm font-medium text-gray-700">Autres limitations</label>
            </Tooltip>
            <textarea
              value={drone.environmentalLimitations.otherLimitations}
              onChange={(e) => onChange({
                ...drone,
                environmentalLimitations: {
                  ...drone.environmentalLimitations,
                  otherLimitations: e.target.value
                }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>


      <div className="space-y-6">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowTechnicalRequirements(!showTechnicalRequirements)}>
          <h3 className="text-lg font-medium">Exigences techniques supplémentaires (Optionel)</h3>
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {showTechnicalRequirements ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {showTechnicalRequirements && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Matériaux utilisés</label>
              <textarea
                value={drone.materials}
                onChange={(e) => onChange({ ...drone, materials: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description des charges utiles avec les masses associées en (kg)
              </label>
              <textarea
                value={drone.payloads}
                onChange={(e) => onChange({ ...drone, payloads: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <Tooltip text={
                <div>
                  text="Type de propulsion et moteur utilisés :
                  <br />
                  <li>Electrique</li>
                  <li>Combustion</li>
                  <li>Hybride, préciser le type</li>
                  <li>Autre, veuillez préciser</li>
                </div>
              }>
                <label className="block text-sm font-medium text-gray-700">Type de propulsion/moteur</label>
              </Tooltip>
              <textarea
                value={drone.propulsionType}
                onChange={(e) => onChange({ ...drone, propulsionType: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Type de carburant</label>
              <textarea
                value={drone.fuelType}
                onChange={(e) => onChange({ ...drone, fuelType: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Modifications apportées au modèle de référence
              </label>
              <textarea
                value={drone.modifications}
                onChange={(e) => onChange({ ...drone, modifications: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Station de contrôle au sol, logiciels et fréquences utilisés
              </label>
              <textarea
                value={drone.groundStation}
                onChange={(e) => onChange({ ...drone, groundStation: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Moyens de localisation</label>
              <textarea
                value={drone.locationMeans}
                onChange={(e) => onChange({ ...drone, locationMeans: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Tooltip text="Vitesse minimale (m/s) : 0 pour un drone VTOL / vitesse de décrochage pour un drone Avion">
                <label className="block text-sm font-medium text-gray-700">Vitesse minimale (m/s)</label>
              </Tooltip>
              <input
                type="number"
                value={drone.minSpeed}
                step="0.1"
                min={0}
                onChange={(e) => onChange({ ...drone, minSpeed: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de montée maximal (m/s)</label>
              <input
                type="number"
                value={drone.maxClimbRate}
                onChange={(e) => onChange({ ...drone, maxClimbRate: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de descente maximal (m/s)</label>
              <input
                type="number"
                value={drone.maxDescentRate}
                onChange={(e) => onChange({ ...drone, maxDescentRate: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taux de virage (deg/s)</label>
              <input
                type="number"
                value={drone.turnRate}
                onChange={(e) => onChange({ ...drone, turnRate: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Endurance maximale (h)</label>
              <input
                type="number"
                value={drone.maxEndurance}
                onChange={(e) => onChange({ ...drone, maxEndurance: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre d'hélices</label>
              <input
                type="number"
                value={drone.propellerCount}
                onChange={(e) => onChange({ ...drone, propellerCount: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Énergie cinétique</label>
              <input
                type="number"
                value={drone.kineticEnergy}
                onChange={(e) => onChange({ ...drone, kineticEnergy: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Indice de Protection (IP)</label>
              <input
                type="text"
                value={drone.environmentalLimitations.ipRating}
                onChange={(e) => onChange({
                  ...drone,
                  environmentalLimitations: {
                    ...drone.environmentalLimitations,
                    ipRating: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
