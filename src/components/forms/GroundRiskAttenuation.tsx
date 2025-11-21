import React from 'react';
import { RiskAssessmentInfo, mitigationStrategique, reduceImpactAttenuation, necessaryToReduceRisk, GRC_Final } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { HelpCircle } from 'lucide-react';

interface GroundRiskAttenuationProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function GroundRiskAttenuation({ assessment, onChange }: GroundRiskAttenuationProps) {

  const tableData = [
    { Integrity: 'Intégrité faible ', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Faible ', InsuranceHigh: 'Robustesse Faible '  },
    { Integrity: 'Intégrité moyenne', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Moyenne', InsuranceHigh: 'Robustesse Moyenne'  },
    { Integrity: 'Intégrité haute  ', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Moyenne', InsuranceHigh: 'Robustesse Haute  '  },
  ];

  const CalculGRCFinal = () => {
    if (!assessment || !assessment.iGRC || !assessment.mitigationStrategiqueM1A || !assessment.mitigationStrategiqueM1B || !assessment.reduceImpactAttenuationM2  || !assessment.confinementRequirements) { //|| !assessment.planInterventionUrgence
      return 'Vous devez sélectionner une valeur pour chaque type d\'atténuation';//Number(assessment.iGRC);// Return a default value or handle the error as needed
    }

    let FinalGRCint = Number(assessment.iGRC);
    if (assessment.mitigationStrategiqueM1A.includes('faible')) {
      FinalGRCint = FinalGRCint - 1;
     } else if (assessment.mitigationStrategiqueM1A.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 2;
    // } else if (assessment.mitigationStrategiqueM1A.includes('élevée')) {
    //   FinalGRCint = FinalGRCint - 4;
    // 
    } else {FinalGRCint = FinalGRCint - 0;}

  //  if (assessment.mitigationStrategiqueM1B.includes('faible')) {
  //     FinalGRCint = FinalGRCint - 1;
  //   } else 
    if (assessment.mitigationStrategiqueM1B.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 1;
    } else if (assessment.mitigationStrategiqueM1B.includes('élevée')) {
      FinalGRCint = FinalGRCint - 2;
    } else {FinalGRCint = FinalGRCint - 0;}

    if (assessment.mitigationTactiqueM1C.includes('faible')) {
      FinalGRCint = FinalGRCint - 1;
    // } else if (assessment.mitigationTactiqueM1C.includes('moyenne')) {
    //   FinalGRCint = FinalGRCint - 2;
    // } else if (assessment.mitigationTactiqueM1C.includes('élevée')) {
    //   FinalGRCint = FinalGRCint - 3;
    // 
    } else {FinalGRCint = FinalGRCint - 0;}


    // if (assessment.reduceImpactAttenuationM2.includes('faible')) {
    //   FinalGRCint = FinalGRCint - 0;
    // } else 
    if (assessment.reduceImpactAttenuationM2.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 1;
    } else if (assessment.reduceImpactAttenuationM2.includes('élevée')) {
      FinalGRCint = FinalGRCint - 2;
    } else {FinalGRCint = FinalGRCint - 0;}
    
    // if (assessment.planInterventionUrgence.includes('faible')) {
    //   FinalGRCint = FinalGRCint + 1;
    // } else if (assessment.planInterventionUrgence.includes('moyenne')) {
    //   FinalGRCint = FinalGRCint - 0;
    // } else if (assessment.planInterventionUrgence.includes('élevée')) {
    //   FinalGRCint = FinalGRCint - 1;
    // } else {FinalGRCint = FinalGRCint +1;}
    // if ()
    if (FinalGRCint < assessment.iGRCControledZone) {
      FinalGRCint = assessment.iGRCControledZone; // Ensure GRC does not go below assessment.iGRCControledZone
    }
    return FinalGRCint;
  };

  const tableMitigationGRCData = [
    { MitigationGR: 'M1(A) – Atténuation Strategique - Abris'                       ,LowMitigation: '-1' ,MediumMitigation: '-2' ,HighMitigation: 'N/A' },
    { MitigationGR: 'M1(B) – Atténuation Strategique - Restrictions Operationelles' ,LowMitigation: 'N/A',MediumMitigation: '-1'  ,HighMitigation: '-2' },
    { MitigationGR: 'M1(C) – Atténuations Tactique – Observateur(s) au sol'         ,LowMitigation: '-1' ,MediumMitigation: 'N/A' ,HighMitigation: 'N/A' },
    { MitigationGR: 'M2 – Réduction des effets de l’impact au sol'                  ,LowMitigation: 'N/A',MediumMitigation: '-1'  ,HighMitigation: '-2' },
    ];
  return (
                  <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Tableau de mitigation du Risque Sol<button
                      type="button"
                      onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Main-Body-Release-JAR_doc_25.pdf#page=33', '_blank')}  
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Ouvrir la documentation JARUS SORA v2.5 Main Body - Section 4.3 Step #3 – Final Ground Risk Class (GRC) determination (optional)  "
                    >
                      <HelpCircle className="w-4 h-4" />
                  </button></h2>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-white">
                        <th className="bg-withe py-2 px-4 border-b"> </th>
                        <th colspan="3" className="bg-blue-300 py-2 px-4 border-b ">Niveau de Robustesse</th>
                      </tr>
                      <tr className="bg-blue-300 ">
                        <th className="bg-blue-400 py-2 px-4 border-b">Atténuation du risque Sol</th>
                        <th className="py-2 px-4 border-b">Faible</th>
                        <th className="py-2 px-4 border-b">Moyenne</th>
                        <th className="py-2 px-4 border-b">Haute</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableMitigationGRCData.map((row, index) => (
                        <tr
                          key={index}
                          className={'bg-gray-200 text-gray-800'}
                        >
                          
                      
                          <th className="py-2 px-4 border-b bg-red-200 text-black text-left">{row.MitigationGR}</th>
                          <th className={
                          // row.MitigationGR.endsWith(assessment.populationDensity) && iGRC_colIndex==1
                          // ? 'bg-blue-900  text-white'
                          // : 
                          'py-2 px-4 border-b'
                          }>{row.LowMitigation}    </th>
                          <th className={
                          // row.MitigationGR.endsWith(assessment.populationDensity) && iGRC_colIndex==2
                          // ? 'bg-blue-900  text-white'
                          // : 
                          'py-2 px-4 border-b' 
                          }>{row.MediumMitigation}</th>
                          <th className={
                          // row.MitigationGR.endsWith(assessment.populationDensity) && iGRC_colIndex==3
                          // ? 'bg-blue-900  text-white'
                          // : 
                          'py-2 px-4 border-b'
                          }>{row.HighMitigation}</th>
                          
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>

      <h2 className="text-1xl font-semibold">Tableau de Robustesse des moyens de mitigation<button
                      type="button"
                      onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Main-Body-Release-JAR_doc_25.pdf#page=33', '_blank')}  
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Ouvrir la documentation JARUS SORA v2.5 Main Body - Section 2.4 Robustess "
                    >
                      <HelpCircle className="w-4 h-4" />
                  </button>
      </h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-4 border-b"> </th>
            <th className="py-2 px-4 border-b">Assurance faible</th>
            <th className="py-2 px-4 border-b">Assurance moyenne</th>
            <th className="py-2 px-4 border-b">Assurance haute</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-200 text-gray-800'
              }
            >
              <td className="py-2 px-4 border-b">{row.Integrity}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceLow}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceMedium}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceHigh}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-2xl font-semibold">Robustesse des Moyens d'Atténuation du risque sol</h2>
      <section className="space-y-4">   
        <div className="bg-gray-200 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium">M1(A) – Atténuation Strategique - Abris <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Annex-B-Release.JAR_doc_27pdf.pdf', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Annex B"
              >
                <HelpCircle className="w-4 h-4" />
              </button></h2>
          <div>
              <label className="block text-sm font-medium text-gray-700">
                L'atténuation M1(A) est liée au fait que les gens passent en moyenne très peu de temps à l'extérieur sans être protégés par une structure. Par conséquent, les opérateurs qui utilisent des UAS suffisamment petits peuvent s'attendre à ce qu'un grand pourcentage de la population soit à l'abri d'un impact. Cette hypothèse peut également s'appliquer à des UAS plus grands ; dans ce cas, l'efficacité de la mise à l'abri doit être démontrée.                                      
              </label>
          </div>
          <div>
            <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M1.">
              <label className="block text-sm font-medium text-gray-700">
                M1(A) – Atténuation Strategique - Abris                                     
              </label>
            </Tooltip>

            <select
              value={assessment.mitigationStrategiqueM1A}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  mitigationStrategiqueM1A: e.target.value as mitigationStrategique,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Sélectionner une méthode d'évaluation iGRC">
                    Sélectionner une valeur
              </option>
              <option value="Non">Non</option>
              <option value="Oui, faible">Oui, faible</option>
              <option value="Oui, moyenne">Oui, moyenne</option>
            </select>
          </div>
          
          <Tooltip text="Apporter une justification pour l'atténuation M1(A).">
            <h3 className="text-lg font-medium">Justification M1(A)</h3>
          </Tooltip>
          <textarea
            value={assessment.M1A_Justification}
            onChange={(e) =>
              onChange({
                ...assessment,
                M1A_Justification: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </section>

      <section className="space-y-4">   
        <div className="bg-gray-200 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium">M1(B) – Atténuation Strategique - Restrictions Operationelles <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Annex-B-Release.JAR_doc_27pdf.pdf#page=10', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Annex B"
              >
                <HelpCircle className="w-4 h-4" />
              </button></h2>
          <div>
              <label className="block text-sm font-medium text-gray-700">
                Les mesures d'atténuation M1(B) visent à réduire le nombre de personnes en danger au sol, indépendamment de la mise à l'abri. Ces mesures d'atténuation sont appliquées avant le vol. Les mesures d'atténuation M1(B) sont des combinaisons de limitations concernant le temps et le lieu de l'opération afin de réduire le nombre de personnes exposées à un risque à un moment et dans un lieu donnés.
              </label>
          </div>
          <div>
            <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M1.">
              <label className="block text-sm font-medium text-gray-700">
                M1(B) – Atténuation Strategique - Restrictions Operationelles
              </label>
            </Tooltip>
            <select
              value={assessment.mitigationStrategiqueM1B}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  mitigationStrategiqueM1B: e.target.value as mitigationStrategique,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Sélectionner une méthode d'évaluation iGRC">
                    Sélectionner une valeur
              </option>
              <option value="Non">Non</option>
              <option value="Oui, moyenne">Oui, moyenne</option>
              <option value="Oui, élevée">Oui, élevée</option>
            </select>
          </div>
          
          <Tooltip text="Apporter une justification pour l'atténuation M1(A).">
            <h3 className="text-lg font-medium">Justification M1(B)</h3>
          </Tooltip>
          <textarea
            value={assessment.M1B_Justification}
            onChange={(e) =>
              onChange({
                ...assessment,
                M1B_Justification: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </section>

      <section className="space-y-4">   
        <div className="bg-gray-200 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium">M1(C) – Atténuations Tactique – Observateur(s) au sol <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Annex-B-Release.JAR_doc_27pdf.pdf', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Annex B"
              >
                <HelpCircle className="w-4 h-4" />
              </button></h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            
              <label className="block text-sm font-medium text-gray-700">
                REMARQUE : Si un ou plusieurs observateurs au sol sont déclarés, ceux-ci devront être clairement identifiés à l'étape 2 sur vos fichier trajectoire ou zone de vol. 
                <br />
                Qui plus est, si votre opération est déclarée en EVLOS à l'étape 1, le nombre d'observateurs au sol devra être déclaré en cohérence.
                <br />
              </label>  
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">
                L'atténuation M1(C) est une atténuation tactique dans laquelle l'équipage à distance ou le système peut observer la majeure partie de la ou des zones survolées, ce qui permet de détecter les personnes non impliquées dans la zone opérationnelle et de manœuvrer l'UA, de sorte que le nombre de personnes non impliquées survolées au cours de l'opération est considérablement réduit.
              </label>
          </div>
         <div>
            <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M1.">
              <label className="block text-sm font-medium text-gray-700">
                M1(C) – Atténuations Tactique – Observateur(s) au sol
              </label>
            </Tooltip>
            <select
              value={assessment.mitigationTactiqueM1C}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  mitigationTactiqueM1C: e.target.value as mitigationStrategique,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Sélectionner une méthode d'évaluation iGRC">
                    Sélectionner une valeur
              </option>
              <option value="Non">Non</option>
              <option value="Oui, faible">Oui, faible</option>
            </select>
          </div>
          
          <Tooltip text="Apporter une justification pour l'atténuation M1(A).">
            <h3 className="text-lg font-medium">Justification M1(C)</h3>
          </Tooltip>
          <textarea
            value={assessment.M1C_Justification}
            onChange={(e) =>
              onChange({
                ...assessment,
                M1C_Justification: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </section>

      <section className="space-y-4">   
        <div className="bg-gray-200 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium">M2 – Réduction des effets de l’impact au sol <button
                type="button"
                onClick={() => window.open('https://www.easa.europa.eu/en/downloads/137609/en', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation EASA : MOC Light-UAS.2512-01 (medium robustness)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => window.open('https://www.easa.europa.eu/en/downloads/139843/en', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Attention : statut 'Proposed' Ouvrir la documentation EASA : MOC Light-UAS.2512-01 (high robustness)"
              >
                <HelpCircle className="w-4 h-4" />
              </button></h2>
            
            {assessment.UsemaxCharacteristicDimension=='OUI' ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                
                  <label className="block text-sm font-medium text-red-700">
                    ATTENTION : A l'étape 2, vous avez sélectionné l'option 'Utiliser la dimension caractéristique maximale Applicable selon le calcul de la crash Area'.
                    <br />
                    En conséquence, vos justifications apportées au titre d'un M2 devrons démontrer une réduction du risque par rapport à cette crash area de référence.
                    <br />
                  </label>  
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                
                  <label className="block text-sm font-medium text-gray-700">
                    REMARQUE : A l'étape 2, si vous avez déclaré une valeur de crash Area faisant déjà usage de votre M2, vous ne pouvez justifier de celle-ci une nouvelle fois.
                    <br />
                    En conséquence, il ne vous est pas possible de réduire le GRC Final en dessous de l'iGRC déclaré à l'étape 2 grâce à une seconde déclaration de ce même M2.
                    <br />
                  </label>  
                </div>
            )}
              
          <div>
              <label className="block text-sm font-medium text-gray-700">
                Les mesures d'atténuation M2 visent à réduire l'effet de l'impact au sol une fois que le contrôle de l'opération est perdu. Cela se fait soit en réduisant la probabilité de létalité d'un impact d'UA (c'est-à-dire l'énergie, l'impulsion, la dynamique de transfert d'énergie, etc.) et/ou en réduisant la taille de la zone critique prévue. Les exemples incluent, sans s'y limiter, les parachutes, l'autorotation, la frangibilité, le décrochage de l'aéronef pour ralentir la descente et augmenter l'angle d'impact. Le demandeur doit démontrer une réduction totale requise de l'un ou l'autre des facteurs, ou des deux.
              </label>
          </div>
          <div className="flex-1">
            <Tooltip text="Sélectionnez l'une des quatre options de la première ligne. Dans le cas où l'évaluation des risques est basée sur le SORA, cela consiste en une atténuation M2. Même si le drone peut être équipé d'un tel système, cette atténuation peut ne pas être requise pour l'opération afin de réduire le risque au sol. Dans ce cas, dans la deuxième ligne, sélectionnez 'NON'. Si l'atténuation est utilisée pour réduire le risque au sol, sélectionnez 'OUI', et l'opérateur doit inclure les procédures associées dans le manuel d'exploitation.">
              <label className="block text-sm font-medium text-gray-700">       
                M2 – Réduction des effets de l’impact au sol
              </label>
            </Tooltip>
            <select
              value={assessment.reduceImpactAttenuationM2}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  reduceImpactAttenuationM2: e.target.value as reduceImpactAttenuation,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Sélectionner une méthode d'évaluation iGRC">
                    Sélectionner une valeur
              </option>
              <option value="Non">Non</option>
              <option value="Oui, moyenne">Oui, moyenne</option>
              <option value="Oui, élevée">Oui, élevée</option>
            </select>
          </div>
          
          <Tooltip text="Apporter une justification pour l'atténuation M1(A).">
            <h3 className="text-lg font-medium">Justification M2</h3>
          </Tooltip>
          <textarea
            value={assessment.M2_Justification}
            onChange={(e) =>
              onChange({
                ...assessment,
                M2_Justification: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </section>



      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        
        

        {/* <div className="flex space-x-4">


          <div className="flex-1">
            <Tooltip text="Sélectionnez 'OUI' si l'atténuation est nécessaire pour réduire le risque au sol, ou 'NON' si ce n'est pas requis.">
              <label className="block text-sm font-medium text-gray-700">
                Nécessaire pour réduire le risque au sol
              </label>
            </Tooltip>
            <select
              value={assessment.necessaryToReduceRisk}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  necessaryToReduceRisk: e.target.value as necessaryToReduceRisk,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>
        </div> */}

        {/* <div>
          <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M3.">
            <label className="block text-sm font-medium text-gray-700">
              M3 : Plan d'intervention d'urgence
            </label>
          </Tooltip>
          <select
            value={assessment.planInterventionUrgence}
            onChange={(e) =>{
              onChange({
                ...assessment,
                planInterventionUrgence: e.target.value as mitigationStrategique,
              });
              CalculGRCFinal();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Non">Non</option>
            <option value="Oui, faible">Oui, faible</option>
            <option value="Oui, moyenne">Oui, moyenne</option>
            <option value="Oui, élevée">Oui, élevée</option>
          </select>
        </div> */}

        {/* <div>
          <Tooltip text="Choisir une des deux options">
            <label className="block text-sm font-medium text-gray-700">
              Exigences techniques pour le confinement
            </label>
          </Tooltip>
          <select
            value={assessment.confinementRequirements}
            onChange={(e) =>{
              onChange({
                ...assessment,
                confinementRequirements: e.target.value as 'Basiques' | 'Amélioré',
              });
              CalculGRCFinal();
            }}
            
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Basiques">Basiques</option>
            <option value="Amélioré">Amélioré</option>
          </select>
        </div> */}

        <div>
          <h3 className="text-lg font-medium">Remarques complémentaires</h3>
          {/* <Tooltip text="Champ de texte libre pour l'ajout de toute remarque pertinente. ">
            <label className="block text-sm font-medium text-gray-700">
              Champ de texte libre pour l'ajout de toute remarque pertinente
            </label>
          </Tooltip> */}
          <Tooltip text={
                                <div>
                                  Champ de texte libre pour l'ajout de toute remarque pertinente. 
                                  <br />
                                  Exemple : Atténuations partielles multiples
                                  <br />
                                  Dans les cas où des atténuations partielles multiples ne satisfont pas individuellement aux critères de l'annexe B mais que, prises ensemble, elles permettent d'obtenir des réductions cumulatives d'un ou plusieurs ordres de grandeur, l'autorité compétente peut accepter une réduction de la note finale du GRC.
                                </div>
                              }>
            <label className="block text-sm font-medium text-gray-700">
              Champ de texte libre pour l'ajout de toute remarque pertinente
            </label>
          </Tooltip>
          <textarea
            value={assessment.additionalRemarks}
            onChange={(e) =>
              onChange({
                ...assessment,
                additionalRemarks: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </div>





      <h2 className="text-2xl font-semibold">GRC Final</h2>
      <div>
        <Tooltip text="GRC Final calculé à partir de l'iGRC et des gain d'atténuation. N.B. cette valeur ne peut être inférieure à l'iGRC 'Zone Contrôlé' de votre classe d'appareil identifiée à l'étape 2.">
          <label className="block text-sm font-medium text-gray-700">
            GRC Final Calculé : &ge;{assessment.iGRCControledZone}
          </label>
        </Tooltip>
        <h2 className="text-2xl">{assessment.iGRC} is reduced to <b>{CalculGRCFinal()}</b></h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div>
          <Tooltip text="GRC Final.">
            <label className="block text-sm font-medium text-gray-700">
              GRC
            </label>
          </Tooltip>
          <select
            value={assessment.GRC_Final }
            onChange={(e) =>
              onChange({
                ...assessment,
                GRC_Final: e.target.value as GRC_Final,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
              <option value="Indiquer une valeur">
                        Indiquer une valeur
                        </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
            {
                            Number(assessment.GRC_Final)>7   ?  (
                                <div>
                                <Tooltip text="GRC Final.">
                                  <label className="block text-lg font-bold text-red-700">
                                    GRC Final - Trop élevé. Le processus SORA est inadapté. 
                                  </label>  
                                </Tooltip>
                                
                                </div>
                            ) : (
                                <div>
                                <Tooltip text="GRC Final.">
                                  <label className="block text-sm font-medium text-gray-700">
                                    GRC Final - Valide. Vous pouvez procéder aux étapes suivantes du processus SORA.
                                  </label>  
                                </Tooltip>
                                </div>
                                )}

      </div>
    </div>
  );
}
