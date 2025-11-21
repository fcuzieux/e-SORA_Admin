export type DroneClass = 'Sans' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'Prototype';

export type SailLevel =
  | 'SAIL 1'
  | 'SAIL 2'
  | 'SAIL 3'
  | 'SAIL 4'
  | 'SAIL 5'
  | 'SAIL 6'
  | 'Certifié';

export type UasType =
  | 'Avion'
  | 'Hélicoptère'
  | 'Multirotor'
  | 'Hybride/VTOL'
  | "Plus léger que l'air"
  | 'Autre';
export type OperationType =
  | 'VLOS – Vol en vue'
  | 'EVLOS – Vol en vue Etendue'
  | 'BVLOS – Vol hors vue';
export type DangerousGoods = 'OUI' | 'NON';
export type PopulationDensityModulation = 'OUI' | 'NON';
export type PopulationDensityDataBase = 'INSEE_Filosofi2019_200m' | 'GHS_POP_E2025_GLOBE_R2023A_54009_100_V1_0_dens';
export type ObstaclesModulation = 'OUI' | 'NON';
export type GlidingCapability = 'OUI' | 'NON';
export type HighImpactAngle = 'OUI' | 'NON';
export type DetailedJarusModel = 'OUI' | 'NON';
export type necessaryToReduceRisk = 'OUI' | 'NON';
export type DayNightOperation = 'Jour' | 'Nuit' | 'Jour & Nuit';
export type ConfinementLevel = 'Basic' | 'Enhanced';
export type mitigationStrategique = 'Non' | 'Oui, faible' | 'Oui, moyenne' | 'Oui, élevée';

export type planInterventionUrgence = 'Non' | 'Oui, faible' | 'Oui, moyenne' | 'Oui, élevée';
export type reduceImpactAttenuation = 'Non' | 'Oui, faible' | 'Oui, moyenne' | 'Oui, élevée';
export type OperationalVolumeLevel = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type AdjacentVolumeLevel = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type OperationalScenario = 'VLOS' | 'BVLOS';
export type PopulationDensity = 'Zone Contrôlée' | '<5' | '<50' | '<500' | '<5,000' | '<50,000' | '>50,000' ;
export type airspaceClasses = 'Classe A' | 'Classe B' | 'Classe C' | 'Classe D' | 'Classe E' | 'Classe F' | 'Classe G' | 'U-Space' | 'Autre | Préciser';
export type ContingencyParachuteManeuver = 'OUI' | 'NON';
export type AirCollisionRiskMap = 'OUI' | 'NON';
export type UsemaxCharacteristicDimension = 'OUI' | 'NON';
export type AdjacentVolumeWidthEqualMaxRange = 'OUI' | 'NON';
export type GRB_FixedWingPowerOff = 'ACTIVATED' | 'NONACTIVE';
export type StrategicMitigationOperationalRestrictionsAvailable = 'OUI' | 'NON';
export type StrategicMitigationCommonStructuresAvailable = 'OUI' | 'NON';
export type OutdoorAssembliesAllowed = '> 400k' | 'Assemblies of 40k to 400k' | 'Assemblies < 40k people';
export type ShelterApplicable = 'OUI' | 'NON';
export type OperationalVolumeLevelMitigated = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type TacticalMitigationAvailable = 'OUI' | 'NON';
export type assessmentTypeHauteurVol =
  | 'Hauteur de vol suivant trajectoire(s)'
  | 'Hauteur de vol en suivi de terrain';
export type iGRC = '1' | '2' | '3' | '4' | '5' | '6' | '7'| '8';
export type GRC_Final = '1' | '2' | '3' | '4' | '5' | '6' | '7'| '8';
export type assessmentCriticalArea =
  | 'Calcul selon les Modèles JARUS'
  | 'Spécifiée par le déposant';
export type assessmentiGRC =  
  | 'Calcul selon les tables SORA'
  | 'Calcul DROSERA'
  | 'Spécifiée par le déposant';
export type assessmentGRB =
  | 'Approche Simplifiée, Règle 1:1'
  | 'Approche Balistique (Hélicoptère ou Multirotor)'
  | 'Terminaison Aile Fixe'
  | 'Terminaison avec parachute'
  | 'Spécifiée par le déposant';
