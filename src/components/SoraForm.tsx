import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Step } from '../types/navigation';
import { STEPS } from '../data/steps';
// import { exportToExcel } from '../utils/excelExport';
import { exportToWord } from '../utils/excelExport';
import { OperatorForm } from './forms/OperatorForm';
import { DroneForm } from './forms/DroneForm';
import { OperationForm } from './forms/OperationForm';
//import { MitigationForm } from './forms/MitigationForm';
import { OsoForm } from './forms/OsoForm';
import { GroundRiskInitial } from './forms/GroundRiskInitial';
import { GroundRiskAttenuation } from './forms/GroundRiskAttenuation';
import { DeterminationARCInitial } from './forms/DeterminationARCInitial';
import { DeterminationARCFinal } from './forms/DeterminationARCFinal';
import { TacticalMitigation } from './forms/TacticalMitigation';
import { AdjacentAreas } from './forms/AdjacentAreas';
import { Sail } from './forms/Sail';
import { SummaryView } from './forms/SummaryView';
import { SaveButton } from './SaveButton';
import { HomeButton } from './HomeButton';
import { useStudyContext } from '../contexts/StudyContext';
import { generate } from '../utils/excelExport';

export function SoraForm() {
  const { formData, setFormData } = useStudyContext();
  const [currentStep, setCurrentStep] = useState<Step>('operator-info');

  // Synchroniser l'heure de démarrage entre l'opération et l'évaluation des risques
  useEffect(() => {
    if (formData.operation?.operationStartTime !== formData.riskAssessment?.assessmentStartTime) {
      setFormData({
        ...formData,
        riskAssessment: {
          ...formData.riskAssessment,
          assessmentStartTime: formData.operation?.operationStartTime || ''
        }
      });
    }
  }, [formData.operation?.operationStartTime]);

  const isOperatorInfoValid = () => {
    const { operator } = formData;
    return (
      operator.name.trim() !== '' &&
      operator.registrationNumber.trim() !== '' &&
      operator.managerName.trim() !== '' &&
      operator.operationalContact.trim() !== '' &&
      operator.address.trim() !== '' &&
      operator.phone.trim() !== '' &&
      operator.email.trim() !== ''
    );
  };

  const currentStepInfo = STEPS.find(step => step.id === currentStep)!;

  const handleNext = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'operator-info':
        return (
          <OperatorForm
            operator={formData.operator}
            onChange={(operator) => setFormData({ ...formData, operator })}
          />
        );
      case 'conops':
        return (
          <div className="space-y-8">
            <DroneForm
              drone={formData.drone}
              onChange={(drone) => { 
                setFormData({
                  ...formData,
                  drone,
                  riskAssessment: {
                    ...formData.riskAssessment,
                    maxCharacteristicDimension: drone.maxCharacteristicDimension,
                    VCruise: drone.VCruise,
                    CruiseSpeed: drone.CruiseSpeed,
                    maxSpeed: drone.maxSpeed,
                    minSpeed: drone.minSpeed,
                    uasType: drone.uasType,
                    turnRate: drone.turnRate,
                    MTOW: drone.MTOW,
                    environmentalLimitations: drone.environmentalLimitations,
                  }
                });
              }}
            />
            <hr className="border-gray-200 my-8" />
            <OperationForm
              operation={formData.operation}
              onChange={(operation) => {
                setFormData({
                  ...formData,
                  operation,
                  riskAssessment: {
                    ...formData.riskAssessment,
                    assessmentStartTime: operation.operationStartTime
                  }
                });
              }}
            />
          </div>
        );
      case 'initial-grc':
      return (
        <GroundRiskInitial
          assessment={formData.riskAssessment}
          onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          showOnly={['intrinsicGroundRisk']}
        />
      );
      case 'final-grc':
        return (
          <GroundRiskAttenuation
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'initial-arc':
        return (
          <DeterminationARCInitial
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'final-arc':
        return (
          <DeterminationARCFinal
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'tactical-mitigation':
        return (
          <TacticalMitigation
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'sail':
        return (
          <Sail
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'oso':
        return (
          <OsoForm
            osos={formData.osos}
            assessment={formData.riskAssessment}
            onChange={(osos) => setFormData({ ...formData, osos })}
          />
        );
      case 'adjacent-areas':
        return (
          <AdjacentAreas
            assessment={formData.riskAssessment}
            onChange={(riskAssessment) => setFormData({ ...formData, riskAssessment })}
          />
        );
      case 'summary':
        return <SummaryView formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <HomeButton />

      <div className="text-center">
        <div className="flex justify-between mt-8">
          {currentStep !== 'operator-info' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          )}

          {currentStep === 'operator-info' ? (
            <button
              onClick={handleNext}
              disabled={!isOperatorInfoValid()}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : currentStep === 'oso' ? (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le résumé
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : currentStep === 'summary' ? (
            <button
              // onClick={() => exportToExcel(formData)}
              onClick={() => generate(formData)}
              className="ml-auto flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Télécharger le dossier SORA
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900"><br></br>{currentStepInfo.title}</h1>
        <h2 className="text-lg text-gray-600 mt-2">{currentStepInfo.subtitle}</h2>
        <p className="mt-2 text-gray-600">
          {currentStepInfo.description}
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        
        {renderStepContent()}

        <div className="flex justify-between mt-8">
          {currentStep !== 'operator-info' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          )}

          {currentStep === 'operator-info' ? (
            <button
              onClick={handleNext}
              disabled={!isOperatorInfoValid()}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : currentStep === 'oso' ? (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le résumé
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : currentStep === 'summary' ? (
            <button
              // onClick={() => exportToExcel(formData)}
              onClick={() => generate(formData)}
              className="ml-auto flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Télécharger le dossier SORA
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <SaveButton />
    </div>
  );
}
