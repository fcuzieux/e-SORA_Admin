import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { Oso, OsoRobustnessLevel } from '../../types/sora';
import { RiskAssessmentInfo } from '../../types/sora';

interface OsoFormProps {
  osos: Oso[];
    assessment: RiskAssessmentInfo;
  onChange: (osos: Oso[]) => void;
}

export function OsoForm({ osos,assessment, onChange }: OsoFormProps) {
  if (!osos) {
    return <div>Loading...</div>;
  } else {

    const ReqInfoSail = ['Non Requis' , 'Faible' , 'Moyen' , 'Élevé'];
    let Tableau: number[] = [];
    // switch (assessment.SAIL.toString()) {
    //   case 'SAIL 1':
    //     Tableau = [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0];
    //     break;
    //   case 'SAIL 2':
    //     Tableau = [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0];
    //     break;
    // }
    
    // SAIL 1 to 6 + Certifié : Table de correspondance des niveaux de robustesse requis pour chaque OSO
    // -1 = Removed from SORA2.0
    // 0 = Non Requis
    // 1 = Faible
    // 2 = Moyen
    // 3 = Élevé
     if (assessment.SAIL.toString().includes('SAIL 1')) {
        Tableau=[0,0,1,0,0,0,1,1,1,-1,-1,-1,1,-1,-1,1,1,0,0,0,-1,-1,1,0] ;
     } else if (assessment.SAIL.toString().includes('SAIL 2')) {
        Tableau=[1,0,1,0,0,1,1,2,1,-1,-1,-1,1,-1,-1,1,1,0,0,1,-1,-1,1,0] ;
     } else if (assessment.SAIL.toString().includes('SAIL 3')) {
        Tableau=[2,1,2,0,1,1,2,3,2,-1,-1,-1,2,-1,-1,2,2,1,1,1,-1,-1,2,2] ;
     } else if (assessment.SAIL.toString().includes('SAIL 4')) {
        Tableau=[3,2,2,1,2,2,2,3,2,-1,-1,-1,3,-1,-1,2,2,2,2,2,-1,-1,2,3];
     } else if (assessment.SAIL.toString().includes('SAIL 5')) {
        Tableau=[3,3,3,2,3,3,3,3,3,-1,-1,-1,3,-1,-1,3,3,3,2,2,-1,-1,3,3] ;
     } else if (assessment.SAIL.toString().includes('SAIL 6')) {
        Tableau=[3,3,3,3,3,3,3,3,3,-1,-1,-1,3,-1,-1,3,3,3,3,3,-1,-1,3,3] ;
     } else if (assessment.SAIL.toString().includes('Certifié')) {
        Tableau=[3,3,3,3,3,3,3,3,3,-1,-1,-1,3,-1,-1,3,3,3,3,3,-1,-1,3,3] ;
     }
     const SAILMap=Tableau;

    osos = [
      {
        id: 'OSO1',
        number: '01',
        description: 'Opérateur UAS compétent et/ou approuvé',
        requiredLevel: ReqInfoSail.at(SAILMap.at(0)),
        status: assessment.OSOS_Levels[0] || 'Sélectionner une valeur',
        evidence: '',
        tooltip:'<div>Elément de réponse attendu :<br /> (a) Plan de formation générale. <br /> (b) Formation de l’équipage spécifique sur l’UAS concerné. <br />(c) Expérience de l’opérateur et précédentes opérations. <br />(d) Checklist et manuel d’entretien</div>',
      },
      {
        id: 'OSO2',
        number: '02',
        description: 'Constructeur UAS compétent et/ou approuvé',
        requiredLevel: ReqInfoSail.at(SAILMap.at(1)),
        status: assessment.OSOS_Levels[1],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO3',
        number: '03',
        description: 'Maintenance UAS assurée par une entité compétente et/ou approuvée',
        requiredLevel: ReqInfoSail.at(SAILMap.at(2)),
        status: assessment.OSOS_Levels[2],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO4',
        number: '04',
        description: 'Les composants UAS essentiels aux opérations sûres sont conçus selon une norme de conception de navigabilité (ADS)',
        requiredLevel: ReqInfoSail.at(SAILMap.at(3)),
        status: assessment.OSOS_Levels[3],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO5',
        number: '05',
        description: 'UAS conçu en tenant compte de la sécurité et de la fiabilité du système',
        requiredLevel: ReqInfoSail.at(SAILMap.at(4)),
        status: assessment.OSOS_Levels[4],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO6',
        number: '06',
        description: 'Performances du Lien C3 appropriées pour la mission',
        requiredLevel: ReqInfoSail.at(SAILMap.at(5)),
        status: assessment.OSOS_Levels[5],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO7',
        number: '07',
        description: 'Vérification de conformité de la configuration du UAS',
        requiredLevel: ReqInfoSail.at(SAILMap.at(6)),
        status: assessment.OSOS_Levels[6],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO8',
        number: '08',
        description: 'Procédures opérationnelles définies, validées et respectées',
        requiredLevel: ReqInfoSail.at(SAILMap.at(7)),
        status: assessment.OSOS_Levels[7],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO9',
        number: '09',
        description: 'Équipage à distance formé et à jour. ',
        requiredLevel: ReqInfoSail.at(SAILMap.at(8)),
        status: assessment.OSOS_Levels[8],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO10',
        number: '10',
        description: 'Removed from SORA2.0 and merged with OSO #05',
        requiredLevel: ReqInfoSail.at(SAILMap.at(9)),
        status: assessment.OSOS_Levels[9],
        evidence: '',
        tooltip:'OSO #10 was merged with OSO #05. This was possible by the probability to have a catastrophic event for SAIL I to OV operations are very low and no single failure criterion are either already covered in OSO #05 or in Annex B mitigations M2. ',
      },
      {
        id: 'OSO11',
        number: '11',
        description: 'Removed from SORA2.0 redundant with OSO #08',
        requiredLevel: ReqInfoSail.at(SAILMap.at(10)),
        status: assessment.OSOS_Levels[10],
        evidence: '',
        tooltip:'',
      },
      {
        id: 'OSO12',
        number: '12',
        description: 'Removed from SORA2.0 and merged with OSO #05',
        requiredLevel: ReqInfoSail.at(SAILMap.at(11)),
        status: assessment.OSOS_Levels[11],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO13',
        number: '13',
        description: 'Les systèmes externes de soutien sont adéquats pour l’opération',
        requiredLevel: ReqInfoSail.at(SAILMap.at(12)),
        status: assessment.OSOS_Levels[12],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO14',
        number: '14',
        description: 'Removed from SORA2.0 redundant with OSO #08',
        requiredLevel: ReqInfoSail.at(SAILMap.at(13)),
        status: assessment.OSOS_Levels[13],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO15',
        number: '15',
        description: 'Removed from SORA2.0',
        requiredLevel: ReqInfoSail.at(SAILMap.at(14)),
        status: assessment.OSOS_Levels[14],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO16',
        number: '16',
        description: 'Coordination multi-équipage',
        requiredLevel: ReqInfoSail.at(SAILMap.at(15)),
        status: assessment.OSOS_Levels[15],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO17',
        number: '17',
        description: 'Equipage en capacité d’opérer',
        requiredLevel: ReqInfoSail.at(SAILMap.at(16)),
        status: assessment.OSOS_Levels[16],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO18',
        number: '18',
        description: 'Protection automatique de l’enveloppe de vol face à l’erreur humaine',
        requiredLevel: ReqInfoSail.at(SAILMap.at(17)),
        status: assessment.OSOS_Levels[17],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO19',
        number: '19',
        description: 'Récupération sûre après une erreur humaine',
        requiredLevel: ReqInfoSail.at(SAILMap.at(18)),
        status: assessment.OSOS_Levels[18],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO20',
        number: '20',
        description: "Une évaluation des facteurs humains a été réalisée et l'interface homme-machine (IHM) a été jugée appropriée pour la mission.",
        requiredLevel: 'Non Requis',
        status: assessment.OSOS_Levels[19],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO21',
        number: '21',
        description: "Removed from SORA2.0",
        requiredLevel: 'Non Requis',
        status: assessment.OSOS_Levels[20],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO22',
        number: '22',
        description: "Removed from SORA2.0",
        requiredLevel: 'Non Requis',
        status: assessment.OSOS_Levels[21],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO23',
        number: '23',
        description: "Conditions environnementales pour des opérations sûres définies, mesurables et respectées.",
        requiredLevel: 'Non Requis',
        status: assessment.OSOS_Levels[22],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      { 
        id: 'OSO24',
        number: '24',
        description: "UAS conçu et qualifié pour des conditions environnementales défavorables.",
        requiredLevel: 'Non Requis',
        status: assessment.OSOS_Levels[23],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      }
    ];
  }

  const isRequiredLevelMet = (oso: Oso, assessmentLevel: string) => {

    const OsoRobustnessLevelOptions = {
      options: [
        { value: 'Non Requis', label: 'Non Requis' },
        { value: 'Faible', label: 'Faible' },
        { value: 'Moyen', label: 'Moyen' },
        { value: 'Élevé', label: 'Élevé' },
      ],
    };
    const indexrequiredLevel = OsoRobustnessLevelOptions.options.findIndex(
    (option) => option.value === oso.requiredLevel
    );
    
    const indexLeveldeclared = OsoRobustnessLevelOptions.options.findIndex(
    (option) => option.value === assessmentLevel
    );
    return (indexLeveldeclared-indexrequiredLevel) //oso.requiredLevel === assessmentLevel;
  };

  const handleOsoChange = (index: number, updates: Partial<Oso>) => {
    const updatedOsos = osos.map((oso, i) =>
      i === index ? { ...oso, ...updates } : oso
    );
    onChange(updatedOsos);
    assessment.OSOS_Levels = updatedOsos.map(oso => oso.status);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Objectifs de Sécurité Opérationnelle (OSO)</h2>

      {osos.map((oso, index) => (
      <div className="space-y-4">  
        {index === 0 ? (
          <h3 className="text-xl ">Problème technique avec l'UAS</h3>
            ) : index === 9 ? (
          <h3 className="text-xl ">Détérioration des systèmes externes soutenant les opérations de l'UAS</h3>
            ) : index === 13 ? (
          <h3 className="text-xl ">Erreur(s) Humaine(s)</h3>
            ) : index === 20 ? (
          <h3 className="text-xl ">Conditions d'exploitation défavorables</h3>
            ) : ('')
        }
        {!oso.description.startsWith("Removed") ? (

          <div key={oso.id} className= {isRequiredLevelMet(oso, assessment.OSOS_Levels[index])>=0
          ? "p-4 border bg-green-100 rounded-lg space-y-3"
            : "p-4 border bg-red-100 rounded-lg space-y-3"
          }>
            <h3 className="font-medium">OSO #{oso.number} - {oso.description}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Niveau de robustesse requis
                </label>

                <div className={
                            oso.requiredLevel=='Faible'
                            ? 'mt-1 p-2 bg-green-400 rounded-md'
                            : oso.requiredLevel=='Moyen'
                              ? 'mt-1 p-2 bg-yellow-400 rounded-md'
                            : oso.requiredLevel=='Élevé'
                              ? 'mt-1 p-2 bg-orange-400 rounded-md'
                              : 'mt-1 p-2 bg-purple-200 rounded-md'
                            }>
                  {oso.requiredLevel}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Niveau de robustesse atteint
                </label>
                <select
                  value={assessment.OSOS_Levels[index]}
                  //value={assessment.OSOS_Levels ? assessment.OSOS_Levels[index] : 'Sélectionner une valeur'}
                  onChange={(e) => handleOsoChange(index, {
                    status: e.target.value as OsoRobustnessLevel
                  })}
                  className={
                            assessment.OSOS_Levels[index]=='Faible'
                            ? 'mt-1 p-2 bg-green-400 rounded-md'
                            : assessment.OSOS_Levels[index]=='Moyen'
                              ? 'mt-1 p-2 bg-yellow-400 rounded-md'
                            : assessment.OSOS_Levels[index]=='Élevé'
                              ? 'mt-1 p-2 bg-orange-400 rounded-md'
                            : assessment.OSOS_Levels[index]=='Non Requis'
                              ? 'mt-1 p-2 bg-purple-200 rounded-md'
                              : 'mt-1 p-2 bg-white rounded-md'
                            }
                >
                  <option value="Sélectionner une valeur">Sélectionner une valeur</option>
                  <option value="Non Requis">Non Requis</option>
                  <option value="Faible">Faible</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Élevé">Élevé</option>
                </select>
              </div>
            </div>
            {
              isRequiredLevelMet(oso, assessment.OSOS_Levels[index])==0
                ? <label className="block text-sm font-medium text-green-700">Niveau requis atteint </label>
              : isRequiredLevelMet(oso, assessment.OSOS_Levels[index])>0
                ? <label className="block text-sm font-medium text-green-700">Niveau requis dépassé </label>
              : <label className="block text-sm font-medium text-red-700">Niveau requis non atteint</label>
            }
            

            <div>
            <Tooltip
              text={
                <div dangerouslySetInnerHTML={{ __html: oso.tooltip }} />
              }
            >
              <label className="block text-sm font-medium text-gray-700">
                Justification / Preuves
              </label></Tooltip>
              <textarea
                value={oso.evidence}
                onChange={(e) => handleOsoChange(index, { evidence: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}

                //placeholder={oso.tooltip}
              />
            </div>
          </div>
        ) : (
          <div>
            
          </div>
        )}
        </div>))}
    </div>
  );
}
