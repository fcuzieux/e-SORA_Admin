import React from 'react';
import { SoraForm } from '../../types/sora';
import { RiskAssessmentInfo } from '../../types/sora';
import Logo_EASA from '../../image/EASA_Logo.png';
import Logo_DSAC from '../../image/DSAC_Logo.png';
import Logo_CEDF from '../../image/LOGO_CED_FRANCE.png';

interface SummaryViewProps {
  assessment: RiskAssessmentInfo;
  formData: SoraForm;
  onChange: (assessment: RiskAssessmentInfo) => void;
  showOnly?: Array<keyof RiskAssessmentInfo>;
}

export function SummaryView({ assessment, formData,
  onChange,
  showOnly,}: SummaryViewProps) {
  
 
  return (
    <div className="space-y-8">

      
        <table className="min-w-full bg-grey-500">
           <thead>
              <tr className="bg-grey-500 text-black">
                <th className='bg-white  py-2 px-4 border-b'><br /><img  
                  src={Logo_EASA}
                  alt="Logo_EASA" 
                  className="h-auto mb-6 mx-auto"
                   style={{ width: '50px', height: 'auto' }}
                /> </th>
                <th colspan="3" className='  py-2 px-4 border-b'>
                  Votre dossier SORA est prêt !<br />
                  Demande d’autorisation d’exploitation en catégorie Spécifique<br />
                  {/* A transmettre à :<br />
                  <a href="mailto:dsac-autorisations-drones-bf@aviation-civile.gouv.fr"style={{ textDecoration: 'underline', color: 'blue' }}>
                    dsac-autorisations-drones-bf@aviation-civile.gouv.fr
                  </a>*/}
                </th> 
                <th className='bg-white  py-2 px-4 border-b'><br /><img  
                  src={Logo_CEDF}
                  alt="Logo_CEDF" 
                  className="h-auto mb-6 mx-auto"
                   style={{ width: '100px', height: 'auto' }}
                /></th>
              </tr>
              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> </th>
              </tr>
              <tr className='bg-white  py-2 px-4 border-b'>
                 {/* <th colspan="5" className='py-2 px-4 border-b  text-left font-normal'><strong>Protection des données :</strong> Les données personnelles incluses dans la présente demande sont traitées par la DSAC conformément au <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679"style={{ textDecoration: 'underline', color: 'blue' }}> règlement (UE) 2016/679</a> du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données, et abrogeant la <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A31995L0046&amp;qid=1610371877615"style={{ textDecoration: 'underline', color: 'blue' }}>directive 95/46/CE</a> (règlement général sur la protection des données). Les données personnelles seront traitées aux fins de l'exécution, de la gestion et du suivi de la demande par la DSAC conformément à l'article 12 du  <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019R0947&qid=1625488200702"style={{ textDecoration: 'underline', color: 'blue' }}>règlement (UE) 2019/947</a> du 24 mai 2019 relatif aux règles et procédures applicables à l'exploitation des aéronefs sans équipage à bord. Si le demandeur souhaite obtenir des informations supplémentaires concernant le traitement de ses données à caractère personnel ou exercer ses droits (par exemple, accéder à des données inexactes ou incomplètes ou les rectifier), il peut contacter la DSAC à l’adresse suivante : <a href="mailto:dsac-autorisations-drones-bf@aviation-civile.gouv.fr"style={{ textDecoration: 'underline', color: 'blue' }}>dsac-autorisations-drones-bf@aviation-civile.gouv.fr</a>. Le demandeur a le droit de déposer à tout moment une plainte concernant le traitement de ses données personnelles auprès de la Commission Nationale de l’Informatique et des Libertés (CNIL) : <a href="https://www.cnil.fr/fr"style={{ textDecoration: 'underline', color: 'blue' }}>https://www.cnil.fr/fr</a></th> */}
                 <th colspan="5" className='py-2 px-4 border-b  text-left font-normal'><strong>Protection des données :</strong> Les données personnelles incluses dans la présente demande sont traitées par les Centres d'essais dans un cadre strict de protection des données. Les données personnelles seront traitées aux fins de l'exécution, de la gestion et du suivi de la demande. Si le demandeur souhaite obtenir des informations supplémentaires concernant le traitement de ses données à caractère personnel ou exercer ses droits (par exemple, accéder à des données inexactes ou incomplètes ou les rectifier), il peut contacter le responsable des vols du ou des centres d'essais concernés par l'opération.</th>
              </tr>
              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> </th>
              </tr>
              <tr className='bg-white  py-2 px-4 border-b  border-black'>
                 <th colspan="2" className='py-2 px-4 border-b text-left font-normal'>☑ Nouvelle demande</th>
                 <th colspan="2" className='py-2 px-4 border-b text-left  text-blue-100 font-normal'>☐ Modification de l'autorisation d'exploitation :</th>
                 <th colspan="1" className='py-2 px-4 border-b text-left font-normal text-blue-100 bg-[#f9fbff]'>n° de l'AE à modifier</th>
              </tr>
              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> 1. Données concernant l'exploitant d'UAS</th>
              </tr>
              <tr>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 1.1 Numéro d'enregistrement de l'exploitant UAS</th>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> {formData.operator.registrationNumber}</th>
              </tr>
               <tr>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 1.2 Nom de l'exploitant UAS</th>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> {formData.operator.name}</th>
              </tr>
               <tr>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 1.3 Nom du dirigeant responsable</th>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'>{formData.operator.managerName}</th>
              </tr>
              
              <tr>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 1.4 Point de contact opérationnel 
                  <ul>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Nom</li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Téléphone</li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Courrielt</li>
                  </ul>
                </th>
                <th colspan="2" className='py-2 px-4 border-b  text-left font-normal bg-[#f9fbff]'> &nbsp;
                  <ul>
                    <li> {formData.operator.operationalContact}</li>
                    <li> {formData.operator.phone}</li>
                    <li> {formData.operator.email}</li>
                  </ul></th>
              </tr> 

              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> 2. Détails concernant l'opération UAS</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.1 Date prévue de début de l'opération</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> {formData.operator.startDate}</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.2 Date de fin prévue</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> {formData.operator.endDate}</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.3 Lieu(x) prévu(s) de l'opération</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> {formData.operator.locations}</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.4 Référence et révision de l'évaluation des risques</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> &nbsp;&nbsp;&nbsp;☑ SORA 2.5 <br /> <b className='py-2 px-4 border-b text-left  text-blue-100 font-normal'>☐ PDRA # ____ ☐ autre</b></th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.5 Niveau d'assurance et d'intégrité (SAIL)</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left bg-[#f9fbff]'> {formData.riskAssessment.SAIL}</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.6 Type d'opération</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> ☑ Vol en vue(VLOS) </th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> ☐ Vol en vue Etendue (EVLOS) </th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> ☐ Vol hors vue(BVLOS) </th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.7 Transport de marchandises dangereuses</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> ☑ Oui &nbsp;&nbsp;&nbsp; ☐ Non</th>
              </tr>
                                
              <tr>
                <th  colspan="1" rowspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>2.8 Caractérisation des risques au sol</th>
              </tr>
              <tr>
                <td colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>
                  2.8.1 Zone d'exploitation
                </td>
                <td colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'>
                  VAL
                </td>
              </tr>
              <tr>
                <td colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>
                  2.8.2 Zone adjacente
                </td>
                <td colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'>
                  VAL
                </td>
              </tr>

              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.9 Limite supérieure du volume d'exploitation</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.10 Classe d'espace aérien de l'opération envisagée</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>



                 
              <tr>
                <th  colspan="1" rowspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>2.11 Niveau de risque aérien résiduel</th>
              </tr>
              <tr>
                <td colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>
                  2.11.1 Volumed'exploitation
                </td>
                <td colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'>
                  ☑ARC-a&nbsp;&nbsp;&nbsp;☐ARC-b&nbsp;&nbsp;&nbsp;☐ARC-c&nbsp;&nbsp;&nbsp;☐ARC-d
                </td>
              </tr>
              <tr>
                <td colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'>
                  2.11.2. V olume adjacent
                </td>
                <td colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'>
                  ☑ARC-a&nbsp;&nbsp;&nbsp;☐ARC-b&nbsp;&nbsp;&nbsp;☐ARC-c&nbsp;&nbsp;&nbsp;☐ARC-d
                </td>
              </tr>    


              
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 2.12 Référence du manuel d'exploitation</th>
                <th colspan="3" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>

              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 2.13 Référence du dossier de démonstration de conformité</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>

{/* //============================================================================= */}
              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> 3. Données concernant l'UAS ou les UAS</th>
              </tr>

              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.1 Constructeur</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.2 Modèle</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.3 Type d'UAS</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> VAL</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.4 Dimensions caractéristiques maximales</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> _____ m</th>
              </tr>
              
              <tr>
                <th colspan="2" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.5 Masse au décollage</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> _____ kg</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#d9e2f3]'> 3.6 Vitesse maximale</th>
                <th colspan="1" className='py-2 px-4 border-b border-black text-left font-normal bg-[#f9fbff]'> _____ m/s (_____ kt)</th>
              </tr>

              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.7 Numéro de série ou, le cas échéant, immatriculation</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.8 Certificat de type (TC) ou rapport de vérification de la conception, le cas échéant</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.9 Numéro du certificat de navigabilité (CdN), le cas échéant</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.10 Numéro du certificat de puissance acoustique, le cas échéant</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.11 Atténuation des effets de l'impact au sol (M2)</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> 3.12 Exigences techniques pour le confinement</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> VAL</th>
              </tr>

{/* //============================================================================= */}
              <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> 4. Remarques</th>
              </tr>
              <tr>
                <th colspan="5" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> 
                  <textarea
                          //value={assessment.iGRC_Justification}
                          // onChange={(e) =>
                          //   onChange({
                          //     ...assessment,
                          //     iGRC_Justification: e.target.value,
                          //   })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={4}
                        />
                </th>
              </tr>


{/* //============================================================================= */}
              {/* <tr className="bg-gray-300 text-black">
                <th colspan="5" className='  py-2 px-4 border-b'> Déclaration de conformité</th>
              </tr>
              <tr>
                <th colspan="5" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'>Je, soussigné, déclare par la présente que l’opération UAS se conformera :<br />
                  -A toute réglementation européenne et nationale applicable en matière de vie privée, de protection des données, deresponsabilité, d'assurance, de sécurité et de protection de l'environnement ;<br />
                  -Aux exigences du règlement (UE) 2019/947; et<br />
                  -Aux limitations et conditions définies dans l’autorisation d’exploitation fournie par l’autorité compétente.<br />
                  En outre, je déclare que la couverture d'assurance correspondante, si elle est exigible, sera en place à la date de début de l’opération UAS.<br /></th>
              </tr>
              <tr>
                <th colspan="2" className='py-2 px-4 border-b text-left font-normal bg-[#d9e2f3]'> Date
JJ/MM/AAAA</th>
                <th colspan="3" className='py-2 px-4 border-b text-left font-normal bg-[#f9fbff]'> Signature</th>
              </tr> */}





           </thead>
        </table>



      <div className="text-sm text-gray-600 mt-8">
        <p>Vous pouvez maintenant télécharger votre dossier SORA complet en cliquant sur le bouton ci-dessous.</p>
      </div>
    </div>
  );
}

 export default SummaryView;