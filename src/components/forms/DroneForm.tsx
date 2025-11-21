import React, { useRef } from 'react';
import { DroneInfo, DroneClass, UasType } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Upload } from 'lucide-react';

interface DroneFormProps {
  drone: DroneInfo;
  onChange: (drone: DroneInfo) => void;
}

const droneClasses: DroneClass[] = ['Sans', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'Prototype'];
const uasTypes: UasType[] = ['Avion', 'Hélicoptère', 'Multirotor', 'Hybride/VTOL', 'Plus léger que l\'air', 'Autre'];

export function DroneForm({ drone, onChange }: DroneFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      onChange({ ...drone, technicalDocuments: [...(drone.technicalDocuments || []), ...newFiles] });
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
          <label className="block text-sm font-medium text-gray-700">Fabricant</label>
          <input
            type="text"
            value={drone.manufacturer}
            onChange={(e) => onChange({ ...drone, manufacturer: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Modèle</label>
          <input
            type="text"
            value={drone.model}
            onChange={(e) => onChange({ ...drone, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'UAS</label>
          <select
            value={drone.uasType}
            onChange={(e) => onChange({ ...drone, uasType: e.target.value as UasType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {uasTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro de série</label>
          <input
            type="text"
            value={drone.serialNumber}
            onChange={(e) => onChange({ ...drone, serialNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos et description schématique du système UAS
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
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
                Déposer des fichiers PDF ici ou cliquer pour parcourir
              </span>
            </div>
          </div>
          {drone.technicalDocuments && drone.technicalDocuments.length > 0 && (
            <div className="mt-2 space-y-2">
              {drone.technicalDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
        </div>

        <div>
          <Tooltip  text={
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
                   
          <label className="block text-sm font-medium text-gray-700">Dimensions caractéristiques maximales (m)</label>
          </Tooltip>
          <input
            type="number"
            value={drone.maxCharacteristicDimension}
            onChange={(e) => onChange({ ...drone, maxCharacteristicDimension: parseFloat(e.target.value) })}
            step="0.1" // Ajoutez cet attribut pour définir l'incrément de l'input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Vitesse de Croisière (m/s)</label>
          <input
            type="number"
            value={drone.VCruise}
            step="0.1"
            min={0}
            onChange={(e) => onChange({ ...drone, VCruise: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div> 

        <div>
          <label className="block text-sm font-medium text-gray-700">Vitesse minimale (m/s)</label>
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
          <Tooltip text="Vitesse Sol maximale du drone en opération en (m/s) ">
            <label className="block text-sm font-medium text-gray-700">Vitesse maximale (m/s)</label>
          </Tooltip>
          <input
            type="number"
            value={drone.maxSpeed}
            step="0.1"
            min={0}
            onChange={(e) => onChange({ ...drone, maxSpeed: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <Tooltip text="Masse Maximale au décolage MTOM (kg) ">
            <label className="block text-sm font-medium text-gray-700">MTOM (kg)</label>
          </Tooltip>
          <input
            type="number"
            value={drone.MTOW}
            step="0.1"
            onChange={(e) => onChange({ ...drone, MTOW: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <Tooltip text="Si une classe est apposée sur le drone">
            <label className="block text-sm font-medium text-gray-700">Identification de Classe</label>
          </Tooltip>  
          <select
            value={drone.classIdentification || ''}
            onChange={(e) => onChange({ 
              ...drone, 
              classIdentification: e.target.value as DroneClass || null 
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner une classe</option>
            {droneClasses.map((classId) => (
              <option key={classId} value={classId}>
                Classe {classId}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Exigences techniques supplémentaires</h3>
        
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
            <Tooltip  text={
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
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Limitations environnementales</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vitesse maximale du vent au décollage (m/s)
              </label>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>




            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vitesse maximale de tenue à la rafale en évolution (m/s)
              </label>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Température [Min] (°C)</label>
              <input
                type="number"
                value={drone.environmentalLimitations.minTemperature}
                onChange={(e) => onChange({
                  ...drone,
                  environmentalLimitations: {
                    ...drone.environmentalLimitations,
                    minTemperature: parseFloat(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Température [Max] (°C)</label>
              <input
                type="number"
                value={drone.environmentalLimitations.maxTemperature}
                onChange={(e) => onChange({
                  ...drone,
                  environmentalLimitations: {
                    ...drone.environmentalLimitations,
                    maxTemperature: parseFloat(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Visibilité</label>
              <input
                type="number"
                value={drone.environmentalLimitations.visibility}
                onChange={(e) => onChange({
                  ...drone,
                  environmentalLimitations: {
                    ...drone.environmentalLimitations,
                    visibility: parseFloat(e.target.value)
                  }
                })}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Autres limitations</label>
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Longueur (m)</label>
            <input
              type="number"
              value={drone.dimensions.length}
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
              onChange={(e) => onChange({
                ...drone,
                dimensions: { ...drone.dimensions, height: parseFloat(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
