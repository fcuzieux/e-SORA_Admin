import { createReport } from 'docx-templates';
import { SoraForm } from '../types/sora';
import ModeltemplateFile from '../ressources/Modele_SORA.docx?url';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';



function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

export const generate = async (data: SoraForm) => {
 const databuffer = {
    FILENUMBER : 'FRA-CEDF-2025-0001',
    submission_date : new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    submission_version: '1.0',
    operatorName: data.operator.name,
    operatorRegistrationNumber: data.operator.registrationNumber,
    operatorManagerName: data.operator.managerName,
    operatorOperationalContact: data.operator.operationalContact,
    operatorAddress: data.operator.address,
    operatorPhone: data.operator.phone,
    operatorEmail: data.operator.email,    
    operatorStartDate: data.operator.startDate || 'Non spécifiée',
    operatorEndDate: data.operator.endDate || 'Non spécifiée',
    operatorLocations: data.operator.locations || 'Non spécifiés',
    operatorRiskAssessmentVersion: data.operator.riskAssessmentVersion || 'SORA 2.5',
    droneManufacturer: data.drone.manufacturer,
    droneModel: data.drone.model,
    droneUasType: data.drone.uasType,
    droneSerialNumber: data.drone.serialNumber,
    droneTypeCertificateNumber: data.drone.typeCertificateNumber,
    droneAirworthinessCertificateNumber: data.drone.airworthinessCertificateNumber,
    droneAcousticCertificateNumber: data.drone.acousticCertificateNumber,
    droneClassIdentification: data.drone.classIdentification || 'Non spécifiée',
    droneMaxCharacteristicDimension: data.drone.maxCharacteristicDimension,
    droneMinSpeed: data.drone.minSpeed,
    droneMaxSpeed: data.drone.maxSpeed,
    droneMaxClimbRate: data.drone.maxClimbRate,
    droneMaxDescentRate: data.drone.maxDescentRate,
    droneTurnRate: data.drone.turnRate,
    droneMaxEndurance: data.drone.maxEndurance,
    dronePropellerCount: data.drone.propellerCount,
    droneKineticEnergy: data.drone.kineticEnergy,
    droneDimensionsLength: data.drone.dimensions.length,
    droneDimensionsWidth: data.drone.dimensions.width,
    droneDimensionsHeight: data.drone.dimensions.height,
    droneMaterials: data.drone.materials,
    dronePayloads: data.drone.payloads,
    dronePropulsionType: data.drone.propulsionType,
    droneFuelType: data.drone.fuelType,
    droneModifications: data.drone.modifications,
    droneGroundStation: data.drone.groundStation,
    droneLocationMeans: data.drone.locationMeans,
    droneMaxWindSpeedTakeoff: data.drone.environmentalLimitations.maxWindSpeedTakeoff,
    droneMaxGustSpeed: data.drone.environmentalLimitations.maxGustSpeed,
    droneMinTemperature: data.drone.environmentalLimitations.minTemperature,
    droneMaxTemperature: data.drone.environmentalLimitations.maxTemperature,
    droneVisibility: data.drone.environmentalLimitations.visibility,
    droneIpRating: data.drone.environmentalLimitations.ipRating,
    droneOtherLimitations: data.drone.environmentalLimitations.otherLimitations,
    operationOperationType: data.operation.operationType,
    operationVisualObserversCount: data.operation.visualObserversCount,
    operationDangerousGoods: data.operation.dangerousGoods,
    operationMaxOperationHeight: data.operation.maxOperationHeight,
    operationDayNightOperation: data.operation.dayNightOperation,
    operationOperationStartTime: data.operation.operationStartTime,
    operationOperationEndTime: data.operation.operationEndTime,
    operationMaxDistanceFromPilot: data.operation.maxDistanceFromPilot,
    operationConfinementLevel: data.operation.confinementLevel,
    operationPilotCompetency: data.operation.pilotCompetency,
    operationOtherPersonnelCompetency: data.operation.otherPersonnelCompetency,
    operationReportableEvents: data.operation.reportableEvents,
    riskAssessmentAssessmentTypeHauteurVol: data.riskAssessment.assessmentTypeHauteurVol,
    riskAssessmentAssessmentCriticalArea: data.riskAssessment.assessmentCriticalArea,
    riskAssessmentCriticalAreaValue: data.riskAssessment.CriticalArea,
    riskAssessmentFollowTerrainHeight: data.riskAssessment.followTerrainHeight,
    riskAssessmentPopulationDensityModulation: data.riskAssessment.PopulationDensityModulation,
    riskAssessmentAssessmentStartTime: data.riskAssessment.assessmentStartTime,
    riskAssessmentIntrinsicGroundRisk: data.riskAssessment.intrinsicGroundRisk,
    riskAssessmentFinalGroundRisk: data.riskAssessment.finalGroundRisk,
    riskAssessmentAirRisk: data.riskAssessment.airRisk,
    riskAssessmentSailLevel: data.riskAssessment.sailLevel,
    mitigationMeasures: data.mitigationMeasures.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      implemented: m.implemented ? 'Oui' : 'Non',
      robustnessLevel: m.robustnessLevel
    })),
    osos: data.osos.map(o => ({
      number: o.number,
      description: o.description,
      requiredLevel: o.requiredLevel,
      status: o.status,
      evidence: o.evidence
    }))
  };
  loadFile(
      // 'https://docxtemplater.com/tag-example.docx',
      ModeltemplateFile,
      function (error: Error | null, content: string) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        doc.setData(
          databuffer
        //   {
        //   FILENUMBER : 'FRA-12345',
        //   last_name: 'Doe',
        //   phone: '0652455478',
        //   description: 'New Website',
        // }
      );
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join('\n');
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        // Output the document using Data-URI
        saveAs(out, 'output.docx');
      }
    );
  }

