import * as XLSX from 'xlsx';
import { SoraForm } from '../types/sora';

export const exportToExcel = (data: SoraForm) => {
  const workbook = XLSX.utils.book_new();

  // Feuille Informations Exploitant
  const operatorSheet = [
    ['Informations sur l\'exploitant'],
    [''],
    ['Informations générales'],
    ['Nom', data.operator.name],
    ['Numéro d\'enregistrement', data.operator.registrationNumber],
    ['Gestionnaire responsable', data.operator.managerName],
    ['Contact opérationnel', data.operator.operationalContact],
    ['Adresse', data.operator.address],
    ['Téléphone', data.operator.phone],
    ['Email', data.operator.email],
    [''],
    ['Période d\'opération'],
    ['Date de début', data.operator.startDate || 'Non spécifiée'],
    ['Date de fin', data.operator.endDate || 'Non spécifiée'],
    ['Lieux prévus', data.operator.locations || 'Non spécifiés'],
    ['Version SORA', data.operator.riskAssessmentVersion || 'SORA 2.5']
  ];

  // Feuille Informations Drone
  const droneSheet = [
    ['Informations sur le drone'],
    [''],
    ['Informations générales'],
    ['Fabricant', data.drone.manufacturer],
    ['Modèle', data.drone.model],
    ['Type d\'UAS', data.drone.uasType],
    ['Numéro de série', data.drone.serialNumber],
    ['Numéro de Certificat de Type', data.drone.typeCertificateNumber],
    ['Numéro de Certificat de Navigabilité', data.drone.airworthinessCertificateNumber],
    ['Numéro de Certificat Acoustique', data.drone.acousticCertificateNumber],
    ['Classe', data.drone.classIdentification || 'Non spécifiée'],
    [''],
    ['Caractéristiques techniques'],
    ['Dimensions maximales (m)', data.drone.maxCharacteristicDimension],
    ['Vitesse minimale (m/s)', data.drone.minSpeed],
    ['Vitesse maximale (m/s)', data.drone.maxSpeed],
    ['Taux de montée maximal (m/s)', data.drone.maxClimbRate],
    ['Taux de descente maximal (m/s)', data.drone.maxDescentRate],
    ['Taux de virage (deg/s)', data.drone.turnRate],
    ['Endurance maximale (h)', data.drone.maxEndurance],
    ['Nombre d\'hélices', data.drone.propellerCount],
    ['Énergie cinétique', data.drone.kineticEnergy],
    [''],
    ['Dimensions'],
    ['Longueur (m)', data.drone.dimensions.length],
    ['Largeur (m)', data.drone.dimensions.width],
    ['Hauteur (m)', data.drone.dimensions.height],
    [''],
    ['Spécifications techniques'],
    ['Matériaux utilisés', data.drone.materials],
    ['Charges utiles', data.drone.payloads],
    ['Type de propulsion', data.drone.propulsionType],
    ['Type de carburant', data.drone.fuelType],
    ['Modifications', data.drone.modifications],
    ['Station de contrôle', data.drone.groundStation],
    ['Moyens de localisation', data.drone.locationMeans],
    [''],
    ['Limitations environnementales'],
    ['Vent max au décollage (m/s)', data.drone.environmentalLimitations.maxWindSpeedTakeoff],
    ['Rafale max (m/s)', data.drone.environmentalLimitations.maxGustSpeed],
    ['Température min (°C)', data.drone.environmentalLimitations.minTemperature],
    ['Température max (°C)', data.drone.environmentalLimitations.maxTemperature],
    ['Visibilité', data.drone.environmentalLimitations.visibility],
    ['Indice IP', data.drone.environmentalLimitations.ipRating],
    ['Autres limitations', data.drone.environmentalLimitations.otherLimitations]
  ];

  // Feuille Opération
  const operationSheet = [
    ['Informations sur l\'opération'],
    [''],
    ['Paramètres généraux'],
    ['Type d\'opération', data.operation.operationType],
    ['Nombre d\'observateurs visuels', data.operation.visualObserversCount],
    ['Transport de marchandises dangereuses', data.operation.dangerousGoods],
    ['Hauteur maximale (m)', data.operation.maxOperationHeight],
    ['Période', data.operation.dayNightOperation],
    ['Heure de début', data.operation.operationStartTime],
    ['Heure de fin', data.operation.operationEndTime],
    [''],
    ['Paramètres opérationnels'],
    ['Distance max du télépilote (m)', data.operation.maxDistanceFromPilot],
    ['Niveau de confinement', data.operation.confinementLevel],
    ['Compétence du télépilote', data.operation.pilotCompetency],
    ['Compétence du personnel', data.operation.otherPersonnelCompetency],
    ['Événements à signaler', data.operation.reportableEvents]
  ];

  // Feuille Évaluation des risques
  const riskAssessmentSheet = [
    ['Évaluation des risques'],
    [''],
    ['Configuration'],
    ['Type de hauteur de vol', data.riskAssessment.assessmentTypeHauteurVol],
    ['Surface critique', data.riskAssessment.assessmentCriticalArea],
    ['Valeur de la surface critique (m²)', data.riskAssessment.CriticalArea],
    ['Hauteur en suivi de terrain (m)', data.riskAssessment.followTerrainHeight],
    ['Modulation de la densité de population', data.riskAssessment.PopulationDensityModulation],
    ['Heure de début', data.riskAssessment.assessmentStartTime],
    [''],
    ['Résultats'],
    ['Risque sol intrinsèque', data.riskAssessment.intrinsicGroundRisk],
    ['Risque sol final', data.riskAssessment.finalGroundRisk],
    ['Risque air', data.riskAssessment.airRisk],
    ['Niveau SAIL', data.riskAssessment.sailLevel]
  ];

  // Feuille Mesures d'atténuation
  const mitigationSheet = [
    ['Mesures d\'atténuation'],
    [''],
    ['ID', 'Mesure', 'Description', 'Implémentée', 'Niveau de robustesse'],
    ...data.mitigationMeasures.map(m => [
      m.id,
      m.name,
      m.description,
      m.implemented ? 'Oui' : 'Non',
      m.robustnessLevel
    ])
  ];

  // Feuille OSO
  const osoSheet = [
    ['Objectifs de Sécurité Opérationnelle'],
    [''],
    ['Numéro', 'Description', 'Niveau requis', 'Niveau atteint', 'Justification'],
    ...data.osos.map(o => [
      o.number,
      o.description,
      o.requiredLevel,
      o.status,
      o.evidence
    ])
  ];

  // Ajout des feuilles au classeur
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(operatorSheet), 'Exploitant');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(droneSheet), 'Drone');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(operationSheet), 'Opération');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(riskAssessmentSheet), 'Évaluation des risques');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(mitigationSheet), 'Mesures d\'atténuation');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(osoSheet), 'OSO');

  // Génération du fichier
  XLSX.writeFile(workbook, 'dossier-sora.xlsx');
};
