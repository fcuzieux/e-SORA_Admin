import React from 'react';
import { MitigationMeasure, OsoRobustnessLevel } from '../../types/sora';
import { Shield } from 'lucide-react';

interface MitigationMeasureCardProps {
  measure: MitigationMeasure;
  onChange: (updates: Partial<MitigationMeasure>) => void;
}

export function MitigationMeasureCard({ measure, onChange }: MitigationMeasureCardProps) {
  const robustnessColors = {
    Low: 'text-yellow-600 bg-yellow-50',
    Medium: 'text-blue-600 bg-blue-50',
    High: 'text-green-600 bg-green-50'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Shield className="w-6 h-6 text-blue-500" />
        </div>
        
        <div className="flex-grow space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{measure.name}</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${robustnessColors[measure.robustnessLevel]}`}>
              {measure.robustnessLevel}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">{measure.description}</p>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={measure.implemented}
                onChange={(e) => onChange({ implemented: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm">Implémentée</span>
            </label>
            
            <select
              value={measure.robustnessLevel}
              onChange={(e) => onChange({ 
                robustnessLevel: e.target.value as OsoRobustnessLevel 
              })}
              className="text-sm rounded-md border-gray-300"
            >
              <option value="Low">Faible</option>
              <option value="Medium">Moyen</option>
              <option value="High">Élevé</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
