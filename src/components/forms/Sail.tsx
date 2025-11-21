import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo } from '../../types/sora';

interface SailProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function Sail({ assessment, onChange }: SailProps) {
  
 
   const tableData = [
     { GRC_Final:'<=2' ,ARC_a: 'I',   ARC_b: 'II', ARC_c: 'IV', ARC_d: 'VI', }, 
     { GRC_Final:'3'   ,ARC_a: 'II',  ARC_b: 'II', ARC_c: 'IV', ARC_d: 'VI', }, 
     { GRC_Final:'4'   ,ARC_a: 'III', ARC_b: 'III',ARC_c: 'IV', ARC_d: 'VI', }, 
     { GRC_Final:'5'   ,ARC_a: 'IV',  ARC_b: 'IV', ARC_c: 'IV', ARC_d: 'VI', }, 
     { GRC_Final:'6'   ,ARC_a: 'V' ,  ARC_b: 'V' , ARC_c: 'V',  ARC_d: 'VI', },
     { GRC_Final:'7'   ,ARC_a: 'VI',  ARC_b: 'VI', ARC_c: 'VI', ARC_d: 'VI', },
   ];
   // FinalGRCint == Traduction de assessment.GRC_Final en cas équivalent du Tableau d'évaluation SORA :
   let FinalGRCint ='0'
   switch (assessment.GRC_Final) {
    case '1':
         FinalGRCint ='<=2'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 1' 
             assessment.SAILNumber=1;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 2' 
              assessment.SAILNumber=2;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 4' 
              assessment.SAILNumber=4;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '2':
         FinalGRCint ='<=2'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 1' 
              assessment.SAILNumber=1;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 2' 
              assessment.SAILNumber=2;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 4' 
              assessment.SAILNumber=4;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '3':
         FinalGRCint ='3'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 2' 
             assessment.SAILNumber=2;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 2' 
              assessment.SAILNumber=2;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 4' 
              assessment.SAILNumber=4;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
             assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '4':
         FinalGRCint ='4'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 3' 
             assessment.SAILNumber=3;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 3' 
              assessment.SAILNumber=3;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 4' 
              assessment.SAILNumber=4;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '5':
         FinalGRCint ='5'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 4' 
             assessment.SAILNumber=4;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 4' 
              assessment.SAILNumber=4;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 4'
              assessment.SAILNumber=4;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '6':
         FinalGRCint ='6'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 5' 
             assessment.SAILNumber=5;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 5' 
              assessment.SAILNumber=5;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 5' 
              assessment.SAILNumber=5;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '7':
         FinalGRCint ='7'
         switch (assessment.OperationalVolumeLevelMitigated) {
           case 'ARC-a':
             assessment.SAIL = 'SAIL 6' 
             assessment.SAILNumber=6;
             break;
           case 'ARC-b':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;
           case 'ARC-c':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;
           case 'ARC-d':
             assessment.SAIL = 'SAIL 6' 
              assessment.SAILNumber=6;
             break;            
         } 
        break;
    case '8':
         FinalGRCint ='>7'
         assessment.SAIL = 'Certifié' 
          assessment.SAILNumber=7;
        break;
    default:
         FinalGRCint ='0'
         assessment.SAIL = 'Certifié' 
          assessment.SAILNumber=7;
   }
        return (
     <div className="space-y-8">
       <div className="space-y-8">
         <h2 className="text-2xl font-semibold">Détermination du SAIL</h2>

         <table className="min-w-full bg-white">
           <thead>

              <tr className="bg-blue-500 text-white">
                <th className='bg-white  py-2 px-4 border-b'></th>
                <th colspan="4" className='  py-2 px-4 border-b'>ARC Final</th>
              </tr>
             <tr className="bg-blue-500 text-white">
               <th className="bg-blue-400 py-2 px-4 border-b">GRC Final</th>
               <th className="py-2 px-4 border-b">ARC-a</th>
               <th className="py-2 px-4 border-b">ARC-b</th>
               <th className="py-2 px-4 border-b">ARC-c</th>
               <th className="py-2 px-4 border-b">ARC-d</th>
             </tr>
           </thead>
           <tbody>
             {tableData.map((row, index) => (
               <tr className='bg-gray-200'>
                 <th className="bg-blue-400 py-2 px-4 border-b">{row.GRC_Final}</th>

                 
                 
                  <th className={
                     row.GRC_Final.includes(FinalGRCint) && assessment.OperationalVolumeLevelMitigated === 'ARC-a'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
                     ? 'bg-blue-900  text-white'
                     : 'bg-gray-200 text-gray-400'
                  }>{row.ARC_a}    </th>

                  <th className={
                     row.GRC_Final.includes(FinalGRCint) && assessment.OperationalVolumeLevelMitigated === 'ARC-b'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
                     ? 'bg-blue-900 text-white'
                     : 'bg-gray-200 text-gray-400'
                  }>{row.ARC_b}    </th>
                 <th className={
                     row.GRC_Final.includes(FinalGRCint) && assessment.OperationalVolumeLevelMitigated === 'ARC-c'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
                     ? 'bg-blue-900 text-white'
                     : 'bg-gray-200 text-gray-400'
                  }>{row.ARC_c}    </th>
                 <th className={
                     row.GRC_Final.includes(FinalGRCint) && assessment.OperationalVolumeLevelMitigated === 'ARC-d'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
                     ? 'bg-blue-900 text-white'
                     : 'bg-gray-200 text-gray-400'
                  }>{row.ARC_d}    </th>
              </tr> 
             ))}
             <tr>
              <th className="bg-blue-400 py-2 px-4 border-b" >&#62;7</th>
              <th  className={
                     FinalGRCint.includes('>7')
                     ? 'bg-blue-900 text-white'
                     : 'bg-gray-200 text-gray-400'
                  }  colspan="5">Opération en catégorie certifiée</th>
             </tr>
           </tbody>
         </table>
       </div>
       <div className="space-y-8">
         <h2 className="text-2xl font-semibold">Commentaires additionnels</h2>
         <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    
             <div>
               <Tooltip text="En quelques phrases, vous pouvez apporter des commentaires additionnels sur le niveau de SAIL de l'opération envisagée">
                 <label className="block text-sm font-medium text-gray-700">
                   Apporter vos commentaires sur le niveau de SAIL si vous le souhaitez :
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
