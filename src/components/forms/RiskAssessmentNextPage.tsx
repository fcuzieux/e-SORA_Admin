import React from 'react';
import { RiskAssessmentInfo } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { useStudyContext } from '../../contexts/StudyContext';

interface RiskAssessmentNextPageProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function RiskAssessmentNextPage({
  assessment,
  onChange,
}: RiskAssessmentNextPageProps) {
  const { formData, setFormData } = useStudyContext();

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      riskAssessment: {
        ...formData.riskAssessment,
        mitigationStrategique: value,
      },
    });
    onChange({
      ...assessment,
      mitigationStrategique: value,
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Mitigation Stratégique</h2>

      <section className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M1.">
              <label className="block text-sm font-medium text-gray-700">
                Mitigation Stratégique
              </label>
            </Tooltip>
            <select
              value={formData.riskAssessment.mitigationStrategique}
              onChange={(e) => handleChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Non">Non</option>
              <option value="Oui, faible">Oui, faible</option>
              <option value="Oui, moyenne">Oui, moyenne</option>
              <option value="Oui, élevée">Oui, élevée</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