export type assessmentContingencyVolume =
  | 'Spécifiée par le déposant'
  | 'Calcul selon le Guide';

export type OsoRobustnessLevel = 'Non Requis' | 'Faible' | 'Moyen' | 'Élevé';
export interface DroneDimensions {
  length: number;
  width: number;
  height: number;
}

export interface EnvironmentalLimitations {
  maxWindSpeedTakeoff: number;
  maxGustSpeed: number;
  minTemperature: number;
  maxTemperature: number;
  visibility: number;
  ipRating: string;
  otherLimitations: string;
}

export interface DroneInfo {
  manufacturer: string;
  model: string;
  uasType: UasType;
  serialNumber: string;
  typeCertificateNumber: string;
  airworthinessCertificateNumber: string;
  acousticCertificateNumber: string;
  technicalDocuments: File[];
  MTOW: number;
  CruiseSpeed: number;
  VCruise: number;
  maxSpeed: number;
  minSpeed: number;
  maxCharacteristicDimension: number;
  classIdentification: DroneClass | null;
  dimensions: DroneDimensions;
  materials: string;
  payloads: string;
  propulsionType: string;
  fuelType: string;
  modifications: string;
  groundStation: string;
  locationMeans: string;
  maxClimbRate: number;
  maxDescentRate: number;
  turnRate: number;
  maxEndurance: number;
  propellerCount: number;
  kineticEnergy: number;
  environmentalLimitations: EnvironmentalLimitations;
}

export interface OperationInfo {
  adjacentAreaExtent: number;
  operationType: OperationType;
  visualObserversCount: number;
  dangerousGoods: DangerousGoods;
  maxOperationHeight: number;
  dayNightOperation: DayNightOperation;
  operationStartTime: string;
  operationEndTime: string;
  maxDistanceFromPilot: number;
  confinementLevel: ConfinementLevel;
  pilotCompetency: string;
  otherPersonnelCompetency: string;
  reportableEvents: string;
  geoFiles: File[];
}

