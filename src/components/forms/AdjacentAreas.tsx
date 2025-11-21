import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, OutdoorAssembliesAllowed, ShelterApplicable} from '../../types/sora';
import AdjacenteArea from '../../image/AdjacenteArea.png';

interface AdjacentAreasProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function AdjacentAreas({ assessment, onChange }: AdjacentAreasProps) {

    const Compute_containmentRobustess = () => {
    let containmentRobustess = 'Aucun minimum1';
    //let maxCharacteristicDimensionClass = assessment.maxCharacteristicDimension;
    //populationDensityAdjacentArea = 'Zone Contrôlée' | '<5' | '<50' | '<500' | '<5,000' | '<50,000' | '>50,000' ;
    let indexcolAveragePeopleDensity=-1;
    if (assessment.populationDensityAdjacentArea==='Zone Contrôlée') {
      indexcolAveragePeopleDensity=0;
    } else if (assessment.populationDensityAdjacentArea==='<5') {
      indexcolAveragePeopleDensity=4;
    } else if (assessment.populationDensityAdjacentArea==='<50') {
      indexcolAveragePeopleDensity=49;
    } else if (assessment.populationDensityAdjacentArea==='<500') {
      indexcolAveragePeopleDensity=499;
    } else if (assessment.populationDensityAdjacentArea==='<5,000') {
      indexcolAveragePeopleDensity=4999;
    } else if (assessment.populationDensityAdjacentArea==='<50,000') {
      indexcolAveragePeopleDensity=49999;
    } else { //'>50,000'
      indexcolAveragePeopleDensity=50001;
    }
    // Outdoor Assemblies Allowed = 'Sélectionner une valeur' | 'Assemblies < 40k people' | 'Assemblies of 40k to 400k' | '> 400k' ;
    let indexcolOutdoorAssembliesAllowed=-1;
    if (assessment.OutdoorAssembliesAllowed==='Assemblies < 40k people') {
      indexcolOutdoorAssembliesAllowed=39;
    } else if (assessment.OutdoorAssembliesAllowed==='Assemblies of 40k to 400k') {
      indexcolOutdoorAssembliesAllowed=400;
    } else if (assessment.OutdoorAssembliesAllowed==='> 400k') {
      indexcolOutdoorAssembliesAllowed=401;
    } 
    
    // if (assessment.UsemaxCharacteristicDimension === 'OUI') {
    //   maxCharacteristicDimensionClass = assessment.maxCharacteristicDimensionClass;
    // }
    // iGRC_colIndex = 1 | 2 | 3 | 4 | 5 | 6 ;

    if (assessment.iGRC_colIndex==1) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 49 =>Table 8 - Containment requirements 1 m UA (<25m/s)
      if (assessment.SAILNumber>=4) { 
        containmentRobustess = 'Faible_dim1-sail4';
      } else if (assessment.SAILNumber==3) {
        if (indexcolAveragePeopleDensity<=50000) { 
          if (indexcolOutdoorAssembliesAllowed<40) {         
          containmentRobustess = 'Faible_dim1-sail3a';
          }
          else if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Faible_dim1-sail3b';
          } else {
          containmentRobustess = 'Moyen_dim1-sail3';
          }

        } else {
          if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Faible_dim1-sail3c';
          } else {
          containmentRobustess = 'Moyen_dim1-sail3';
          }
        }
      } else if (assessment.SAILNumber<=2) {
        if (indexcolAveragePeopleDensity<=50000) {
           
          if (indexcolOutdoorAssembliesAllowed<40) {         
          containmentRobustess = 'Faible_dim1-sail12a';
          }
          else if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Moyen_dim1-sail12a';
          } else {
          containmentRobustess = 'Haut_dim1-sail12a';
          }          
        } else {
          if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Moyen_dim1-sail12b';
          } else {
          containmentRobustess = 'Haut_dim1-sail12b';
          }
        }
      }
    
    } else if (assessment.iGRC_colIndex==2) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 49-50 =>Table 9 or 10 - Containment requirements 3 m UA (<35m/s) with or without sheltering
      if (assessment.ShelterApplicable==='OUI') {// SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 49 =>Table 9 - Containment requirements 3 m UA (<35m/s) with sheltering
        //containmentRobustess = 'Cas2_shelter';
        if (assessment.SAILNumber>=5) { //SAIL 5 et 6
          containmentRobustess = 'Faible_dim3sh-sail56';
        } else if (assessment.SAILNumber>=4) { //SAIL 4           
          if (indexcolOutdoorAssembliesAllowed>400) {
            containmentRobustess = 'Moyen_dim3sh-sail4';
          } else {
            containmentRobustess = 'Faible_dim3sh-sail4';
          }       
        } else if (assessment.SAILNumber==3) { //SAIL 3
          if (indexcolAveragePeopleDensity>50000) {
            if (indexcolOutdoorAssembliesAllowed>400) {
              containmentRobustess = 'Out of Scope_dim3sh-sail3';
            } else {
              containmentRobustess = 'Moyen_dim3sh-sail3';
            }
          } else {  
            if (indexcolOutdoorAssembliesAllowed>400) {
              containmentRobustess = 'Out of Scope_dim3sh-sail3';
            } else if (indexcolOutdoorAssembliesAllowed>40) {
              containmentRobustess = 'Moyen_dim3sh-sail3';
            } else {
              containmentRobustess = 'Faible_dim3sh-sail3';
            }  
          }
        } else if (assessment.SAILNumber<=2) { //SAIL 1 et 2
          if (indexcolAveragePeopleDensity>50000) {
            
            if (indexcolOutdoorAssembliesAllowed<=400) {
            containmentRobustess = 'Haut_dim3sh-sail12';
            } else {
            containmentRobustess = 'Out of Scope_dim3sh-sail12';
            }

          } else {

            if (indexcolOutdoorAssembliesAllowed<=40) {
            containmentRobustess = 'Faible_dim3sh-sail12';
            } else if (indexcolOutdoorAssembliesAllowed<=400) {
            containmentRobustess = 'Haut_dim3sh-sail12';
            } else{
            containmentRobustess = 'Out of Scope_dim3sh-sail12';
            }
          }
        } 


      } else {// SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 50 =>Table 10 - Containment requirements 3 m UA (<35m/s) without sheltering
        //containmentRobustess = 'Cas2_no-shelter';
        if (assessment.SAILNumber>=5) { //SAIL 5 et 6
          containmentRobustess = 'Faible_dim3Nosh-sail56';
        } else if (assessment.SAILNumber>=4) { //SAIL 4           
          if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
            containmentRobustess = 'Moyen_dim3Nosh-sail4';
          } else {
            containmentRobustess = 'Faible_dim3Nosh-sail4';
          }       
        } else if (assessment.SAILNumber==3) { //SAIL 3      
          if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
            containmentRobustess = 'Out of Scope_dim3Nosh-sail3';
          } else if (indexcolOutdoorAssembliesAllowed>40 || indexcolAveragePeopleDensity>5000) {
            containmentRobustess = 'Moyen_dim3Nosh-sail3';
          } else {
            containmentRobustess = 'Faible_dim3Nosh-sail3';
          }  

        } else if (assessment.SAILNumber<=2) { //SAIL 1 et 2

          if (indexcolOutdoorAssembliesAllowed<40 && indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Faible_dim3Nosh-sail12';
          } else if (indexcolOutdoorAssembliesAllowed<40 && indexcolAveragePeopleDensity<5000) {
            containmentRobustess = 'Moyen_dim3Nosh-sail12';
          } else if (indexcolAveragePeopleDensity<=50000) {
            if (indexcolOutdoorAssembliesAllowed<=400) {
              containmentRobustess = 'Haut_dim3Nosh-sail12';
            } else {
              containmentRobustess = 'Out of Scope_dim3Nosh-sail12';
            }
          } else if (indexcolAveragePeopleDensity>50000) {
            containmentRobustess = 'Out of Scope_dim3Nosh-sail12';
          }
        }  
      }

    } else if (assessment.iGRC_colIndex==3) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 50 =>Table 11 - Containment requirements 8 m UA (<75m/s)
      //containmentRobustess = 'Cas3';

      if (assessment.SAILNumber==6) { //SAIL 6
        containmentRobustess = 'Faible_dim8-sail6';
      } else if (assessment.SAILNumber==5) { //SAIL 5
        if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
          containmentRobustess = 'Moyen_dim8-sail5';
        } else {
          containmentRobustess = 'Faible_dim8-sail5';
        }
      } else if (assessment.SAILNumber>=4) { //SAIL 4           
        if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
          containmentRobustess = 'Out of Scope_dim8-sail4';
        } else if (indexcolOutdoorAssembliesAllowed>40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Moyen_dim8-sail4';
        } else {
          containmentRobustess = 'Faible_dim8-sail4';
        }      
      } else if (assessment.SAILNumber==3) { //SAIL 3      
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim8-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim8-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Faible_dim8-sail3';
          } else {
          containmentRobustess = 'Moyen_dim8-sail3';
          }
        }  

      } else if (assessment.SAILNumber<=2) { //SAIL 1 et 2     
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim8-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim8-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Moyen_dim8-sail3';
          } else {
          containmentRobustess = 'Haut_dim8-sail3';
          }
        } 
      }      
    } else if (assessment.iGRC_colIndex==4) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 50 =>Table 12 - Containment requirements 20 m UA (<125m/s)
      containmentRobustess = 'Cas4';

      if (assessment.SAILNumber==6) { //SAIL 6
        if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
          containmentRobustess = 'Moyen_dim20-sail6';
        } else {
          containmentRobustess = 'Faible_dim20-sail6';
        }
      } else if (assessment.SAILNumber==5) { //SAIL 5           
        if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
          containmentRobustess = 'Out of Scope_dim20-sail5';
        } else if (indexcolOutdoorAssembliesAllowed>40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Moyen_dim20-sail5';
        } else {
          containmentRobustess = 'Faible_dim20-sail5';
        }     
      } else if (assessment.SAILNumber>=4) { //SAIL 4      
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim20-sail4';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim20-sail4';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Faible_dim20-sail4';
          } else {
          containmentRobustess = 'Moyen_dim20-sail4';
          }
        }  
      } else if (assessment.SAILNumber==3) { //SAIL 3      
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim20-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim20-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Moyen_dim20-sail3';
          } else {
          containmentRobustess = 'Out of Scope_dim20-sail3';
          }
        }  

      } else if (assessment.SAILNumber<=2) { //SAIL 1 et 2     
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim20-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Moyen_dim20-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Haut_dim20-sail3';
          } else {
          containmentRobustess = 'Out of Scope_dim20-sail3';
          }
        } 
      }


    } else if (assessment.iGRC_colIndex==5) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 51 =>Table 13 - Containment requirements 40 m UA (<200m/s)
      containmentRobustess = 'Cas5';

      if (assessment.SAILNumber==6) { //SAIL 6           
        if (indexcolOutdoorAssembliesAllowed>400 || indexcolAveragePeopleDensity>50000) {
          containmentRobustess = 'Out of Scope_dim40-sail6';
        } else if (indexcolOutdoorAssembliesAllowed>40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Moyen_dim40-sail6';
        } else {
          containmentRobustess = 'Faible_dim40-sail6';
        }     
      } else if (assessment.SAILNumber==5) { //SAIL 5       
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim40-sail5';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim40-sail5';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Faible_dim40-sail5';
          } else {
          containmentRobustess = 'Moyen_dim40-sail5';
          }
        }  
      } else if (assessment.SAILNumber>=4) { //SAIL 4         
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim40-sail4';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Faible_dim40-sail4';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Moyen_dim40-sail4';
          } else {
          containmentRobustess = 'Out of Scope_dim40-sail4';
          }
        }  
      } else if (assessment.SAILNumber==3) { //SAIL 3      
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim40-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Moyen_dim40-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Out of Scope_dim40-sail3';
          } else {
          containmentRobustess = 'Out of Scope_dim40-sail3';
          }
        }  

      } else if (assessment.SAILNumber<=2) { //SAIL 1 et 2     
        if (indexcolOutdoorAssembliesAllowed>=40 || indexcolAveragePeopleDensity>5000) {
          containmentRobustess = 'Out of Scope_dim40-sail3';
        } else {
          if (indexcolAveragePeopleDensity<50) {
            containmentRobustess = 'Haut_dim40-sail3';
          } else if (indexcolAveragePeopleDensity<500) {
            containmentRobustess = 'Out of Scope_dim40-sail3';
          } else {
          containmentRobustess = 'Out of Scope_dim40-sail3';
          }
        } 
      }




    } else if (assessment.iGRC_colIndex==6) {
      //containmentRobustess = 'Cas6';
      containmentRobustess = 'Out of Scope-iGRC_colIndex=6';
    } else {
      containmentRobustess = 'ERREUR-iGRC_colIndex voir Etape 2';
    }
  return containmentRobustess;

}
 
   return (
     <div className="space-y-8"> 
     
      <h3 className="text-2xl font-semibold">Rappel des données : Opération en catégorie {assessment.SAIL} </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                  <img className="w-auto h-auto mb-6 mx-auto md:row-span-6"
                    src={AdjacenteArea}
                    alt="AdjacenteArea" 
                  />
                  <Tooltip  text={
                                                        <div>
                                                          Largeur Zone Adjacente (Adjacent Volume)
                                                          <br />
                                                          Calculé selon l'hyposthèse que l'UAS vole à sa vitesse maximale de croisière durant 3 minutes.
                                                          <br />
                                                          5 km &lt; Largeur Zone Adjacente &lt; 35 km
                                                          <br />
                                                          Sauf si le déposant peut démontrer que la portée maximale de l'UAS n'excèdera pas la condition des 3minutes à sa vitesse maximale de croisière.
                                                        </div>
                                                      }>
                                      <label className="block text-sm font-medium text-gray-700">
                                      Largeur Zone Adjacente (m)
                                      </label>
                                    </Tooltip>
                  <input
                    type="number"
                    value={assessment.AdjacentVolumeWidth || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeWidth: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(5000.0)}
                    disabled
                  /> 
                  
                  <Tooltip  text={
                                      <div>
                                        Hauteur Zone Adjacente (Adjacent Volume)
                                        <br />
                                          𝐻𝐴𝑉 = 𝐻𝐶𝑉 + 150 𝑚
                                        <br />
                                        
                                      </div>
                                    }>
                    <label className="block text-sm font-medium text-gray-700">
                    Hauteur Zone Adjacente (m)
                    </label>
                  </Tooltip>
                  <input
                    type="number"
                    value={assessment.AdjacentVolumeHeight || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(0.0)}
                    disabled
                  />  

                  
                  <label className="block text-sm font-medium text-gray-700">
                    Zone adjacente : Densité Moyenne de population(ppl/km²)
                  </label>
                  <input
                    type="text"
                    value={assessment.populationDensityAdjacentArea || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={'Compléter Etape 2'}
                    disabled
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dimensions caractéristiques maximales (m)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxCharacteristicDimension}
                    </div>
                    <Tooltip text="Attention : Si vous avez justifié d'une valeur différente à l'Étape 2, celle ci sera utilisée ici.">
                                            {assessment.UsemaxCharacteristicDimension ===
                                          'OUI' ? (
                                            <div> Valeur utilisée à l'Étape 2: {assessment.maxCharacteristicDimensionClass}m</div>
                                              ): (
                                            <div> Valeur utilisée à l'Étape 2 : {assessment.maxCharacteristicDimension}m</div>)}
                                          </Tooltip>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vitesse maximales (m/s)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxSpeed}
                    </div>
                  </div> 

          </div>



          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Niveau de robustesse du confinent requis</h2>
            {/* <label className="block text-sm font-medium text-gray-300">
              Val. assessment.iGRC_colIndex={assessment.iGRC_colIndex} | assessment.populationDensityAdjacentArea={assessment.populationDensityAdjacentArea}
            </label> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <label className="block text-sm font-medium text-gray-700">
                      Assemblées en plein air autorisées dans un rayon de 1 km autour du volume OPS
                    </label>
                    {/* //Si maxdim <3m & vmax<35m/s demander si le Sheltering est applicable pour l'UA dans la zone adjacente*/}
                    {assessment.iGRC_colIndex===1
                      ?  (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est considéré comme applicable pour l'UA coinsidéré dans la zone adjacente car 1m UA (&lt;25m/s)
                      </label>
                      ) : assessment.iGRC_colIndex===2 ? (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est-il applicable pour l'UA dans la zone adjacente
                      </label>) : (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est considéré comme non applicable pour l'UA coinsidéré dans la zone adjacente car &gt;3m UA (&gt;35m/s)
                      </label>)
                    }
                    <select
                      value={assessment.OutdoorAssembliesAllowed }
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          OutdoorAssembliesAllowed: e.target
                            .value as OutdoorAssembliesAllowed
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Sélectionner une valeur">
                        Sélectionner une valeur
                      </option>
                      <option value="Assemblies < 40k people">Assemblies &lt; 40k people</option>
                      <option value="Assemblies of 40k to 400k">Assemblies of 40k to 400k</option>
                      <option value="> 400k">&gt; 400k</option>
                    </select>
                    {assessment.iGRC_colIndex===1
                      ?  (
                        <div>{assessment.ShelterApplicable='OUI'}</div>
                      ) : assessment.iGRC_colIndex===2 ? (
                      <select
                      value={assessment.ShelterApplicable }
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          ShelterApplicable: e.target
                            .value as ShelterApplicable
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Sélectionner une valeur">
                        Sélectionner une valeur
                      </option>
                      <option value="OUI">
                        OUI
                      </option>
                      <option value="NON">
                        NON
                      </option>
                    </select>
                      ) : (
                      <div>{assessment.ShelterApplicable='NON'}</div>)
                    }
                  </div>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Niveau de robustesse du confinent requis :
              </label>
                      {Compute_containmentRobustess().startsWith('Out of Scope') ? (
                        <div className="text-grey-600 font-bold">Hors du champ d'application</div>
                      ) : Compute_containmentRobustess().startsWith('ERREUR') ? (
                        <div className="text-purple-600 font-bold">ERREUR : vérifier la complétude des étapes précédantes!</div>
                      ) : Compute_containmentRobustess().startsWith('Faible') ? (
                        <div className="text-yellow-600 font-bold">Faible</div>
                      ) : Compute_containmentRobustess().startsWith('Moyen') ? (
                        <div className="text-orange-600 font-bold">Moyen</div>
                      ) : Compute_containmentRobustess().startsWith('Haut') ? (
                        <div className="text-red-600 font-bold">Haut</div>
                      ) : (
                        <div className="text-green-600 font-bold">Niveau de robustesse du confinent requis : {Compute_containmentRobustess()}</div>
                      )}
            </div>
          </div>


       
       <div className="space-y-8">
         <h2 className="text-2xl font-semibold">Justifications additionnelles</h2>
         <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    
             <div>
               <Tooltip text="En quelques phrases, vous pouvez apporter des commentaires additionnels sur le niveau de SAIL de l'opération envisagée">
                 <label className="block text-sm font-medium text-gray-700">
                   Apporter vos justifications sur le niveau derobustesse du confinent atteint :
                 </label>
               </Tooltip>
               <textarea
                 value={assessment.SAILJustification}
                 onChange={(e) =>
                   onChange({
                     ...assessment,
                     SAILJustification: e.target.value,
                   })}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 rows={4}
               />
             </div>
           
         </div>
       </div>
     </div>
  );
}
