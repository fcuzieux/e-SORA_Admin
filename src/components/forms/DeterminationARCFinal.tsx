import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, StrategicMitigationAvailable, OperationalVolumeLevelMitigated } from '../../types/sora';
import { HelpCircle } from 'lucide-react';

interface DeterminationARCFinalProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function DeterminationARCFinal({ assessment, onChange }: DeterminationARCFinalProps) {

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Mitigation Stratégique Risque Air</h2>
        <div>
          L'atténuation stratégique consiste en des procédures et des restrictions opérationnelles visant à réduire les taux de rencontre avec l'UAS ou le temps d'exposition, avant le décollage.
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text={
                                          <div>
                                            Les restrictions opérationnelles sont contrôlées4 par l'opérateur et visent à réduire les risques de collision avant le décollage. Cette section fournit des détails sur les restrictions opérationnelles et des exemples sur la façon dont elles peuvent être appliquées aux opérations UAS.
                                            <br />
                                            Les restrictions opérationnelles sont le principal moyen dont dispose un exploitant pour réduire les risques de collision au moyen d'une ou plusieurs mesures d'atténuation stratégiques. Les mesures d'atténuation les plus courantes sont les suivantes :
                                            <br />
                                            <li>Atténuation(s) qui limite(nt) le volume géographique dans lequel l'UAS opère (par exemple, certaines frontières ou volumes d'espace aérien)</li>
                                            <li>Atténuation(s) qui limite(nt) le cadre temporel opérationnel (par exemple, limité à certaines heures de la journée, comme voler seulement la nuit)</li>
                                            <br />
                                            En plus de ce qui précède, une autre approche pour limiter l'exposition au risque est de limiter le temps d'exposition. C'est ce qu'on appelle « l'atténuation par l'exposition ». L'atténuation par l'exposition limite simplement la durée d'exposition au risque opérationnel.
                                          </div>
                                        }>
              <label className="block text-sm font-medium text-gray-700">
                Atténuations Stratégique par des restrictions opérationnelles <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-Annex-C-v1.0.pdf', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Annex C - 5.1 Strategic Mitigation by Operational Restrictions"
              >
                <HelpCircle className="w-4 h-4" />
              </button> 
              </label>
            </Tooltip>
            <select
              value={assessment.StrategicMitigationOperationalRestrictionsAvailable}
              onChange={(e) =>
                            onChange({
                              ...assessment,
                              StrategicMitigationOperationalRestrictionsAvailable: e.target.value as StrategicMitigationAvailable,
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
          {assessment.StrategicMitigationOperationalRestrictionsAvailable === 'OUI' && (
            
             
            
            
              <div>
                <Tooltip text="En quelques phrases, Justifier vos éléments de restrictions opérationnelles">
                  <label className="block text-sm font-medium text-gray-700">
                    Justifier vos éléments de restrictions opérationnelles
                  </label>
                </Tooltip>
                <textarea
                  value={assessment.StrategicMitigationOperationalRestrictionsJustification}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      StrategicMitigationOperationalRestrictionsJustification: e.target.value,
                    })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
          )}



          <div>
            
            <Tooltip text={
                                          <div>
                                            L'atténuation stratégique par des structures et des règles communes exige que tous les aéronefs d'une certaine classe d'espace aérien suivent les mêmes structures et règles ; ces structures et règles visent à réduire le risque de collision dans l'espace aérien.
                                            <br />
                                            Tous les aéronefs évoluant dans cet espace aérien doivent y participer et seules les autorités compétentes et/ou les ANSP sont habilitées à fixer des exigences pour ces aéronefs.
                                            <br />
                                            L'opérateur de l'UAS n'a aucun contrôle sur l'existence ou le niveau de participation à la structure de l'espace aérien ou sur l'application des règles de vol.
                                            <br />
                                            Par conséquent, l'atténuation stratégique par des structures et des règles communes n'est appliquée que par les autorités compétentes et/ou les ANSP. Elle est à la disposition de l'opérateur UAS ou non.
                                          </div>
                                        }>
              <label className="block text-sm font-medium text-gray-700">
                Atténuations Stratégique par des structures communes et des règles <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-Annex-C-v1.0.pdf', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Annex C - 5.2 Strategic Mitigation by Common Structures and Rules"
              >
                <HelpCircle className="w-4 h-4" />
              </button> 
              </label>
            </Tooltip>
            <select
              value={assessment.StrategicMitigationCommonStructuresAvailable}
              onChange={(e) =>
                            onChange({
                              ...assessment,
                              StrategicMitigationCommonStructuresAvailable: e.target.value as StrategicMitigationAvailable,
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
          {assessment.StrategicMitigationCommonStructuresAvailable === 'OUI' && (
            
            
            
            
              <div>
                <Tooltip text="En quelques phrases, Justifier vos éléments de restrictions opérationnelles">
                  <label className="block text-sm font-medium text-gray-700">
                    Justifier vos éléments de restrictions opérationnelles
                  </label>
                </Tooltip>
                <textarea
                  value={assessment.StrategicMitigationCommonStructuresJustification}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      StrategicMitigationCommonStructuresJustification: e.target.value,
                    })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
          )}
        </div>
      </div>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Niveau de Risque Air Résiduel après Mitigation Stratégique </h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez le niveau de risque résiduel pour l'opération envisagée.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Opérationnel
              </label>
            </Tooltip>
            <select
              value={assessment.OperationalVolumeLevelMitigated}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  OperationalVolumeLevelMitigated: e.target.value as OperationalVolumeLevelMitigated,
                })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Indiquer une valeur">
                        Indiquer une valeur
                        </option>
              <option value='ARC-a'>ARC-a</option>
              <option value='ARC-b'>ARC-b</option>
              <option value='ARC-c'>ARC-c</option>
              <option value='ARC-d'>ARC-d</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