export interface RiskAssessmentInfo {
  droseraOutputResult: string;
  DroseraResTable: number[];
  assessmentTypeHauteurVol: assessmentTypeHauteurVol;
  assessmentCriticalArea: assessmentCriticalArea;
  assessmentContingencyVolume: assessmentContingencyVolume;
  assessmentiGRC: assessmentiGRC;
  iGRCNumber: number;
  iGRC_Justification: string;
  iGRCadjacentArea: string;
  followTerrainHeight: number;
  PopulationDensityModulation: PopulationDensityModulation;
  PopulationDensityDataBase: PopulationDensityDataBase;
  PopulationDensityDataBaseNumber: number;
  assessmentStartTime: string;
  CriticalArea: number;
  NominalCriticalArea: number;
  ThresholdCriticalArea: number;
  ContingencyVolume: number;
  maxDistanceFromPilot: number;
  confinementLevel: ConfinementLevel;
  pilotCompetency: string;
  otherPersonnelCompetency: string;
  reportableEvents: string;
  intrinsicGroundRisk?: number;
  finalGroundRisk?: number;
  airRisk?: number;
  sailLevel?: string;
  trajgeoFiles: File[];
  droseraOutputFile: File[];
  mitigationStrategiqueM1A: mitigationStrategique;
  mitigationStrategiqueM1B: mitigationStrategique;
  mitigationTactiqueM1C: mitigationStrategique;
  reduceImpactAttenuationM2: reduceImpactAttenuation;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
  operationalScenario?: OperationalScenario;
  populationDensity?: PopulationDensity;
  populationDensityAdjacentArea?: PopulationDensity;
  necessaryToReduceRisk: necessaryToReduceRisk
  planInterventionUrgence: planInterventionUrgence;
  confinementRequirements: 'Basiques' | 'Amélioré';
  additionalRemarks?: string;
  M1A_Justification: string;
  M1B_Justification: string;
  M1C_Justification: string;
  M2_Justification: string;
  airspaceClasses: airspaceClasses;
  uspaceProvider: string;
  otherDetails: string;
  StrategicMitigationOperationalRestrictionsAvailable: StrategicMitigationOperationalRestrictionsAvailable;
  StrategicMitigationOperationalRestrictionsJustification: string;
  StrategicMitigationCommonStructuresAvailable: StrategicMitigationCommonStructuresAvailable;
  StrategicMitigationCommonStructuresJustification: string;
  OperationalVolumeLevelMitigated: OperationalVolumeLevelMitigated;
  TacticalMitigationAvailable: TacticalMitigationAvailable;
  TacticalMitigationJustification: string;
  iGRC: string;
  GRC_Final: string;
  SAILJustification: string;
  iGRCcomputation: number;
  SAIL: SailLevel;
  SAILNumber: number;
  maxCharacteristicDimension: number;
  VCruise: number;
  CruiseSpeed: number;
  maxSpeed: number;
  minSpeed: number;
  ObstaclesModulation: ObstaclesModulation;
  GlidingCapability: GlidingCapability;
  HighImpactAngle:HighImpactAngle;
  dGlide: number;
  dSlideReduced: number;
  vhorizontale: number;
  vnonlethal: number;
  tsafe: number;
  DetailedJarusModel:DetailedJarusModel;
  ThetaGlide: number;
  MTOW: number;
  Theta_Glide_Justification: string;
  UserCriticalArea_Justification: string;
  FlightGeographyWidth: number;
  FlightGeographyHeight: number;
  FlightGeography_Justification: string; 
  ContingencyVolumeWidth: number;
  ContingencyVolumeHeight: number;
  ContingencyVolume_Justification: string; 
  PopulationDensity_Justification: string;
  ContingencyVolumeSGPS: number;
  ContingencyVolumeSpos: number;
  ContingencyVolumeSK: number;
  ContingencyVolumeSRZ: number;
  ContingencyTimeRZ: number;
  ContingencyVolumeParachute: boolean;
  ContingencyVolumeSCM: number;
  ContingencyParachuteManeuver:ContingencyParachuteManeuver;
  UsemaxCharacteristicDimension:UsemaxCharacteristicDimension;
  AdjacentVolumeWidthEqualMaxRange:AdjacentVolumeWidthEqualMaxRange;
  ParachuteTime: number;
  VzParachute: number;
  VwindParachute: number;
  VzandVwindParachute_Justification: string;
  uasType: UasType;
  ThetaStopCopter: number;
  PhiMaxPlane: number;
  turnRate: number;
  ContingencyVolumeHbaro: number;
  ContingencyVolumeHRZ: number;
  ContingencyVolumeHCM: number;
  assessmentGRB:assessmentGRB;
  GRB: number;
  AdjacentVolumeWidth: number;
  AdjacentVolumeHeight: number;
  GRBWidth: number;
  GRB_Justification: string;
  GRB_FixedWingPowerOff:GRB_FixedWingPowerOff;
  environmentalLimitations: EnvironmentalLimitations;
  MinOperationalAltitude: number;
  ThetaImpact: number;
  AdjacentVolume_Justification: string;
  maxCharacteristicDimensionClass: number;
  iGRC_colIndex: number;
  iGRCControledZone: number;
  AirCollisionRiskMap: AirCollisionRiskMap;
  AirCollisionRiskMapJustification: string;
  IGDR: number;
  AEC: string;
  ARCI: string;
  OpsEnv: string;
  OutdoorAssembliesAllowed:OutdoorAssembliesAllowed;
  ShelterApplicable:ShelterApplicable;
  OSOS_Levels: OsoRobustnessLevel[];
}


export interface SailInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface AdjacentAreasInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface DeterminationARCInitialInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface OperatorInfo {
  name: string;
  managerName: string;
  operationalContact: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  startDate?: string;
  endDate?: string;
  locations?: string;
  riskAssessmentVersion?: string;
}


export interface MitigationMeasure {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  robustnessLevel: OsoRobustnessLevel;
}

export interface Oso {
  id: string;
  number: string;
  description: string;
  requiredLevel: OsoRobustnessLevel;
  status: OsoRobustnessLevel;
  evidence: string;
  tooltip: string;
}

export interface RiskAssessment {
  intrinsicGroundRisk: number;
  finalGroundRisk: number;
  airRisk: number;
  sailLevel: string;
}

export interface SoraForm {
  operator: OperatorInfo;
  drone: DroneInfo;
  operation: OperationInfo;
  mitigationMeasures: MitigationMeasure[];
  osos: Oso[];
  riskAssessment: RiskAssessmentInfo;
}