export const exportToWord = async (data: SoraForm) => {
  // Créez un template pour le rapport
  const databuffer = {
    operatorName: data.operator.name,
    operatorRegistrationNumber: data.operator.registrationNumber,
    operatorManagerName: data.operator.managerName,
    operatorOperationalContact: data.operator.operationalContact,
    operatorAddress: data.operator.address,
    operatorPhone: data.operator.phone,
    operatorEmail: data.operator.email,
    operatorStartDate: data.operator.startDate || 'Non spécifiée',
    operatorEndDate: data.operator.endDate || 'Non spécifiée',
    operatorLocations: data.operator.locations || 'Non spécifiés',
    operatorRiskAssessmentVersion: data.operator.riskAssessmentVersion || 'SORA 2.5',
    droneManufacturer: data.drone.manufacturer,
    droneModel: data.drone.model,
    droneUasType: data.drone.uasType,
    droneSerialNumber: data.drone.serialNumber,
    droneTypeCertificateNumber: data.drone.typeCertificateNumber,
    droneAirworthinessCertificateNumber: data.drone.airworthinessCertificateNumber,
    droneAcousticCertificateNumber: data.drone.acousticCertificateNumber,
    droneClassIdentification: data.drone.classIdentification || 'Non spécifiée',
    droneMaxCharacteristicDimension: data.drone.maxCharacteristicDimension,
    droneMinSpeed: data.drone.minSpeed,
    droneMaxSpeed: data.drone.maxSpeed,
    droneMaxClimbRate: data.drone.maxClimbRate,
    droneMaxDescentRate: data.drone.maxDescentRate,
    droneTurnRate: data.drone.turnRate,
    droneMaxEndurance: data.drone.maxEndurance,
    dronePropellerCount: data.drone.propellerCount,
    droneKineticEnergy: data.drone.kineticEnergy,
    droneDimensionsLength: data.drone.dimensions.length,
    droneDimensionsWidth: data.drone.dimensions.width,
    droneDimensionsHeight: data.drone.dimensions.height,
    droneMaterials: data.drone.materials,
    dronePayloads: data.drone.payloads,
    dronePropulsionType: data.drone.propulsionType,
    droneFuelType: data.drone.fuelType,
    droneModifications: data.drone.modifications,
    droneGroundStation: data.drone.groundStation,
    droneLocationMeans: data.drone.locationMeans,
    droneMaxWindSpeedTakeoff: data.drone.environmentalLimitations.maxWindSpeedTakeoff,
    droneMaxGustSpeed: data.drone.environmentalLimitations.maxGustSpeed,
    droneMinTemperature: data.drone.environmentalLimitations.minTemperature,
    droneMaxTemperature: data.drone.environmentalLimitations.maxTemperature,
    droneVisibility: data.drone.environmentalLimitations.visibility,
    droneIpRating: data.drone.environmentalLimitations.ipRating,
    droneOtherLimitations: data.drone.environmentalLimitations.otherLimitations,
    operationOperationType: data.operation.operationType,
    operationVisualObserversCount: data.operation.visualObserversCount,
    operationDangerousGoods: data.operation.dangerousGoods,
    operationMaxOperationHeight: data.operation.maxOperationHeight,
    operationDayNightOperation: data.operation.dayNightOperation,
    operationOperationStartTime: data.operation.operationStartTime,
    operationOperationEndTime: data.operation.operationEndTime,
    operationMaxDistanceFromPilot: data.operation.maxDistanceFromPilot,
    operationConfinementLevel: data.operation.confinementLevel,
    operationPilotCompetency: data.operation.pilotCompetency,
    operationOtherPersonnelCompetency: data.operation.otherPersonnelCompetency,
    operationReportableEvents: data.operation.reportableEvents,
    riskAssessmentAssessmentTypeHauteurVol: data.riskAssessment.assessmentTypeHauteurVol,
    riskAssessmentAssessmentCriticalArea: data.riskAssessment.assessmentCriticalArea,
    riskAssessmentCriticalAreaValue: data.riskAssessment.CriticalArea,
    riskAssessmentFollowTerrainHeight: data.riskAssessment.followTerrainHeight,
    riskAssessmentPopulationDensityModulation: data.riskAssessment.PopulationDensityModulation,
    riskAssessmentAssessmentStartTime: data.riskAssessment.assessmentStartTime,
    riskAssessmentIntrinsicGroundRisk: data.riskAssessment.intrinsicGroundRisk,
    riskAssessmentFinalGroundRisk: data.riskAssessment.finalGroundRisk,
    riskAssessmentAirRisk: data.riskAssessment.airRisk,
    riskAssessmentSailLevel: data.riskAssessment.sailLevel,
    mitigationMeasures: data.mitigationMeasures.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      implemented: m.implemented ? 'Oui' : 'Non',
      robustnessLevel: m.robustnessLevel
    })),
    osos: data.osos.map(o => ({
      number: o.number,
      description: o.description,
      requiredLevel: o.requiredLevel,
      status: o.status,
      evidence: o.evidence
    }))
  };

  // Chargez le fichier de modèle depuis le répertoire public
      //const response = await fetch('../ressources/Modele_SORA.docx');
const response = await fetch('./Modele_SORA.docx');
      
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  // const arrayBuffer = await response.arrayBuffer();

  //   // Convert ArrayBuffer to Uint8Array
     const template = new Uint8Array(await response.arrayBuffer());

//const uint8Array = new Uint8Array(arrayBuffer);
  // Génération du fichier Word
  const buffer = await createReport({
    template,
    data: databuffer,
  });

  // Sauvegarde du fichier
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'dossier-soraDoc.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
