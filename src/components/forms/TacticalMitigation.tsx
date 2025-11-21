import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, TacticalMitigationAvailable } from '../../types/sora';

interface TacticalMitigationProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function TacticalMitigation({ assessment, onChange }: TacticalMitigationProps) {

  const tableData = [
    { ARC: 'ARC-d', Attenuation: 'Haut', Robustness: 'Haute' },
    { ARC: 'ARC-c', Attenuation: 'Moyen', Robustness: 'Moyenne' },
    { ARC: 'ARC-b', Attenuation: 'Faible', Robustness: 'Faible' },
    { ARC: 'ARC-a', Attenuation: 'Aucun minimum', Robustness: 'Aucun minimum' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Tableau de Mitigation Tactique</h2>
        <div>Les mesures d'atténuation tactiques sont appliquées pour réduire tout risque résiduel de collision en vol nécessaire pour atteindre l'objectif de sécurité de l'espace aérien applicable.</div>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b">ARC-Final</th>
              <th className="py-2 px-4 border-b">Niveau d'atténuation Tactique</th>
              <th className="py-2 px-4 border-b">Robustesse de l'atténuation</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className={
                    row.ARC === assessment.OperationalVolumeLevelMitigated//'ARC-b'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
                    ? 'bg-blue-900 text-white'
                     : 'bg-gray-200 text-gray-400'
                }
              >
                <th className="py-2 px-4 border-b">{row.ARC}</th>
                <th className="py-2 px-4 border-b">{row.Attenuation}</th>
                <th className="py-2 px-4 border-b">{row.Robustness}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Mitigation Tactique Risque Air</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="L'étape 5 permet de réduire l’ARC en justifiant d’une probabilité réduite de rencontre avec d'autres aéronefs s’appuyant par exemple sur une densité aérienne plus faible, sur une coordination avec les services de contrôle, sur une information des autres usagers de l’espace aérien, etc. La réduction de l’ARC proposée doit être explicitement justifiée et argumentée.">
              <label className="block text-sm font-medium text-gray-700">
                Une Mitigation Tactique est-elle mise en place
              </label>
            </Tooltip>
            <select
              value={assessment.TacticalMitigationAvailable}
              onChange={(e) =>
                            onChange({
                              ...assessment,
                              TacticalMitigationAvailable: e.target.value as TacticalMitigationAvailable,
                            })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Indiquer une valeur">
                        Indiquer une valeur
                        </option>
              <option value="OUI">OUI</option>
              <option value="NON">NON</option>
            </select>
          </div>
          {assessment.TacticalMitigationAvailable === 'OUI' && (
            <div>
              <Tooltip text="En quelques phrases, veuillez décrire les moyens et TacticalMitigationJustifications de Mitigation Stratégique du risque Air">
                <label className="block text-sm font-medium text-gray-700">
                  Justifier vos éléments de Mitigation Tactique du risque Air
                </label>
              </Tooltip>
              <textarea
                value={assessment.TacticalMitigationJustification}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    TacticalMitigationJustification: e.target.value,
                  })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
