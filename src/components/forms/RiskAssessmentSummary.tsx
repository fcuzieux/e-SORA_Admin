import React from 'react';
import { RiskAssessment } from '../../types/sora';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskAssessmentSummaryProps {
  assessment: RiskAssessment;
}

export function RiskAssessmentSummary({ assessment }: RiskAssessmentSummaryProps) {
  const getRiskLevel = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio <= 0.3) return 'low';
    if (ratio <= 0.7) return 'medium';
    return 'high';
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'high':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Résumé de l'évaluation</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          {getRiskIcon(getRiskLevel(assessment.intrinsicGroundRisk, 7))}
          <span>Risque Sol Initial: {assessment.intrinsicGroundRisk}/7</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getRiskIcon(getRiskLevel(assessment.finalGroundRisk, 7))}
          <span>Risque Sol Final: {assessment.finalGroundRisk}/7</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getRiskIcon(getRiskLevel(assessment.airRisk, 4))}
          <span>Risque Air: {assessment.airRisk}/4</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Niveau SAIL: {assessment.sailLevel}</span>
        </div>
      </div>
    </div>
  );
}
