import React, { createContext, useContext, useState } from 'react';
import { SoraForm } from '../types/sora';
import { initialSoraForm } from '../data/initialData';

interface StudyContextType {
  studyId: string | null;
  setStudyId: (id: string | null) => void;
  studyName: string;
  setStudyName: (name: string) => void;
  formData: SoraForm;
  setFormData: (data: SoraForm) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [studyId, setStudyId] = useState<string | null>(null);
  const [studyName, setStudyName] = useState('');
  const [formData, setFormData] = useState<SoraForm>({
    ...initialSoraForm,
    operation: {
      ...initialSoraForm.operation,
      operationStartTime: '',
    },
    riskAssessment: {
      ...initialSoraForm.riskAssessment,
      assessmentStartTime: '',
      uasType: 'Avion',
      mitigationStrategique: '', // Add mitigationStrategique to the initial state
    },
    determinationARCInitial: {
      airspaceClasses: [],
      uspaceProvider: '',
      otherDetails: '',
      OperationalVolumeLevel: 'ARC-a',
      AdjacentVolumeLevel: 'ARC-a',
      detectAndAvoid: '',
      trafficDetection: '',
      additionalDetails: '',
    },
  });
  const [saving, setSaving] = useState(false);

  return (
    <StudyContext.Provider
      value={{
        studyId,
        setStudyId,
        studyName,
        setStudyName,
        formData,
        setFormData,
        saving,
        setSaving,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyContext() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
}
