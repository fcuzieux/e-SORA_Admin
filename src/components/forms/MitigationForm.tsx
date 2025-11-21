import React from 'react';
import { MitigationMeasure } from '../../types/sora';
import { MitigationMeasureCard } from './MitigationMeasureCard';
import { Shield } from 'lucide-react';

interface MitigationFormProps {
  measures: MitigationMeasure[];
  onChange: (measures: MitigationMeasure[]) => void;
}

export function MitigationForm({ measures, onChange }: MitigationFormProps) {
  const handleMeasureChange = (index: number, updates: Partial<MitigationMeasure>) => {
    const updatedMeasures = measures.map((measure, i) => 
      i === index ? { ...measure, ...updates } : measure
    );
    onChange(updatedMeasures);
  };

  const implementedCount = measures.filter(m => m.implemented).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          Mesures d'atténuation
        </h2>
        
        <div className="text-sm text-gray-600">
          {implementedCount} sur {measures.length} mesures implémentées
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {measures.map((measure, index) => (
          <MitigationMeasureCard
            key={measure.id}
            measure={measure}
            onChange={(updates) => handleMeasureChange(index, updates)}
          />
        ))}
      </div>
    </div>
  );
}
