import React, { useRef, useState } from 'react';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  RiskAssessmentInfo,
  DroneInfo,
  OperationInfo,
  assessmentTypeHauteurVol,
  assessmentCriticalArea,
  assessmentGRB,
  assessmentContingencyVolume,
  assessmentiGRC,
  PopulationDensityModulation,
  PopulationDensityDataBase,
  SailLevel,
  OperationalScenario,
  PopulationDensity,
  iGRC,
  ObstaclesModulation,
  GlidingCapability,
  HighImpactAngle,
  DetailedJarusModel,
  UasType,
} from '../../types/sora';

import { Tooltip } from '../common/Tooltip';
import { Upload, Clock, Pi } from 'lucide-react';
import { RiskAssessmentMap } from './RiskAssessmentMap';
import DefinitionOfVolumes from '../../image/DefinitionOfVolumes.png';
import DefinitionOfFootprints from '../../image/DefinitionOfFootprints.png';
import JARUSorHIModel from '../../image/JARUSorHIModel.png';
import JARUSorHIModel_AC from '../../image/JARUSorHIModel_AC.png';
import JARUSorHIModel_HC_High from '../../image/JARUSorHIModel_HC_High.png';
import JARUSorHIModel_HC_Low from '../../image/JARUSorHIModel_HC_Low.png';
import AdjacenteArea from '../../image/AdjacenteArea.png';
import { HelpCircle } from 'lucide-react';

interface RiskAssessmentFormProps {
  assessment: RiskAssessmentInfo;
  drone: DroneInfo;
  operation: OperationInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
  showOnly?: Array<keyof RiskAssessmentInfo>;
}

// export function GroundRiskInitial({
export function GroundRiskInitial({
  assessment,
  drone,
  operation,
  onChange,
  showOnly,
}: RiskAssessmentFormProps) {

  const tableiGRCData = [
    { PopDensity: 'Zone Contrôlée', MaxdimCS1: '1',MaxdimCS2: '1',MaxdimCS3: '2',MaxdimCS4: '3',MaxdimCS5: '3' },
    { PopDensity: '<5',             MaxdimCS1: '2',MaxdimCS2: '3',MaxdimCS3: '4',MaxdimCS4: '5',MaxdimCS5: '6' },
    { PopDensity: '<50',            MaxdimCS1: '3',MaxdimCS2: '4',MaxdimCS3: '5',MaxdimCS4: '6',MaxdimCS5: '7' },
    { PopDensity: '<500',           MaxdimCS1: '4',MaxdimCS2: '5',MaxdimCS3: '6',MaxdimCS4: '7',MaxdimCS5: '8' },
    { PopDensity: '<5,000',         MaxdimCS1: '5',MaxdimCS2: '6',MaxdimCS3: '7',MaxdimCS4: '8',MaxdimCS5: '9' },
    { PopDensity: '<50,000',        MaxdimCS1: '6',MaxdimCS2: '7',MaxdimCS3: '8',MaxdimCS4: '9',MaxdimCS5: '10' },
    { PopDensity: '>50,000',        MaxdimCS1: '7',MaxdimCS2: '8',MaxdimCS3: 'Not part of Sora',MaxdimCS4: 'Not part of Sora',MaxdimCS5: 'Not part of Sora' },
  ];

// let iGRC_colIndex =0
   
//     if (assessment.maxCharacteristicDimension <= 1.0) {
//       if (assessment.maxSpeed <= 25.0) {
//         iGRC_colIndex = 1;
//       } else if (assessment.maxSpeed <= 35.0) {
//         iGRC_colIndex = 2;
//       } else if (assessment.maxSpeed <= 75.0) {
//         iGRC_colIndex = 3;
//       } else if (assessment.maxSpeed <= 150.0) {
//         iGRC_colIndex = 4;
//       } else if (assessment.maxSpeed <= 200.0) {  
//         iGRC_colIndex = 5;
//       }  else {
//         iGRC_colIndex = 6;
//       }
//     } else if (assessment.maxCharacteristicDimension <= 3.0) {
//       if (assessment.maxSpeed <= 35.0) {
//         iGRC_colIndex = 2;
//       } else if (assessment.maxSpeed <= 75.0) {
//         iGRC_colIndex = 3;
//       } else if (assessment.maxSpeed <= 150.0) {
//         iGRC_colIndex = 4;
//       } else if (assessment.maxSpeed <= 200.0) {  
//         iGRC_colIndex = 5;
//       }  else {
//         iGRC_colIndex = 6;
//       }
//     } else if (assessment.maxCharacteristicDimension <= 8.0) {
//       if (assessment.maxSpeed <= 75.0) {
//         iGRC_colIndex = 3;
//       } else if (assessment.maxSpeed <= 150.0) {
//         iGRC_colIndex = 4;
//       } else if (assessment.maxSpeed <= 200.0) {  
//         iGRC_colIndex = 5;
//       }  else {
//         iGRC_colIndex = 6;
//       }
//     } else if (assessment.maxCharacteristicDimension <= 20.0) {
//       if (assessment.maxSpeed <= 150.0) {
//         iGRC_colIndex = 4;
//       } else if (assessment.maxSpeed <= 200.0) {  
//         iGRC_colIndex = 5;
//       }  else {
//         iGRC_colIndex = 6;
//       }
//     } else if (assessment.maxCharacteristicDimension <= 40.0) {
//       if (assessment.maxSpeed <= 200.0) {  
//         iGRC_colIndex = 5;
//       }  else {
//         iGRC_colIndex = 6;
//       }
//     } else {
//       iGRC_colIndex = 6;
//     }
//     assessment.iGRC_colIndex = iGRC_colIndex;
   const ComputeiGRC_colIndex = () => {

    let iGRC_colIndex =0
    let maxCharacteristicDimensionClass = assessment.maxCharacteristicDimension;
    if (assessment.UsemaxCharacteristicDimension === 'OUI') {
      maxCharacteristicDimensionClass = assessment.maxCharacteristicDimensionClass;
    }
    if (maxCharacteristicDimensionClass <= 1.0) {
        if (assessment.maxSpeed <= 25.0) {
          iGRC_colIndex = 1;
        } else if (assessment.maxSpeed <= 35.0) {
          iGRC_colIndex = 2;
        } else if (assessment.maxSpeed <= 75.0) {
          iGRC_colIndex = 3;
        } else if (assessment.maxSpeed <= 150.0) {
          iGRC_colIndex = 4;
        } else if (assessment.maxSpeed <= 200.0) {  
          iGRC_colIndex = 5;
        }  else {
          iGRC_colIndex = 6;
        }
      } else if (maxCharacteristicDimensionClass <= 3.0) {
        if (assessment.maxSpeed <= 35.0) {
          iGRC_colIndex = 2;
        } else if (assessment.maxSpeed <= 75.0) {
          iGRC_colIndex = 3;
        } else if (assessment.maxSpeed <= 150.0) {
          iGRC_colIndex = 4;
        } else if (assessment.maxSpeed <= 200.0) {  
          iGRC_colIndex = 5;
        }  else {
          iGRC_colIndex = 6;
        }
      } else if (maxCharacteristicDimensionClass <= 8.0) {
        if (assessment.maxSpeed <= 75.0) {
          iGRC_colIndex = 3;
        } else if (assessment.maxSpeed <= 150.0) {
          iGRC_colIndex = 4;
        } else if (assessment.maxSpeed <= 200.0) {  
          iGRC_colIndex = 5;
        }  else {
          iGRC_colIndex = 6;
        }
      } else if (maxCharacteristicDimensionClass <= 20.0) {
        if (assessment.maxSpeed <= 150.0) {
          iGRC_colIndex = 4;
        } else if (assessment.maxSpeed <= 200.0) {  
          iGRC_colIndex = 5;
        }  else {
          iGRC_colIndex = 6;
        }
      } else if (maxCharacteristicDimensionClass <= 40.0) {
        if (assessment.maxSpeed <= 200.0) {  
          iGRC_colIndex = 5;
        }  else {
          iGRC_colIndex = 6;
        }
      } else {
        iGRC_colIndex = 6;
      }
      let UsemaxCharacteristicDimension = assessment.UsemaxCharacteristicDimension;
      console.error({UsemaxCharacteristicDimension, iGRC_colIndex });
      assessment.iGRC_colIndex = iGRC_colIndex;
      assessment.iGRCControledZone=parseInt(tableiGRCData.at(0)?.[`MaxdimCS${iGRC_colIndex}`]);
      // let tmp= assessment.iGRCControledZone;
      // console.error({tmp});
    
      return iGRC_colIndex;
   }
// ==============================
// CRITICAL AREA SECTION
//
// 1) JARUS Critical Area Calculation
    const CalculJARUSCriticalArea = () => {
    let Ac = Number(5);
    let rPerson = 0.3;
    let rD=rPerson+assessment.maxCharacteristicDimension/2.0;
    let Modulation=1.0;
    if (assessment.ObstaclesModulation === 'OUI') {
      Modulation=0.6;
    } else {
      Modulation=1.0;
    }
    if (assessment.maxCharacteristicDimension<=1.0) {
      Ac = 2.0*rD*assessment.dGlide+Math.PI*Math.pow(rD, 2);
    } else if (assessment.maxCharacteristicDimension<8.0) {
      Ac = Modulation*(2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD);
    } else if (assessment.maxCharacteristicDimension>=8.0) {
      Ac = 2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD;
    }
//    Ac = 2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD;
    assessment.CriticalArea = parseFloat(Ac.toFixed(2));
    return parseFloat(Ac.toFixed(2));
    }

// ==============================
  const AdviceThetaGlide = () => {
    if (assessment.maxCharacteristicDimension<=1.0) {
      //assessment.ThetaGlide = 35.0;
      return 35.0;
    } else {
      //assessment.ThetaGlide = 10.0;
      return 10.0;    
    }
  }
// ==============================
  const AdvicedSlideReduced = () => {
    if (assessment.DetailedJarusModel == 'OUI') {
      // Non-lethal kinetic energy limit : (290.0 J)
      let Knonlethal =290.0;
      //velocity_min_kill = np.sqrt(2 * lethal_kinetic_energy / aircraft.mass)
      let vnonlethal    = Math.sqrt(2 * Knonlethal /assessment.MTOW);
      // Coefficient of restitution 0.8 //0.65
      let coefficient_of_restitution=0.65;//-0.42*(assessment.ThetaGlide-10.0)/70.0;
      // horizontal_speed_from_angle =  np.fabs(  np.cos(np.radians(impact_angle            ))) * impact_speed
      let vhorizontale               = Math.abs(Math.cos(assessment.ThetaGlide*Math.PI/180.0))  * assessment.maxSpeed;
      // if (assessment.maxCharacteristicDimension>1.0) {
      //   let Vglide = assessment.maxSpeed*0.65;
      //   vhorizontale = Vglide;
      // }
      // Coefficient of friction 0.75 au lieu de 0.6
      let Cg = 0.75;
      let GRAVITY = 9.81;
      let acceleration = Cg * GRAVITY;
      // t_safe = (aircraft.coefficient_of_restitution * horizontal_impact_speed - velocity_min_kill) / acceleration
      let tsafe = Math.max((coefficient_of_restitution          * vhorizontale            - vnonlethal       ) / acceleration,0.0);
      // slide_distance_non_lethal = (aircraft.coefficient_of_restitution * horizontal_impact_speed * t_safe) - (0.5 * acceleration * t_safe * t_safe)
      let dslide_reduced           = (coefficient_of_restitution          * vhorizontale            * tsafe ) - (0.5 * acceleration * tsafe  * tsafe );
      assessment.dSlideReduced = parseFloat(dslide_reduced.toFixed(2));
      assessment.vnonlethal = parseFloat(vnonlethal.toFixed(4));
      assessment.vhorizontale = parseFloat(vhorizontale.toFixed(4));
      assessment.tsafe = parseFloat(tsafe.toFixed(4));
      return assessment.dSlideReduced;
    } else {
      return 0.0;
    }
  }
// ==============================
  const AdvicedGlide = () => {
    let hPerson = 1.8;
    if (assessment.DetailedJarusModel == 'OUI') {
      assessment.dGlide=parseFloat((hPerson / Math.tan(assessment.ThetaGlide * Math.PI / 180.0)).toFixed(2));
      return parseFloat(assessment.dGlide.toFixed(2));
      
    } else {
      return 0.0;
    }
  }
    
// 2) High Impact Angle Calculation
    const computeFrontalArea = () => {
      let A = Number(1);
      if (assessment.maxCharacteristicDimension <= 1.0) {
        A=0.1;
      } else if (assessment.maxCharacteristicDimension <= 3.0) {
        A= 0.2*assessment.maxCharacteristicDimension - 0.1;
      } else if (assessment.maxCharacteristicDimension <= 8.0) {
        A= 0.4*assessment.maxCharacteristicDimension - 0.7; 
      } else if (assessment.maxCharacteristicDimension <= 20.0) {
        A= 0.8333*assessment.maxCharacteristicDimension - 4.1667;
      } else if (assessment.maxCharacteristicDimension <= 40.0) {
        A= 0.625*assessment.maxCharacteristicDimension;
      } else {
        A= 25.0; // Default value for very large UAs
      }
      return A;
    }
    const CalculCriticalArea_HAI = () => {
      let CA= Number(1);  
      let GRAVITY = 9.81; // m/s²
      let rho = 1.225; // kg/m³ (density of air at sea level)
      let A = computeFrontalArea(); // m² (frontal area of the UA, can be adjusted based on the UA's dimensions)
      let Cd = 0.8; // Drag coefficient (fixed as per Annex F)
      let Vterminal = Math.sqrt(2 * assessment.MTOW * GRAVITY / (rho*A*Cd)); // Terminal velocity
      let Ek_terminal = 0.5 * assessment.MTOW * Math.pow(Vterminal, 2); // Kinetic energy at terminal velocity
 
      let Fs = 1.4*Math.pow(Ek_terminal,0.2); // Safety factor
            if (Ek_terminal < 12000) {
              Fs =2.3;
            } else if (Ek_terminal > 3125000) {
              Fs =7.0;
            }
// 𝐴𝑐=𝐹𝑠∗𝜋∗𝑟𝐷2
      let rPerson = 0.3; // Radius of a person in meters
      let rD = rPerson + assessment.maxCharacteristicDimension / 2.0; // Radius of the drone
      CA = Fs * Math.PI * Math.pow(rD, 2); // Critical Area calculation
      assessment.CriticalArea = parseFloat((CA).toFixed(2));
      console.error({ CA });
      return CA;
    }
    const CalculImpactAngle = () => {
  //   ANNEX 1: Impact angle – mathematical model
  // The UA begins its descent from an initial Vertical Distance fixed at zero [m] (or Height [m]) at a maximum forward speed [m/s] = V(0) (=maximum cruise speed).
  // i.e. we put the origin of the axes at the height of the UA when it begins its descent.
  // So vertical distance (0) = 0.  
  // The iteration ends when the vertical distance (t) = - height (when the UA touches the ground).
  // (Note that the vertical velocity < 0)
      //let V0= assessment.maxSpeed;
      let Mass= assessment.MTOW;
      let Velocity_t0 = Number(0); // Initial velocity at time t-1
      //VerticalDistance
      let VD_t0 = Number(0);
      let VD_t1 = Number(0);
      let HD_t0 = Number(0); // Horizontal Distance at time t-1
      let HD_t1 = Number(0); // Horizontal Distance at time t
      //Vertical Velocity
      let VV_t0 = Number(0);
      let VV_t1 = Number(0);
      //Horizontal Velocity
      let HV_t0 = assessment.maxSpeed; // Initial horizontal velocity
      let HV_t1 = Number(0);
    // Model Parameters :
      let dt=Number(0.1); // Time step in seconds    
      let GRAVITY = 9.81; // m/s²
      let rho = 1.225; // kg/m³ (density of air at sea level)
      let A = 0.7; // m² (frontal area of the UA, can be adjusted based on the UA's dimensions)
      let Cd = 0.8; // Drag coefficient (fixed as per Annex F)
      let DragForce_t0 = Number(0); // Drag Force at time t-1
      let DragForceH_t0 = Number(0); // Drag Force Horizontal at time t-1
      let DragForceV_t0 = Number(0); // Drag Force Vertical at time t-1
      let ThetaImpactDeg =Number(0);  // Impact angle in degrees at time t
      let Ek= Number(0); // Kinetic Energy at time t-1
  // We calculate at each step of the iteration:
  // HV_t1 = HV_t0+Drag-force-hiorizontal_t0*dt/m
  // VV_t1 = VV_t0-[GRAVITY-Drag-force-vertical_t0/m]*dt
  // Where
  // Drag Force horizontal (t−1)=cos Θ (t−1)∗ Drag Force (t−1)
  // Drag Force vertical (t−1)=sin Θ (t−1) ∗ Drag force (t−1)
  // Drag Force (t-1) = 0.5 .ϱ .𝑉 (𝑡−1)2 . 𝐴 .𝐶𝑑
  // Where: A is the frontal area of the UA expressed in m ² as per Annex F,
  // Cd = 0.8 (fixed as per Annex F),
  // ϱ = density of air and g= gravity
  // As
  // V (t)=√Vhorizontal (t)2+V vertical (t)²    
  // Tg Θ(t) =V vertical (t)/V horizontal (t)
  // We calculate: Θ (t)=Arctg V vertical (t)/V horizontal (t)
      let ThetaImpact = Number(0); // Impact angle at time t
      let timeofimpact = Number(0); // Time of impact
      // Initialize an array to store the values
      const results = [];
      //while (VD_t1 >= -assessment.MinOperationalAltitude) {
      for (let t = 0; VD_t1 >= -assessment.MinOperationalAltitude; t += dt) {
      // We calculate: Θ (t-1)=Arctg (V vertical (t-1)/V horizontal (t-1)) 
        ThetaImpact = Math.atan2(VV_t0, HV_t0);
        // Calculate Velocity at time t-1
        Velocity_t0= Math.sqrt(Math.pow(HV_t0, 2) + Math.pow(VV_t0, 2));

        // Claculate drag Force at time t-1
        DragForce_t0 = - 0.5 * rho * Math.pow(Velocity_t0, 2) * A * Cd;
        // Calculate Drag Force Horizontal and Vertical at time t-1
        DragForceH_t0 = Math.cos(ThetaImpact) * DragForce_t0;
        DragForceV_t0 = Math.sin(ThetaImpact) * DragForce_t0;
        ThetaImpactDeg = ThetaImpact * (180 / Math.PI); // Convert to degrees
        // Calculate Kinetyic Energy at time t-1
        Ek = 0.5 * Mass * Math.pow(Velocity_t0, 2);
        // Store the values in the results array
        results.push({
          t,
          HV_t0,
          VV_t0,
          Velocity_t0,
          ThetaImpactDeg,
          HD_t0,
          VD_t0,
          DragForce_t0,
          DragForceH_t0,
          DragForceV_t0,
          Ek
        });
        // Update Horizontal and Vertical Velocities
        HV_t1 = HV_t0 + (DragForceH_t0 / Mass) * dt;
        VV_t1 = VV_t0 - (GRAVITY - (DragForceV_t0 / Mass)) * dt;
        // Update Vertical Distance
        VD_t1 = VD_t0 + 0.5*(VV_t0+VV_t1) * dt;
        // Update Horizontal Distance
        HD_t1 = HD_t0 + 0.5*(HV_t0+HV_t1) * dt;

        // Prepare for next iteration
        VD_t0 = VD_t1;
        HD_t0 = HD_t1;
        VV_t0 = VV_t1;
        HV_t0 = HV_t1;
        timeofimpact=t;
      }
      // Update the assessment with the calculated impact angle
      assessment.ThetaImpact = parseFloat((ThetaImpactDeg).toFixed(2));
      console.error({ ThetaImpactDeg, results }); // Log the impact angle and results for debugging

      return [ThetaImpactDeg, results];
    }
// ==============================
// GLIDING CAPABILITY SECTION
    const handleOnChangeGlidingCapability = (e) => {
      onChange({
        ...assessment,
        GlidingCapability: e.target
          .value as GlidingCapability,
          assessmentGRB: e.target.value === 'NON' ? "Approche Simplifiée, Règle 1:1" : assessment.assessmentGRB,
      });
    }

// ==============================
// GRB SECTION
    const CalulGRB =() =>{
      let GRB = Number(1);
      let GRAVITY = 9.81;
      let Vwind=assessment.VwindParachute;//assessment.environmentalLimitations.maxGustSpeed;
      

      
      if (assessment.assessmentGRB === 'Approche Simplifiée, Règle 1:1') {
        GRB =assessment.ContingencyVolumeHeight+0.5*assessment.maxCharacteristicDimension;
      } else if (assessment.assessmentGRB === 'Approche Balistique (Hélicoptère ou Multirotor)') {
        GRB =assessment.maxSpeed*Math.sqrt(2*assessment.ContingencyVolumeHeight/GRAVITY) +0.5*assessment.maxCharacteristicDimension;
      } else if (assessment.assessmentGRB === 'Terminaison Aile Fixe') {
        GRB =assessment.ContingencyVolumeHeight/Math.tan(assessment.ThetaGlide*Math.PI/180.0);

      } else if (assessment.assessmentGRB === 'Terminaison avec parachute') {
        GRB =assessment.maxSpeed*assessment.ParachuteTime+Vwind*assessment.ContingencyVolumeHeight/assessment.VzParachute;   //+0.5*assessment.maxCharacteristicDimension;
      } else  {
        GRB =0.0;

      }
      assessment.GRBWidth = parseFloat(GRB.toFixed(2));
      return parseFloat(GRB.toFixed(2));
    }    
// Fixed Wing Power Off : Automated switch to GRB assessment with simplified 1:1 approach
    const handleOnChangeFixedWingPowerOff = (e) => {
      const isChecked = e.target.checked;
      onChange({
        ...assessment,
        GRB_FixedWingPowerOff: isChecked ? 'ACTIVATED' : 'NONACTIVE',
        assessmentGRB:"Approche Simplifiée, Règle 1:1",
      });
    };

    const GRB_FixedWingPowerOffActivationbydefault=() => {
      assessment.GRB_FixedWingPowerOff = 'ACTIVATED'
      return true;
    }
// ==============================
// ADJACENT VOLUME SECTION
    const CalculAdjacentVolumeWidth = () => {
      let AdjacentVolumeWidth = Number(1);
      if (assessment.AdjacentVolumeWidthEqualMaxRange === 'OUI') {
        AdjacentVolumeWidth=3*60.0*assessment.maxSpeed*1.0;
      } else {
        AdjacentVolumeWidth=Math.max(3*60.0*assessment.maxSpeed*1.0,5000.0); // Minimum width of 5000 m
        AdjacentVolumeWidth=Math.min(AdjacentVolumeWidth,35000.0); // Minimum width of 35000 m
      }
      assessment.AdjacentVolumeWidth = parseFloat((AdjacentVolumeWidth).toFixed(1));
      return parseFloat((AdjacentVolumeWidth).toFixed(1));
    }

    const CalculAdjacentVolumeHeight = () => {
      let AdjacentVolumeHeight = Number(1);
      AdjacentVolumeHeight = assessment.ContingencyVolumeHeight+150.0; 
      assessment.AdjacentVolumeHeight = parseFloat((AdjacentVolumeHeight).toFixed(1));
      return parseFloat((AdjacentVolumeHeight).toFixed(1));
    }

// ==============================
// CONTINGENCY VOLUME SECTION
    const CalculContingencyVolumeWidth = (SGPS,Spos,SK,SRZ,SCM) => {
      let SCV = Number(1);
      //assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM
      SCV=SGPS+Spos+SK+SRZ+SCM;
      assessment.ContingencyVolumeWidth = parseFloat((SCV).toFixed(1));
      return parseFloat((SCV).toFixed(1));
    }
  
    const CalculContingencyVolumeHeight = (Hbaro,HRZ,HCM) => {
      let HCV = Number(1);
      //assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM
      HCV=Hbaro+HRZ+HCM+assessment.FlightGeographyHeight;
      assessment.ContingencyVolumeHeight = parseFloat((HCV).toFixed(1));
      return parseFloat((HCV).toFixed(1));
    }
  //Contigency Maneuvre Volume
    const CalculVolumeSCM = () => {
      let SCM = Number(1);
      let HCM = Number(1);
      let GRAVITY = 9.81;
    // | 'Avion'
    // | 'Hélicoptère'
    // | 'Multirotor'
    // | 'Hybride/VTOL'
    // | "Plus léger que l'air"
    // | 'Autre';
    // ContingencyVolumeSCM: assessment.ParachuteTime*assessment.maxSpeed, 
    // ContingencyVolumeHCM: parseFloat((assessment.ParachuteTime*0.7*assessment.maxSpeed).toFixed(2)) , 
      if (assessment.ContingencyParachuteManeuver === 'OUI') {
        SCM = assessment.ParachuteTime*assessment.maxSpeed;
        HCM = parseFloat((assessment.ParachuteTime*0.7*assessment.maxSpeed).toFixed(2));
      } else {
        if (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL' || assessment.uasType === "Plus léger que l'air") {
          SCM = assessment.maxSpeed*assessment.maxSpeed/(GRAVITY*Math.tan(assessment.PhiMaxPlane*Math.PI/180.0));
          HCM = 0.3*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
          //Cas 2 based on Maximum Turn Rate :
          //SCM = 0.5*assessment.maxSpeed*(90.0/assessment.turnRate);
        } else if (assessment.uasType === 'Hélicoptère' || assessment.uasType === 'Multirotor') {
          SCM = 0.5*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY*Math.tan(assessment.ThetaStopCopter*Math.PI/180.0));
          HCM = 0.5*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
        } else if (assessment.uasType === 'Autre') {
          SCM = 0.5*assessment.maxSpeed*(90.0/assessment.turnRate);
          HCM = 0.3*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
        } else {  
          SCM = 0 / 0;
        }
        assessment.ContingencyVolumeSCM = parseFloat(SCM.toFixed(2));
        assessment.ContingencyVolumeHCM = parseFloat(HCM.toFixed(2));
        return [SCM, HCM];
      }
    }

//  const ACtable = () => {
//     let AcFromTable = Number(8);
//     if (assessment.maxCharacteristicDimension<=1.0) {
//       AcFromTable = 8;
//     } else if (assessment.maxCharacteristicDimension<=3.0) {
//       AcFromTable = 80;
//     } else if (assessment.maxCharacteristicDimension<=8.0) {
//       AcFromTable = 800;
//     } else if (assessment.maxCharacteristicDimension<=20.0) {
//       AcFromTable = 8000;
//     } else if (assessment.maxCharacteristicDimension<=40.0) {
//       AcFromTable = 80000.0;
//     } else {AcFromTable = 80000.0;}
//     assessment.NominalCriticalArea = AcFromTable;
//     return AcFromTable;
//   };
// ==============================
// CHARACTERISTIC DIMENSION CLASSIFICATION SECTION
  const CalculmaxCharacteristicDimensionClass = () => {
    let MaxdimClass=Number(1);
    if (assessment.CriticalArea <= 6.5) {
      MaxdimClass= 1;
    } else if (assessment.CriticalArea <= 65.0) {
      MaxdimClass= 3;
    } else if (assessment.CriticalArea <= 650.0) {
      MaxdimClass= 8;
    } else if (assessment.CriticalArea <= 6500.0) {
      MaxdimClass= 20;
    } else if (assessment.CriticalArea <= 65000.0) {
      MaxdimClass= 40;
    } else {
      MaxdimClass= 40; // For very large UAs
    }
    assessment.maxCharacteristicDimensionClass = MaxdimClass;
    return MaxdimClass;
  }
// ==============================
// THRESHOLD AC SECTION 
 const ThresholdACtable = () => {
    let AcFromTable = Number(6.5);
    if (assessment.maxCharacteristicDimension<=1.0) {
      AcFromTable = 6.5;
    } else if (assessment.maxCharacteristicDimension<=3.0) {
      AcFromTable = 65;
    } else if (assessment.maxCharacteristicDimension<=8.0) {
      AcFromTable = 650;
    } else if (assessment.maxCharacteristicDimension<=20.0) {
      AcFromTable = 6500;
    } else if (assessment.maxCharacteristicDimension<=40.0) {
      AcFromTable = 65000.0;
    } else {AcFromTable = 65000.0;}
    assessment.NominalCriticalArea = AcFromTable;
    return AcFromTable;
  };


// ==============================
// HANDLE FILES SECTION:
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const DroserafileInputRef = useRef<HTMLInputElement>(null);

    // const handleDroseraOutputFileChange = async (
    // event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    // const files = event.target.files;
    // if (files) {
    // const newFile = files[0]; // Prendre le premier fichier seulement
    // onChange({ ...assessment, droseraOutputFile: [newFile] });
    // }
    
    // };

// ==============================
// DROSERA SECTION:
  const handleDroseraOutputFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFile = files[0]; // Prendre le premier fichier seulement

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content:', content); // Log the file content

        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        console.log('Parsed document:', doc); // Log the parsed document

        // Find the <h2>Population</h2> element by iterating over all <h2> elements
        const h2Elements = doc.querySelectorAll('h2');
        let populationHeader = null;

        for (const h2 of h2Elements) {
          if (h2.textContent === 'Population') {
            populationHeader = h2;
            break;
          }
        }

        //console.log('Population header:', populationHeader); // Log the population header
        if (populationHeader) {
          // Find the next sibling element which is a table
          const nextSibling = populationHeader.nextElementSibling;
          //console.log('Next sibling:', nextSibling); // Log the next sibling

          if (nextSibling && nextSibling.tagName === 'TABLE') {
            // Convert the table to a string
            const tableString = nextSibling.outerHTML;
            //console.log('Table string:', tableString); // Log the table string
            assessment.droseraOutputResult = tableString;
            //console.error({ tableString });

            // Parse the table string to extract numerical values
            const parser = new DOMParser();
            const doc = parser.parseFromString(tableString, 'text/html');
            const table = doc.querySelector('table');
            const rows = table?.querySelectorAll('tr');
            const DroseraResTable = [];

            if (rows) {
              rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowData = [];
                cells.forEach(cell => {
                  const value = parseFloat(cell.textContent || '');
                  if (!isNaN(value)) {
                    rowData.push(value);
                  }
                });
                if (rowData.length > 0) {
                  DroseraResTable.push(rowData);
                }
              });
            }
            console.log('DroseraResTable:', DroseraResTable); // Log the DroseraResTable
            assessment.DroseraResTable = DroseraResTable;
            // Store the table string and DroseraResTable in the state or use it as needed
            onChange({ ...assessment, droseraOutputFile: [newFile], populationTable: tableString, DroseraResTable });
          } else {
            console.error('No table found right after the <h2>Population</h2> title.');
          }

          // if (assessment.DroseraResTable[1]>250000) {
          //   assessment.populationDensity = ">250,000";
          // } else if (assessment.DroseraResTable[1]<250000) {
          //   assessment.populationDensity = "<250,000";
          // } else if (assessment.DroseraResTable[1]<25000) {
          //   assessment.populationDensity = "<25,000";
          // } else if (assessment.DroseraResTable[1]<2500) {
          //   assessment.populationDensity = "<2,500";
          // } else if (assessment.DroseraResTable[1]<250) {
          //   assessment.populationDensity = "<250";
          // } else if (assessment.DroseraResTable[1]<25) {
          //   assessment.populationDensity = "<25";
          // } else if (assessment.DroseraResTable[1]<0) {
          //   assessment.populationDensity = "Zone Contrôlée";
          // } else {
          //   assessment.populationDensity = "Zone Contrôlée";
          // }
        // if (populationHeader) {
        //   // Find the next sibling element which is a table
        //   const nextSibling = populationHeader.nextElementSibling;
        //   //console.log('Next sibling:', nextSibling); // Log the next sibling

        //   if (nextSibling && nextSibling.tagName === 'TABLE') {
        //     // Convert the table to a string
        //     const tableString = nextSibling.outerHTML;
        //     //console.log('Table string:', tableString); // Log the table string
        //     assessment.droseraOutputResult = tableString;
        //     //console.error({ tableString });

        //     // Store the table string in the state or use it as needed
        //     onChange({ ...assessment, droseraOutputFile: [newFile], populationTable: tableString });
        //   } else {
        //     console.error('No table found right after the <h2>Population</h2> title.');
        //   }
        } else {
          console.error('<h2>Population</h2> title not found.');
        }
      };
      reader.readAsText(newFile);
    }
  };
  const handleRemoveDroseraOutputFile = (index: number) => {
    const newFiles = [...(assessment.droseraOutputFile || [])];
    newFiles.splice(index, 1);
    onChange({ ...assessment, droseraOutputFile: newFiles });
  };
  const generateDroseraInputFile = () => {
    if (!assessment.trajgeoFiles) {
      setErrorMessage('Veuillez sélectionner un fichier de trajectoire ou de zone avant de générer le fichier d\'entrée Drosera.');
      return;
    }
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="DroseraDataModel.xsl"?><DroseraDataModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="drosera.xsd">
<DroseraLite id="1">
  <mission id="2">
    ${assessment.trajgeoFiles[0].name.includes('Trajectoire_') && assessment.trajgeoFiles.length > 0
      ? `<is_traj>true</is_traj>
         <is_zone>false</is_zone>
         <trajectory>%DRODIR%/share/drosera/Data/Trajectories/${assessment.trajgeoFiles[0].name}</trajectory>`
      : assessment.trajgeoFiles[0].name.includes('Zone_') && assessment.trajgeoFiles.length > 0
      ? `<is_traj>false</is_traj>
         <is_zone>true</is_zone>
         <trajectory>drosera_dir/Data/Trajectories/${assessment.trajgeoFiles[0].name}</trajectory>`
      : ``}
    ${assessment.assessmentTypeHauteurVol.includes('Hauteur de vol suivant trajectoire(s)')
      ? `<compute_terrain_following>false</compute_terrain_following>
    <terrain_following unit="m">0</terrain_following>`
      : `<compute_terrain_following>true</compute_terrain_following>
    <terrain_following unit="m">${assessment.followTerrainHeight}</terrain_following>`}
    <cruise_speed unit="m/s">${assessment.VCruise}</cruise_speed>
    ${assessment.PopulationDensityModulation.includes('OUI')
      ? `<compute_flight_start>true</compute_flight_start>`
      : `<compute_flight_start>false</compute_flight_start>`}
    <flight_start>${assessment.assessmentStartTime}:00</flight_start>
  </mission>
  <iGRC id="3">
    ${assessment.assessmentCriticalArea.includes('JARUS') 
      ? `<compute_critical_area>true</compute_critical_area>` 
      : assessment.assessmentCriticalArea.includes('SORA') 
      ? `<compute_critical_area>false</compute_critical_area>`
      : `<compute_critical_area>true</compute_critical_area>`
    }
    <critical_area unit="m²">${assessment.CriticalArea}</critical_area>
    ${assessment.assessmentCriticalArea.includes('JARUS') 
      ? `<use_igrc_table>false</use_igrc_table>` 
      : assessment.assessmentCriticalArea.includes('SORA') 
      ? `<use_igrc_table>true</use_igrc_table>`
      : `<use_igrc_table>false</use_igrc_table>`
    }    
    <max_dim unit="m">${assessment.maxCharacteristicDimension}</max_dim>
    <max_speed unit="m/s">${assessment.maxSpeed}</max_speed>
  </iGRC>
  <ground_risk_assessment id="4">
    <areas_to_check id="12">
      <flight_geography_width unit="m">${assessment.FlightGeographyWidth}</flight_geography_width>
      <contingency_volume_width unit="m">${assessment.ContingencyVolumeWidth}</contingency_volume_width>
      <grb_range unit="m">${assessment.GRBWidth}</grb_range>
      <adjacent_range unit="m">${assessment.AdjacentVolumeWidth}</adjacent_range>
    </areas_to_check>
    <third_parties id="10">
      <assess_population>true</assess_population>
      ${assessment.PopulationDensityDataBase.includes('INSEE')
      ? `<population_database ref="19"/>`
      : `<population_database ref="18"/>`}
      <assess_road>true</assess_road>
      <assess_railway>true</assess_railway>
      <assess_powerline>true</assess_powerline>
    </third_parties>
    <other_maps id="11">
      <assess_relief>false</assess_relief>
      <d_relief unit="m">50</d_relief>
      <assess_safecrash>false</assess_safecrash>
    </other_maps>
    <result_directory>%DRODIR%/share/drosera/Data/Results/</result_directory>
    <verbose>false</verbose>
    <zip_result>false</zip_result>
  </ground_risk_assessment>
  <helpers id="5">
    <mission id="9" xsi:type="MissionHelp"/>
    <critical_area id="6" xsi:type="CriticalAreaHelp">
      <critical_area_jarus_calc id="14">
        <uav_wingspan unit="m">${assessment.maxCharacteristicDimension}</uav_wingspan>
        <d_glide unit="m">${assessment.dGlide}</d_glide>
        <compute_d_glide>true</compute_d_glide>
        <dglide_calc id="17">
          <theta unit="deg">${assessment.ThetaGlide}</theta>
        </dglide_calc>
        <d_slide unit="m">${assessment.dSlideReduced}</d_slide>
        <compute_d_slide>true</compute_d_slide>
        ${assessment.ObstaclesModulation.includes('OUI')
      ? `<reduce_for_obstacles>true</reduce_for_obstacles>`
      : `<reduce_for_obstacles>false</reduce_for_obstacles>`}
        <dslide_calc id="16">
          <theta unit="deg">${assessment.ThetaGlide}</theta>
          <max_speed unit="m/s">${assessment.maxSpeed}</max_speed>
          <uav_mass unit="kg">${assessment.MTOW}</uav_mass>
        </dslide_calc>
      </critical_area_jarus_calc>
      <critical_area_hiam_calc id="13">
        <uav_wingspan unit="m">${assessment.maxCharacteristicDimension}</uav_wingspan>
        <max_speed unit="m/s">${assessment.maxSpeed}</max_speed>
        <uav_mass unit="kg">${assessment.MTOW}</uav_mass>
      </critical_area_hiam_calc>
    </critical_area>
    <ground_risk_assessment id="7" xsi:type="GroundRiskAssessmentHelp"/>
    <ground_risk_buffer id="8" xsi:type="GroundRiskBufferHelp">
      <grb_calc id="15">
        <x unit="m">0</x>
        <y unit="m">0</y>
        <z unit="m">0</z>
        <vx unit="m/s">0</vx>
        <vy unit="m/s">0</vy>
        <vz unit="m/s">0</vz>
        <vwind unit="m/s">0</vwind>
        <etapes/>
        <grb unit="m">${assessment.GRBWidth}</grb>
      </grb_calc>
    </ground_risk_buffer>
  </helpers>
</DroseraLite>
 ${assessment.PopulationDensityDataBase.includes('INSEE')
      ? `<BDDPopu id="19">`
      : `<BDDPopu id="18">`}
  <nom>${assessment.PopulationDensityDataBase}</nom>
</BDDPopu>
</DroseraDataModel>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DroseraInputFile'.concat('.dro');
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
// ==============================
// Trajectoire et Zone File Handling
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const invalidFiles = newFiles.filter(
        (file) =>
          ( !file.name.startsWith('Trajectoire_') && !file.name.startsWith('Zone_') )&&
          (file.name.endsWith('.kml') || file.name.endsWith('.geojson'))
      );

      if (invalidFiles.length > 0) {
        setErrorMessage(
          "ERREUR : votre fichier doit avoir un nom de la forme 'Trajectoire_Nom-de-la-trajectoire' ou 'Zone_Nom-de-la-zone'et être un fichier .kml ou .geojson"
        );
        return;
      }

      setErrorMessage(null);

      const fileCopies = await Promise.all(
        newFiles.map(async (file) => {
          const content = await file.text();
          return new File([content], file.name, { type: file.type });
        })
      );

      onChange({
        ...assessment,
        trajgeoFiles: [...(assessment.trajgeoFiles || []), ...fileCopies],
      });
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...(assessment.trajgeoFiles || [])];
    newFiles.splice(index, 1);
    onChange({ ...assessment, trajgeoFiles: newFiles });
  };

// ====================================================================================\\
//                   Render the component Ground Rishk Initial                         \\  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Évaluation des Risques</h2>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Mission</h3>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text="Option Hauteur de vol">
                <label className="block text-sm font-medium text-gray-700">
                  Hauteur de Vol
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentTypeHauteurVol}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentTypeHauteurVol: e.target
                      .value as assessmentTypeHauteurVol,
                    followTerrainHeight:
                      e.target.value === 'Hauteur de vol en suivi de terrain'
                        ? assessment.followTerrainHeight
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation">
                  Sélectionner une méthode d'évaluation
                </option>
                <option value="Hauteur de vol suivant trajectoire(s)">
                  Hauteur de vol suivant trajectoire(s)
                </option>
                <option value="Hauteur de vol en suivi de terrain">
                  Hauteur de vol en suivi de terrain
                </option>
              </select>
            </div>

            {assessment.assessmentTypeHauteurVol ===
              'Hauteur de vol en suivi de terrain' && (
              <div>
                <Tooltip text="Hauteur qui sera appliquée suivant la topographie terrain.">
                  <label className="block text-sm font-medium text-gray-700">
                    Hauteur de la trajectoire
                  </label>
                </Tooltip>
                <input
                  type="number"
                  value={assessment.followTerrainHeight}
                  min={0}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      followTerrainHeight: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.followTerrainHeight === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              
              <label className="block text-sm font-medium text-gray-700">
                Vitesse de Croisière (m/s)
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {assessment.VCruise}
              </div>
            
            <div>

            </div>
              <Tooltip text=" XXX ">
                <label className="block text-sm font-medium text-gray-700">
                  Moduler la densité de population en fonction du temps de vol
                  le long de la trajectoire du drone
                </label>
              </Tooltip>
              <select
                value={assessment.PopulationDensityModulation}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    PopulationDensityModulation: e.target
                      .value as PopulationDensityModulation,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation">
                  Sélectionner une méthode d'évaluation
                </option>
                <option value="NON">NON</option>
                <option value="OUI">OUI</option>
              </select>
            </div>
            {assessment.PopulationDensityModulation ===
              'OUI' && (
            <div>
              <Tooltip text="Heure Locale spécifiée à l'étape #1">
                <label className="block text-sm font-medium text-gray-700">
                  Heure de Démarrage des opérations
                </label>
              </Tooltip>
              <div className="mt-1 relative">
                <input
                  type="time"
                  value={assessment.assessmentStartTime}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      assessmentStartTime: e.target.value,
                    })
                  }
                  className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
                <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
              )}
          </div>

          <div>
            <Tooltip text={
                                  <div>
                                    <li>Un fichier par tajectoire nommé Trajectoire_Nom-de-la-trajectoire</li>                                   
                                    <li>Un fichier par Zone d'évolution nommé Zone_Nom-de-la-zone</li>
                                  </div>
                }>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trajectoire ou Zone d'évolution de l'UAS
              </label>
            </Tooltip>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".kml,.geojson"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Déposer des fichiers KML ou GeoJSON ici
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                {errorMessage}
              </div>
            )}
            {assessment.trajgeoFiles && assessment.trajgeoFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {assessment.trajgeoFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carte de visualisation des Trajectoires ou Zones d'évolution de l'UAS
              </label>
            <RiskAssessmentMap geoFiles={assessment.trajgeoFiles || []} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">
          Determination de l'iGRC : Intrinsic Ground Risk Class 
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          

            <h2 className="text-lg font-medium">
            Etape 1 : Determination de la surface critique de crash (Ac).<button
                type="button"
                onClick={() => window.open('https://www.easa.europa.eu/sites/default/files/dfu/d2_-_consolidated_gm-for_publication-02052024.pdf', '_blank')}  
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation EASA Final Guidelines for the Assessment of the Critical Area of an Unmanned Aircraft"
              >
                <HelpCircle className="w-4 h-4" />
            </button>
            </h2>
             
            
            <div>
              <Tooltip text="En surligné bleu la valeur cortrespondant à la dimension caractéristique maximale de l'UAS et en vert la valeur seuil associée à votre valeur de surface critique de crash.">
                        <label className="block text-sm font-medium text-gray-700">
                          Valeur indicative du seuil de Surface Critique associée à la dimension caractéristique maximale de l'UAS
                        </label>
              </Tooltip>
              <div>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="bg-gray-200 py-2 px-4 border-b">Dimension characteristique Max. (m)</th>
                      
                      <th className={
                          assessment.maxCharacteristicDimension<=1 && assessment.maxCharacteristicDimensionClass<=1
                          ? 'bg-blue-200  text-white border-2 border-green-500'
                          : assessment.maxCharacteristicDimensionClass<=1
                            ? 'bg-white py-2 px-4 border-2 border-green-500'
                            : 'bg-white py-2 px-4 border-b'
                          }>≤1</th>

                      <th className={
                            assessment.maxCharacteristicDimension<=3 && assessment.maxCharacteristicDimension>1
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=3  && assessment.maxCharacteristicDimensionClass>1
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=3  && assessment.maxCharacteristicDimensionClass>1
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>≤3</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=8 && assessment.maxCharacteristicDimension>3
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=8  && assessment.maxCharacteristicDimensionClass>3
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=8  && assessment.maxCharacteristicDimensionClass>3
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>≤8</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=20 && assessment.maxCharacteristicDimension>8
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=20  && assessment.maxCharacteristicDimensionClass>8
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=20  && assessment.maxCharacteristicDimensionClass>8
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>≤20</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=40 && assessment.maxCharacteristicDimension>20
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=40  && assessment.maxCharacteristicDimensionClass>20
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=40  && assessment.maxCharacteristicDimensionClass>20
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>≤40</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-200">
                      <th className="bg-gray-200 py-2 px-4 border-b">Valeur Seuil de la Surface Critique (m²)</th>
                      
                      <th className={
                          assessment.maxCharacteristicDimension<=1 && assessment.maxCharacteristicDimensionClass<=1
                          ? 'bg-blue-200  text-white border-2 border-green-500'
                          : assessment.maxCharacteristicDimensionClass<=1
                            ? 'bg-white py-2 px-4 border-2 border-green-500'
                            : 'bg-white py-2 px-4 border-b'
                          }>6.5</th>

                      <th className={
                            assessment.maxCharacteristicDimension<=3 && assessment.maxCharacteristicDimension>1
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=3  && assessment.maxCharacteristicDimensionClass>1
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=3  && assessment.maxCharacteristicDimensionClass>1
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>65</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=8 && assessment.maxCharacteristicDimension>3
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=8  && assessment.maxCharacteristicDimensionClass>3
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=8  && assessment.maxCharacteristicDimensionClass>3
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>650</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=20 && assessment.maxCharacteristicDimension>8
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=20  && assessment.maxCharacteristicDimensionClass>8
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=20  && assessment.maxCharacteristicDimensionClass>8
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>6500</th>
                          

                      <th className={
                            assessment.maxCharacteristicDimension<=40 && assessment.maxCharacteristicDimension>20
                              ?  (
                                assessment.maxCharacteristicDimensionClass<=40  && assessment.maxCharacteristicDimensionClass>20
                                  ? 'bg-blue-500  text-white border-2 border-green-500'
                                  : 'bg-blue-500  text-white'
                              )
                              :  assessment.maxCharacteristicDimensionClass<=40  && assessment.maxCharacteristicDimensionClass>20
                                  ? 'bg-white py-2 px-4 border-2 border-green-500'
                                  : 'bg-white py-2 px-4 border-b'
                          }>65000</th>

                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
              <Tooltip  text={
                                <div>
                                  Valeur Seuil de la Surface Critique (m²) selon les tables SORA.
                                  <br />
                                  Cf. doc Guidelines for the Assessment of the Critical Area of an Unmanned Aircraft
                                  <br />
                                  Ces valeurs peuvent être trop conservatrices pour certains cas d'utilisation, c'est pourquoi le modèle JARUS et le modèle à fort angle d'impact ciblent ces scénarios. Si votre valeur de surface critique est inférieure à ces valeurs, vous pourrez vous repporter dans la colonne de dimension maximale associée lors de l'étape d'évaluation de votre iGRC.
                                </div>
                              }>
                <label className="block text-sm font-medium text-gray-700">
                  Valeur <b>Seuil</b> de Surface Critique selon les tables (m²). 
                </label>
              </Tooltip>
              <input
                type="number"
                value={ThresholdACtable()}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    ThresholdCriticalArea: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-black-500 text-gray-500 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text="Aussi appelée Critical Area ou Surface de Crash">
                <label className="block text-sm font-medium text-gray-700">
                  Méthode d'évaluation de la Surface Critique
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentCriticalArea}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentCriticalArea: e.target
                      .value as assessmentCriticalArea,
                    // CriticalArea:
                    //   e.target.value === 'Spécifiée par le déposant'
                    //     ? assessment.CriticalArea
                    //     : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation">
                  Sélectionner une méthode d'évaluation
                </option>
                <option value="Calcul selon les Modèles JARUS">
                  Calcul selon les Modèles JARUS
                </option>
                <option value="Spécifiée par le déposant">
                  Spécifiée par le déposant
                </option>
              </select>
            </div>
            <div>
              <Tooltip text="D'après la valeur de la Surface Critique (m²) le seuil applicable dans le tableau ci-dessus sera appliqué pour les calcul iGRC.">
              <label className="block text-sm font-medium text-gray-700">
                Classe de Dimension Caractéristique Max. Applicable (m)
              </label>
              </Tooltip>
              <div>
                {/* &le;{assessment.maxCharacteristicDimensionClass} */}
              
              <input
                type="number"
                value={CalculmaxCharacteristicDimensionClass()}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    maxCharacteristicDimensionClass: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-blue-500 text-blue-500 border-2 font-bold shadow-sm focus:border-blue-800 focus:ring-blue-800"
                disabled
              />
              </div>
              </div>

          </div>
            {assessment.assessmentCriticalArea ===
              'Spécifiée par le déposant' ? (
                <div>
                  <div>
                    <Tooltip text="Valeur de la Surface Critique déclarée (m²) A justifier par l'opérateur en annexe ! ">
                      <label className="block text-sm font-medium text-gray-700">
                        Valeur de la Surface Critique déclarée (m²)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.CriticalArea}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          CriticalArea: parseInt(e.target.value) || 0,
                        })
                      }
                      step="1.0"
                      className="mt-1 block w-full rounded-md border-black border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      
                    />
                  </div>
                  <div>
                  <Tooltip text="Si vous choisissez de déclarer votre propre valeur de surface critique, veuillez apporter une justification. Celle-ci doit établir clairement le mode de calcul adopté. Vous devrez fournir en annexe un document détaillant chaque étape de calcul et leur base de justification.">
                    <label className="block text-sm font-medium text-gray-700">
                      Justification de votre surface Critique
                    </label>
                  </Tooltip>
                  <textarea
                      value={assessment.UserCriticalArea_Justification}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          UserCriticalArea_Justification: e.target.value,
                        })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
              ) : assessment.assessmentCriticalArea ===
              'Calcul selon les Modèles JARUS' ? ( 

  
  // | 'Avion'
  // | 'Hélicoptère'
  // | 'Multirotor'
  // | 'Hybride/VTOL'
  // | "Plus léger que l'air"
  // | 'Autre';              
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valeur de la Surface Critique Calculée (m²)
                    </label>
                    <div className="mt-1 block w-full rounded-md border-black border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      {assessment.GlidingCapability === "OUI" || assessment.HighImpactAngle === 'NON' ? ( 
                        
                        parseFloat(CalculJARUSCriticalArea().toFixed(2))
                      ) : (
                        parseFloat(CalculCriticalArea_HAI().toFixed(2))
                      )}
                      
                    </div>
                    <div className="text-gray-100">
                     {/* Just to force recompute of maxCharacteristicDimensionClass */}
                        {CalculmaxCharacteristicDimensionClass()}
                    </div>
                    {(assessment.uasType === 'Hélicoptère' || assessment.uasType === 'Multirotor') ? (
                    <div>
                      <Tooltip text=" ">
                        <label className="block text-sm font-medium text-gray-700">
                          L'appareil est-il capable de planer ?
                        </label>
                      </Tooltip>
                      <select
                        value={assessment.GlidingCapability}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GlidingCapability: e.target
                              .value as GlidingCapability,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation">
                          Sélectionner une méthode d'évaluation
                        </option>
                        <option value="NON">NON</option>
                        <option value="OUI">OUI</option>
                      </select>
                      {assessment.GlidingCapability === 'NON' && (
                      // L'angle d'impact serait-il supérieur à 60° ? 
                      <div>
                        <Tooltip text=" ">
                          <label className="block text-sm font-medium text-gray-700">
                            L'angle d'impact serait-il supérieur à 60° ?
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.HighImpactAngle}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              HighImpactAngle: e.target
                                .value as HighImpactAngle,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Sélectionner une méthode d'évaluation">
                            Sélectionner une méthode d'évaluation
                          </option>
                          <option value="NON">NON</option>
                          <option value="OUI">OUI</option>
                        </select>
                      </div>
                      )}
                      <br />
                    </div>) : (
                      <>
                      Gliding Capability : {assessment.GlidingCapability = 'OUI'}
                        
                      </>
                    )}
                </div>
                {((assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && assessment.GlidingCapability == 'OUI') ? (
                <img  
                  src={JARUSorHIModel_AC}
                  alt="JARUSorHIModelAirplane" 
                  className="w-auto h-auto mb-6 mx-auto"
                />
                
                ) : ((assessment.uasType === 'Hélicoptère' || assessment.uasType === 'Multirotor') && assessment.HighImpactAngle === 'NON') ? (
                  <img 
                    src={JARUSorHIModel_HC_Low}
                    alt="JARUModel" 
                    className="w-auto h-auto mb-6 mx-auto"
                  />
                ) : ((assessment.uasType === 'Hélicoptère' || assessment.uasType === 'Multirotor') && assessment.HighImpactAngle === 'OUI') ? (
                  <img 
                    src={JARUSorHIModel_HC_High}
                    alt="JARUSorHIModel" 
                    className="w-auto h-auto mb-6 mx-auto"
                  />
                ) : (
                  <img 
                    src={JARUSorHIModel}
                    alt="JARUSorHIModel" 
                    className="w-auto h-auto mb-6 mx-auto"
                  />
                )
                }
                
                

                
                
                  
                 
                
                {assessment.GlidingCapability === "OUI" || assessment.HighImpactAngle === 'NON' ? ( 
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-medium">Jarus Model</h3>
                    {assessment.maxCharacteristicDimension >= 1 &&
                      assessment.maxCharacteristicDimension < 8 ? (
                      <div>
                        <Tooltip text=" Activable si la Dimensions caractéristiques maximales est comprise entre 1m et 8m (1m ≤ w < 8m) et en présence d'obstacles le justifiant.">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer la réduction de 40% pour les obstacles
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.ObstaclesModulation}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ObstaclesModulation: e.target
                                .value as ObstaclesModulation,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Sélectionner une méthode d'évaluation">
                            Sélectionner une méthode d'évaluation
                          </option>
                          <option value="NON">NON</option>
                          <option value="OUI">OUI</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <Tooltip text=" Activable si la Dimensions caractéristiques maximales est comprise entre 1m et 8m (1m ≤ w < 8m) et en présence d'obstacles le justifiant.">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer la réduction de 40% pour les obstacles
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.ObstaclesModulation}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ObstaclesModulation: e.target
                                .value as ObstaclesModulation,
                            })
                          }
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="NON">NON</option>
                          {/* <option value="OUI">OUI</option> */}
                        </select>
                      </div>
                    )}                    
                
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dimensions caractéristiques maximales (m)
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {assessment.maxCharacteristicDimension}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse maximales (m/s)
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {assessment.maxSpeed}
                      </div>
                    </div>  
                    <div>
                        <Tooltip text="Données personalisées pour le modèle Jarus">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer les fonctionnalités de calcul détaillé du modèle
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.DetailedJarusModel}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              DetailedJarusModel: e.target
                                .value as DetailedJarusModel,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Sélectionner une méthode d'évaluation">
                            Sélectionner une méthode d'évaluation
                          </option>
                          <option value="NON">NON</option>
                          <option value="OUI">OUI</option>
                        </select>
                    </div>
                    <h3 className="text-lg font-medium">   </h3>

                    {assessment.DetailedJarusModel === 'OUI' && (
                      
                      <div>
                        <Tooltip text="Angle d'impact (de plané/fauché.) NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                          <label className="block text-sm font-medium text-gray-700">
                            Theta_Glide (deg)
                          </label>
                        </Tooltip>
                        <input
                          type="number"
                          value={assessment.ThetaGlide}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ThetaGlide: parseFloat(e.target.value) || 0.000
                            })
                          }
                          step="0.1"
                          min={assessment.HighImpactAngle === 'OUI' ? 60 : 0}
                          max={assessment.HighImpactAngle === 'OUI' ? 90 : 60}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ThetaGlide === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                          placeholder={AdviceThetaGlide().toString()}
                        />     
                      
                        <label className="block text-sm font-medium text-gray-700">
                          Mass maximale MTOW (kg)
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.MTOW}
                        </div>                 
                      </div>
                    )}
                    {assessment.DetailedJarusModel === 'OUI' && (
                      <div>
                        <Tooltip text="Si votre Angle d'impact ne respecte pas les consignes, apporter une justification. NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                          <label className="block text-sm font-medium text-gray-700">
                            Theta_Glide Justification
                          </label>
                        </Tooltip>
                        <textarea
                            value={assessment.Theta_Glide_Justification}
                            onChange={(e) =>
                              onChange({
                                ...assessment,
                                Theta_Glide_Justification: e.target.value,
                              })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={4}
                          />
                      </div>
                    )}
                    
                    <div>
                      <Tooltip  text={
                                  <div>
                                    Distance de plané à hauteur d'homme.
                                    <br />
                                    d_Glide = hperson/tan θ
                                  </div>
                                }>
                        <label className="block text-sm font-medium text-gray-700">
                          d_Glide (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.dGlide}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            dGlide: parseFloat(e.target.value) || 0.000
                          })
                        }
                        step="0.01"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.dGlide === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                        placeholder={(AdvicedGlide()).toString()}
                        
                      />
                      
                    </div> 
                    <div>
                      <Tooltip  text={
                                  <div>
                                    Distance de glissement/friction.
                                    <br />
                                    d_Slide,reduced = e·vhorizontal·tsafe − 0,5·Cg·g(tsafe)²
                                  </div>
                                }>
                        <label className="block text-sm font-medium text-gray-700">
                          d_Slide,reduced (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.dSlideReduced}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            dSlideReduced: parseFloat(e.target.value) || 0.000
                          })
                        }
                        step="0.01"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.dSlideReduced === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                        placeholder={AdvicedSlideReduced().toString()}
                      />
                      
                    </div>
                    <div>
                      
                        <label className="block text-sm font-medium text-gray-700">
                          Vhorizointal (s)
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.vhorizontale}
                        </div>           
                    </div>
                    <div>
                      
                        <label className="block text-sm font-medium text-gray-700">
                          Lethal Speed (m/s)
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.vnonlethal}
                        </div>           
                    </div>
                    <div>
                        <Tooltip text="Time to safe speed [s]">
                          <label className="block text-sm font-medium text-gray-700">
                            tsafe (s)
                          </label>
                        </Tooltip>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.tsafe}
                        </div>           
                    </div>
                
                  </div>

                ) : ( 

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-medium">High Impact Angle Model</h3>                 

                    <div className="text-red-900 border-gray-300 rounded md:col-span-2">
                      <b>Rappels</b> :
                      <br />
                      <b>Note 1 :</b> Pour évaluer la surface critique à l'aide de ce modèle, l'altitude minimale opérationnelle doit être fixée comme limite dans le manuel de l'opérateur.
                      <br />
                      <b>Note 2 :</b> Si l'exploitant choisit d'utiliser les résultats du modèle d'angle d'impact élevé, il doit procéder par itération pour trouver l'altitude de vol minimale qui passe le seuil de l'outil d'évaluation.
                      <br />
                      Si l'une des conditions ci-dessus n'est pas remplie, il convient d'appliquer le modèle d'angle d'impact faible conformément à l'annexe F du JARUS.
                      <br />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vitesse maximales (m/s)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxSpeed}
                    </div>
                  </div> 
                    <div>
                      <Tooltip  text={
                                  <div>
                                    Altitude minimale opérationnelle.
                                    <br />
                                    Telle que fixée comme limite dans le manuel de l'opérateur.
                                  </div>
                                }>
                        <label className="block text-sm font-medium text-gray-700">
                          Altitude minimale opérationnelle (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.MinOperationalAltitude}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0.000;
                          onChange({
                            ...assessment,
                            MinOperationalAltitude: newValue
                          });
                          CalculImpactAngle();
                        }}
                        step="0.1"
                        min={0}
                        //max={operation.maxOperationHeight.toString()} // Ajustez la valeur maximale selon vos besoins
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        //placeholder={operation.maxOperationHeight.toString()}
                      />
                      
                    </div>
                    <div>
                          
                    </div>
                    


                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ThetaImpact (deg)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {CalculImpactAngle().at(0)}
                    </div>
                    </div>



                  </div>

                )}




                
              </div>
              // ) : assessment.assessmentCriticalArea ===
              // 'Calcul selon les tables SORA' ? (
              //   <div>
                //   <div>
                //     <table className="min-w-full bg-white">
                //       <thead>
                //         <tr className="bg-black text-black">
                //           <th className="bg-gray-200 py-2 px-4 border-b">Max. characteristic dimension (m)</th>
                //           <th className="bg-white py-2 px-4 border-b">≤1</th>
                //           <th className="bg-white py-2 px-4 border-b">≤3</th>
                //           <th className="bg-white py-2 px-4 border-b">≤8</th>
                //           <th className="bg-white py-2 px-4 border-b">≤20</th>
                //           <th className="bg-white py-2 px-4 border-b">≤40</th>
                //         </tr>
                //       </thead>
                //       <tbody>
                //         <tr className="bg-gray-200">
                //           <th className="bg-gray-200 py-2 px-4 border-b">Critical area (m²)</th>
                //           <th className="bg-white py-2 px-4 border-b">8</th>
                //           <th className="bg-white py-2 px-4 border-b">80</th>
                //           <th className="bg-white py-2 px-4 border-b">800</th>
                //           <th className="bg-white py-2 px-4 border-b">8000</th>
                //           <th className="bg-white py-2 px-4 border-b">80000</th>
                //         </tr>
                //       </tbody>
                //     </table>
                //   </div>
                //   <div>
                //   <Tooltip  text={
                //                     <div>
                //                       Valeur de la Surface Critique (m²) selon les tables SORA.
                //                       <br />
                //                       Ces valeurs peuvent être trop conservatrices pour certains cas d'utilisation!
                //                     </div>
                //                   }>
                //     <label className="block text-sm font-medium text-gray-700">
                //       Valeur de la Surface Critique selon les tables (m²). 
                //     </label>
                //   </Tooltip>
                //   <input
                //     type="number"
                //     value={ACtable()}
                //     onChange={(e) =>
                //       onChange({
                //         ...assessment,
                //         CriticalArea: parseInt(e.target.value) || 0,
                //       })
                //     }
                //     className="mt-1 block w-full rounded-md border-black border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                //     disabled
                //   />
                //   </div>
              //   </div>
              ) : (
                <div>

                </div>
              )
            }
        </div> 

        <div className="bg-gray-50 p-4 rounded-lg space-y-4"> 
          <h2 className="text-lg font-medium">Etape 2 : Determination des Volumes d'évolution, de Contingence Zone Tampon et Adjacente  (Flight Geometry).<button
                type="button"
                onClick={() => window.open('https://www.lba.de/SharedDocs/Downloads/DE/B/B5_UAS/Leitfaden_FG_CV_GRB_eng.pdf?__blob=publicationFile&v=12', '_blank')}  
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Basé sur la documentation du Luftfahrt-Bundesamt (LBA) - Leitfaden zur Ermittlung des Fluggeometrie- und Kontingenzvolumens sowie der Ground Risk Buffer Zone"
              >
                <HelpCircle className="w-4 h-4" />
            </button></h2>
          <img 

            src={DefinitionOfVolumes}
            alt="Centres d'Essais Drones France" 
            className="w-auto h-auto mb-6 mx-auto"
          />
          <h2 className="text-lg font-medium">Etape 2.1 : Determination du Volume d'évolution (Flight Geometry).</h2> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">               
            <div>
              <Tooltip  text={
                                  <div>
                                    Largeur du Volume d'évolution. 
                                    <br />
                                    Attention : Des valeurs inférieures à 3 fois la dimension caractéristique maximale de l'appareil sont considérées irrecevables. 
                                    <br />
                                    S_FG≥ 3.maxCharacteristicDimension à l'arrondis supérieur.
                                  </div>
                                }>
                <label className="block text-sm font-medium text-gray-700">
                  S_FG : Largeur du Volume d'évolution (m)
                </label>
              </Tooltip>
              <input
                type="number"
                value={assessment.FlightGeographyWidth}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    FlightGeographyWidth: Math.max(parseFloat(e.target.value),Math.round(3*assessment.maxCharacteristicDimension+0.49)) || 0.000
                  })
                }
                step="1.0"
                //min={3 * assessment.maxCharacteristicDimension} // Définit la valeur minimale autorisée
                className="mt-1 block w-full rounded-md border-green-900 border-2 font-bold bg-green-50 text-green-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={(Math.round(3*assessment.maxCharacteristicDimension+0.49)).toString()}
              />
            </div> 
            <div>
              <Tooltip  text={
                                  <div>
                                    Hauteur du Volume d'évolution. 
                                    <br />                                    
                                    Attention : Des valeurs inférieures à 3 fois la dimension caractéristique maximale de l'appareil sont considérées irrecevables. 
                                    <br />
                                    H_FG≥ 3.maxCharacteristicDimension à l'arrondis supérieur
                                  </div>
                                }>
                <label className="block text-sm font-medium text-gray-700">
                  H_FG : Hauteur du Volume d'évolution (m)
                </label>
              </Tooltip>
              <input
                type="number"
                value={assessment.FlightGeographyHeight}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    FlightGeographyHeight: Math.max(parseFloat(e.target.value),Math.round(3*assessment.maxCharacteristicDimension+0.49)) || 0.000
                  })
                }
                step="1.0"
                min={3 * assessment.maxCharacteristicDimension} // Définit la valeur minimale autorisée
                className="mt-1 block w-full rounded-md border-green-900 border-2 font-bold bg-green-50 text-green-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={(Math.round(3*assessment.maxCharacteristicDimension+0.49)).toString()}
              />
            </div> 
          </div>   
          <div>
                <Tooltip text="Vous pouvez si vous le souhaitez apporter des éléments de justification de la définition de votre Volume d'évolution.">
                  <label className="block text-sm font-medium text-gray-700">
                    Justification de votre Volume d'évolution
                  </label>
                </Tooltip>
                <textarea
                    value={assessment.FlightGeography_Justification}
                    onChange={(e) =>
                      onChange({
                        ...assessment,
                        FlightGeography_Justification: e.target.value,
                      })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                  />
          </div> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-lg font-medium">Etape 2.2 : Determination du volume de Contingence (S_CV : Contingency Volume).</h2>
            <div>
              <Tooltip text="Le Volume de Contingence : volume dans lequel le drone est considéré comme étant dans une situation anormale et qui requiert l’exécution des procédures de contingence appropriée pour le faire revenir au-dessus de sa zone d’évolution. A minima la taille du volume de contingence est calculée comme la distance parcourue par le drone à sa vitesse sol maximale durant le temps de réaction du pilote pour s’apercevoir qu’il est sorti du volume d’évolution et de prendre les mesures adaptées.  La limite interne du volume de contingence doit correspondre à la limite externe du volume d’évolution.">
                <label className="block text-sm font-medium text-gray-700">
                  Méthode d'évaluation du Volume de Contingence
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentContingencyVolume}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentContingencyVolume: e.target
                      .value as assessmentContingencyVolume,
                    ContingencyVolume:
                      e.target.value === 'Spécifiée par le déposant'
                        ? assessment.ContingencyVolume
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation du Volume">
                  Sélectionner une méthode d'évaluation du Volume
                </option>
                <option value="Spécifiée par le déposant">
                  Spécifiée par le déposant
                </option>
                <option value="Calcul selon le Guide">
                  Calcul selon le Guide 
                </option>
              </select>
            </div>
            
          </div>
            {assessment.assessmentContingencyVolume ===
              'Calcul selon le Guide' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Tooltip  text={
                                          <div>
                                            Largeur du Volume de Contingence. 
                                            <br />
                                            Attention : Des valeurs inférieures à la Largeur du Volume d'évolution sont considérées irrecevables. 
                                            <br />
                                            S_CV ≥ S_FG
                                          </div>
                                        }>
                        <label className="block text-sm font-medium text-gray-700">
                          S_CV : Largeur du Volume de Contingence (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeWidth}
                        // onChange={(e) =>
                        //   onChange({
                        //     ...assessment,
                        //     ContingencyVolumeWidth: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyWidth)) || 0.000
                        //   })
                        // }
                        //step="0.1"
                        //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                        className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)}//(assessment.FlightGeographyWidth)}
                        disabled
                      />  
                    </div> 
                    <div>
                      { (assessment.ContingencyVolumeSGPS === undefined || assessment.ContingencyVolumeSGPS === null) || (assessment.ContingencyVolumeSpos === undefined || assessment.ContingencyVolumeSpos === null) || (assessment.ContingencyVolumeSK === undefined || assessment.ContingencyVolumeSK === null) || (assessment.ContingencyVolumeSRZ === undefined || assessment.ContingencyVolumeSRZ === null) || (assessment.ContingencyVolumeSCM === undefined || assessment.ContingencyVolumeSCM === null)  ? (
                        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                          Attention : une donnée est indéfinie ou nulle.
                            Les valeurs suivantes sont utilisées pour le calcul de la largeur du volume de contingence. Vérifier la cohérence avec l'affichage. 
                            <br />                                    
                            GPS - Inaccuracy = {assessment.ContingencyVolumeSGPS} m
                            <br />
                            Position Holding = {assessment.ContingencyVolumeSpos} m
                            <br />
                            Map error = {assessment.ContingencyVolumeSK} m
                            <br />
                            Temps de Réaction = {assessment.ContingencyTimeRZ} s
                            <br />
                            Distance de réaction S_RZ = {assessment.ContingencyVolumeSRZ} m
                            <br />
                            Manoeuvre de contigence S_CM = {assessment.ContingencyVolumeSCM} m
                        </div>
                      ) : (
                        <Tooltip   text={
                          <div>
                            Les valeurs suivantes sont utilisées pour le calcul de la largeur du volume de contingence. Vérifier la cohérence avec l'affichage. 
                            <br />                                    
                            GPS - Inaccuracy = {assessment.ContingencyVolumeSGPS} m
                            <br />
                            Position Holding = {assessment.ContingencyVolumeSpos} m
                            <br />
                            Map error = {assessment.ContingencyVolumeSK} m
                            <br />
                            Temps de Réaction = {assessment.ContingencyTimeRZ} s
                            <br />
                            Distance de réaction S_RZ = {assessment.ContingencyVolumeSRZ} m
                            <br />
                            Manoeuvre de contigence S_CM = {assessment.ContingencyVolumeSCM} m
                          </div>
                        }>

                        <div>
                          <button
                            onClick={() => CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)}
                            className="rounded-md border-green-200 border-2 font-bold text-green-500 hover:text-blue-200"
                          >
                            Calculer
                          </button>
                        </div>
                        
                        </Tooltip>
                      )}

                      
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Tooltip  text={
                                          <div>
                                            Hauteur du Volume de Contingence. 
                                            <br />                                    
                                            Attention : Des valeurs inférieures à la Hauteur du Volume d'évolution sont considérées irrecevables.  
                                            <br />
                                            H_CV ≥ H_FG
                                          </div>
                                        }>
                        <label className="block text-sm font-medium text-gray-700">
                          H_CV : Hauteur du Volume de Contingence (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeHeight}
                        // onChange={(e) =>
                        //   onChange({
                        //     ...assessment,
                        //     ContingencyVolumeHeight: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyHeight)) || 0.000
                        //   })
                        // }
                        // step="0.1"
                        // min={assessment.FlightGeographyHeight} // Définit la valeur minimale autorisée
                        className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(assessment.FlightGeographyHeight)}
                        disabled
                      />
                    </div>
                    <div>
                      
                        <Tooltip   text={
                          <div>
                            Les valeurs suivantes sont utilisées pour le calcul de la largeur du volume de contingence. Vérifier la cohérence avec l'affichage. 
                            <br />                                    
                            Erreur de mesure d'altitude = {assessment.ContingencyVolumeHbaro} m
                            <br />
                            Position Holding = {assessment.ContingencyVolumeSpos} m
                            <br />
                            Temps de Réaction = {assessment.ContingencyTimeRZ} s
                            <br />
                            Altitude de réaction H_RZ = {assessment.ContingencyVolumeHRZ} m
                            <br />
                            Altitude de contigence H_CM = {assessment.ContingencyVolumeHCM} m
                          </div>
                        }>

                        <div>
                          <button
                            onClick={() => CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM)}
                            className="rounded-md border-green-200 border-2 font-bold text-green-500 hover:text-blue-200"
                          >
                            Calculer
                          </button>
                        </div>
                        
                        </Tooltip>
                      

                      
                    </div>
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          GPS - Inaccuracy 
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 3 mètres.  
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      GPS - Inaccuracy (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeSGPS}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSGPS: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(parseFloat(e.target.value),assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM) } )}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ContingencyVolumeSGPS === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={'TO BE DEFINED'}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Erreur de mesure d'altitude. 
                                          <br />                                    
                                          En règle général, on assumera une erreur de 1 mètre pour une mesure barométrique.  
                                          <br />
                                          Et, on assumera une erreur de 4 mètre pour une mesure GPS.
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Erreur de mesure d'altitude (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeHbaro}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeHbaro: parseFloat(e.target.value), ContingencyVolumeHeight: CalculContingencyVolumeHeight(parseFloat(e.target.value),assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ContingencyVolumeHbaro === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={'TO BE DEFINED'}
                    />                  
                  </div>

                  <div>
                    <Tooltip  text={
                                        <div>
                                          Positionnement du maintien de la position (Position Holding)
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 3 mètres.  
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Position Holding (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={3.0}
                      value={assessment.ContingencyVolumeSpos}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSpos: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,parseFloat(e.target.value),assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)  })}
                      step="0.1"
                      min={0.5} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ContingencyVolumeSpos === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={'TO BE DEFINED'}
                    />
                  </div>
                  
                  <div>
                  </div>


                  <div>
                    <Tooltip  text={
                                        <div>
                                          Map error 
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 1 mètre. 
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Map error (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeSK}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSK: parseFloat(e.target.value) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,parseFloat(e.target.value),assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM) })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ContingencyVolumeSK === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={'TO BE DEFINED'}
                    />  
                  </div>
                  
                  <div>
                  </div>


                  <div>
                    <Tooltip  text={
                                        <div>
                                          Temps de Réaction de l'opérateur ou du système. 
                                          <br />                                    
                                          Temps nécessaire pour que l'opérateur prenne conscience de la situation et réagisse.
                                          <br />
                                          Cas de l'initialisation manuelle de mesures de contingence. t_RZ ≥ 1 seconde 
                                          <br />
                                          En cas d'automatisation type Geofence par exemple, ce temps peut-être plus court.  Dans ce cas apporter une justification. 
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Temps de Réaction de l'opérateur ou du système (s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyTimeRZ}
                      onChange={(e) => onChange({ ...assessment, ContingencyTimeRZ: parseFloat(e.target.value), ContingencyVolumeSRZ: parseFloat(e.target.value)*assessment.maxSpeed, ContingencyVolumeHRZ: parseFloat(e.target.value)*0.7*assessment.maxSpeed , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,parseFloat(e.target.value)*assessment.maxSpeed,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,parseFloat(e.target.value)*0.7*assessment.maxSpeed ,assessment.ContingencyVolumeHCM)  })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ContingencyTimeRZ === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={'TO BE DEFINED'}
                    />
                  </div> 
                  
                  <div>
                  </div>

                  <div>
                    <div>  
                      <Tooltip  text="S_RZ=𝑉0∙1 s ">                  
                      <label className="block text-sm font-medium text-gray-700">
                      Distance de réaction S_RZ (m)
                      </label>                                          
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeSRZ}
                        className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(1.0*assessment.maxSpeed).toString()}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div>    
                      <Tooltip  text="𝐻RZ=V0∙0.7∙1 s  ">                
                      <label className="block text-sm font-medium text-gray-700">
                      Altitude de réaction H_RZ (m)
                      </label>                                                        
                      </Tooltip>    
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeHRZ}
                        className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(1.0*0.7*assessment.maxSpeed).toString()}
                        disabled
                      />
                    </div>
                  </div>
                    

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Manoeuvre de Contingence : Activation du Parachute
                      </label>
                      <input
                        type="checkbox"
                        checked={(assessment.ContingencyParachuteManeuver || []).includes('OUI')}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            ContingencyParachuteManeuver: e.target.checked
                              ? 'OUI'
                              : 'NON',
                              ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM),
                              ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) ,
                              
                            ContingencyVolumeSCM: (CalculVolumeSCM()?.at(0)),
                            ContingencyVolumeHCM: (CalculVolumeSCM()?.at(1)),
                          })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        
                      />
                      {(assessment.ContingencyParachuteManeuver || []).includes('OUI') ? (
                        <div>
                          <div>

                            <Tooltip  text={
                                            <div>
                                              Temps d'activation du parachute (s)  
                                              <br />                                    
                                              Doit prendre en compte le temps d'ouverture et de mise en descente.
                                              <br />
                                            </div>
                                          }>
                            <label className="block text-sm font-medium text-gray-700">
                                Temps d'activation du parachute (s) 
                            </label>
                            </Tooltip>
                            <input
                              type="number"
                              value={assessment.ParachuteTime}
                              defaultValue={1.0}
                              onChange={(e) => onChange({ ...assessment, ParachuteTime: parseFloat(e.target.value), ContingencyVolumeSCM: parseFloat(e.target.value)*assessment.maxSpeed, ContingencyVolumeHCM: parseFloat((parseFloat(e.target.value)*0.7*assessment.maxSpeed).toFixed(2)) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,parseFloat(e.target.value)*assessment.maxSpeed), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,parseFloat((parseFloat(e.target.value)*0.7*assessment.maxSpeed).toFixed(2))) })}
                              step="0.1"
                              min={1.0} // Définit la valeur minimale autorisée
                              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ParachuteTime === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                              placeholder={'TO BE DEFINED'}
                            />
                          </div>
                          <div>
                            <Tooltip  text={
                                            <div>
                                              Manoeuvre de contigence S_CM (m) 
                                              <br />                                    
                                              Alternative : Activation du Parachute.
                                              <br />
                                              S_CM = Vmax·t_parachute
                                              <br /> 
                                            </div>
                                          }>                    
                            <label className="block text-sm font-medium text-gray-700">
                              Manoeuvre de contigence S_CM (m) 
                            </label> 
                            </Tooltip>                   
                            <input
                              type="number" 
                              value={assessment.ContingencyVolumeSCM}
                              className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder={(1.0*assessment.maxSpeed).toString()}
                              disabled
                            />                         
                          </div>
                        </div>
                      ) : (
                        <div>
                          {(assessment.uasType || []).includes('Héli') || (assessment.uasType || []).includes('Multi') ? (  
                            <div>
                              <Tooltip  text={
                                              <div>
                                                ThetaStopCopter (deg) 
                                                <br />  
                                                Hypothèses : ThrustWeightRatio supérieur à 2.
                                                <br />
                                                ThetaStopCopter inf 45°
                                                <br />
                                                en assumant un angle de roulis φ nul.
                                              </div>
                                            }>
                                <label className="block text-sm font-medium text-gray-700">
                                  Theta Max Stop (deg) 
                                </label>
                              </Tooltip>
                              <input
                                type="number"
                                defaultValue={45.0}
                                value={assessment.ThetaStopCopter}
                                onChange={(e) => onChange({ ...assessment, ThetaStopCopter: parseFloat(e.target.value) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                                step="1.0"
                                min={0.0} // Définit la valeur minimale autorisée
                                max={45.0} // Définit la valeur maximale autorisée
                                className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder={'TO BE DEFINED'}
                              />
                            </div>
                          ) : (// (assessment.uasType || []).includes('Avion') || (assessment.uasType || []).includes('Hybride') ?( 
                            <div><Tooltip  text={
                                              <div>
                                                PhiMaxPlane (deg) 
                                                <br />  
                                                Hypothèses : Virrage à 180° en mode Avion.
                                                <br />
                                                PhiMaxPlane inf φ 30°
                                                <br />
                                                en assumant un angle de roulis  nul.
                                              </div>
                                            }>
                                <label className="block text-sm font-medium text-gray-700">
                                  PhiMaxPlane (deg) 
                                </label>
                              </Tooltip>
                              <input
                                type="number"
                                defaultValue={30.0}
                                value={assessment.PhiMaxPlane}
                                onChange={(e) => onChange({ ...assessment, PhiMaxPlane: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                                step="1.0"
                                min={0.0} // Définit la valeur minimale autorisée
                                max={30.0} // Définit la valeur maximale autorisée
                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.PhiMaxPlane === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                                placeholder={'TO BE DEFINED'}
                              />
                            </div>
                          
                          )}
                          <Tooltip  text={
                                          <div>
                                            Manoeuvre de contigence S_CM (m) 
                                            <br />                                    
                                            * Hélicoptère/Multi-rotor ≡ Arrêt d'urgence
                                            <br />
                                            S_CM = 1/2·Vmax²/(g·tan(θ))
                                            <br />  
                                            * Avion/Hybride/Plus léger que l'air ≡ Virage à 180°
                                            <br />
                                            S_CM = Vmax²/(g·tan(φ))
                                            <br />
                                            en assumant un angle de roulis φ de 30°.
                                            <br />
                                            ou bien 
                                            <br />
                                            S_CM = 180°/(2·taux de virage max)
                                          </div>
                                        }>
                            <label className="block text-sm font-medium text-gray-700">
                              Manoeuvre de contigence S_CM (m) 
                            </label>
                          </Tooltip>
                          <input
                            type="number"
                            value={assessment.ContingencyVolumeSCM}
                            onChange={(e) => onChange({ ...assessment, ContingencyVolumeSCM: parseFloat(e.target.value) })}
                            step="0.1"
                            min={1.0} // Définit la valeur minimale autorisée
                            className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder={CalculVolumeSCM()?.at(0)}
                            disabled
                          />
                        </div>



                      )}
                    </div>
                    {/* {assessment.ContingencyParachuteManeuver ==='Manoeuvre de Contingence  Alternative "Parachute"' ? ( */}
                    <div>
                                          
                      <br />
                      <br />
                      
                      <br />
                      <br />
                      
                        
                      <div>
                        <Tooltip  text={
                                        <div>
                                          Manoeuvre de contigence verticale H_CM (m) 
                                          <br />                                    
                                          Alternative : Activation du Parachute.
                                          <br />
                                          H_CM = Vmax·t_parachute·0.7
                                          <br /> 
                                        </div>
                                      }>                    
                        <label className="block text-sm font-medium text-gray-700">
                        Altitude de contigence H_CM (m)
                        </label> 
                        </Tooltip>                   
                        <input
                          type="number"
                          value={assessment.ContingencyVolumeHCM}
                          className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder={(1.0*0.7*assessment.maxSpeed).toString()}
                          disabled
                        />                                             
                      </div>
                    </div>
                                                    


                </div>               
              ) : assessment.assessmentContingencyVolume ===
              'Spécifiée par le déposant' ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur du Volume de Contingence. 
                                          <br />
                                          Attention : Des valeurs inférieures à la Largeur du Volume d'évolution sont considérées irrecevables. 
                                          <br />
                                          S_CV ≥ S_FG
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        S_CV : Largeur du Volume de Contingence (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.ContingencyVolumeWidth}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeWidth: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyWidth)}
                    />
                    </div> 
                    <div>
                    <Tooltip  text={
                                        <div>
                                          Hauteur du Volume de Contingence. 
                                          <br />                                    
                                          Attention : Des valeurs inférieures à la Hauteur du Volume d'évolution sont considérées irrecevables.  
                                          <br />
                                          H_CV ≥ H_FG
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        H_CV : Hauteur du Volume de Contingence (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.ContingencyVolumeHeight}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          ContingencyVolumeHeight: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyHeight)) || 0.000
                        })
                      }
                      step="0.1"
                      min={assessment.FlightGeographyHeight} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyHeight)}
                    />
                    </div>
                  </div>
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Volume de Contingence
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.ContingencyVolume_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            ContingencyVolume_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>

              ) : (
                <div></div>
              )
            }  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">   
            <h2 className="text-lg font-medium">Etape 2.3 : Determination du Zone Tampon (Ground Risk Buffer).</h2>
                  {/* Limitation des choix possible en fonction du type d'UAS :   (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && (assessment.GlidingCapability === undefined || assessment.GlidingCapability === null) ? (*/}
                  {(assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && assessment.GlidingCapability === 'OUI' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>                  
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison Aile Fixe">
                        Terminaison Aile Fixe
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && assessment.GlidingCapability === 'NON' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >  
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  
                  ) : (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && (assessment.GlidingCapability === undefined || assessment.GlidingCapability === null) ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>                  
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison Aile Fixe">
                        Terminaison Aile Fixe
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ):assessment.uasType === 'Hélicoptère' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Approche Balistique (Hélicoptère ou Multirotor)">
                        Approche Balistique (Hélicoptère ou Multirotor)
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): assessment.uasType === 'Multirotor' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Approche Balistique (Hélicoptère ou Multirotor)">
                        Approche Balistique (Hélicoptère ou Multirotor)
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): assessment.uasType === 'Plus léger que l\'air' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ):( //Autre
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  )}          
          
          
          </div>
          <div>
          
            {/* Limitation des choix possible en fonction du type d'UAS */}
            {(assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Vous devez définir si votre appareil peut effectuer un vol plané. 
                  <br />
                  Attention de bien rester cohérent si vous changez votre déclaration vis à vis de celle utilisez dans le modèle JARUS pour l'évaluation de la zone de crash. 
                  <br />
                  Si aucune capacité de vol plané n'est possible, seule la règle 1:1 ou la terminaison avec parachute peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            
            ): assessment.uasType === 'Hélicoptère' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seules les règles compatibles peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ): assessment.uasType === 'Multirotor' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seules les règles compatibles peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ): assessment.uasType === 'Plus léger que l\'air' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seule la règle 1:1 peut être appliquée.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ):( //Autre
              <div className="text-red-900 border-gray-300 rounded">
                  <b>-Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seule la règle 1:1 peut être appliquée.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            )}

            {/* Gestion des affichage selon le type de calcul spécifié pour la GRB */}
            {assessment.assessmentGRB ===
              'Approche Simplifiée, Règle 1:1' ? (
                <div>
                  {/* <label>'Approche Simplifiée, Règle 1:1'</label> */}
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      //defaultValue={assessment.ContingencyVolumeHeight}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.ContingencyVolumeHeight} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')} 
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>               
              ) : assessment.assessmentGRB ===
              'Approche Balistique (Hélicoptère ou Multirotor)' ? (
                // {assessment.uasType === ''}
                <div>
                  <label>'Approche Balistique (Hélicoptère ou Multirotor)'</label>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Terminaison Aile Fixe' ? (
                // {assessment.uasType === ''}
                <div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Coupure de l'alimentation.
                      </label>
                      <input
                        type="checkbox"
                        //checked={(assessment.GRB_FixedWingPowerOff || []).includes('ACTIVATED')}
                        onChange={handleOnChangeFixedWingPowerOff}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked={GRB_FixedWingPowerOffActivationbydefault()}
                      />
                    </div>
                    {((assessment.GRB_FixedWingPowerOff).includes('ACTIVATED')) ?(
                      <div>
                        <div>
                          <b>Rappel :</b>Vous avez déclaré "{assessment.GlidingCapability}" pour la capacité de vol plané dans le Modèle JARUS pour l'évaluation de la Zone de Crash.
                          <br />
                          <br />
                          Sinon, définissez Theta_Glide en cohérence avec celui utilisé dans le Modèle JARUS, soit "{assessment.ThetaGlide}°".
                          
                        </div>

                      </div>
                    ):(
                      
                      <div>
                        Si vous n'activé pas de Coupure de l'alimentation la règle du 1:1 sera appliquée car GRB_FixedWingPowerOff = {assessment.GRB_FixedWingPowerOff}
                      </div>


                    )}

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div>
                      <Tooltip text=" ">
                        <label className="block text-sm font-medium text-gray-700">
                          L'appareil est-il capable de planer ?
                        </label>
                      </Tooltip>
                      <select
                        value={assessment.GlidingCapability}
                        onChange={handleOnChangeGlidingCapability}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation">
                          Sélectionner une méthode d'évaluation
                        </option>
                        <option value="NON">NON</option>
                        <option value="OUI">OUI</option>
                      </select>
                    </div> 
                    <div>
                          <Tooltip text="Angle d'impact (de plané/fauché.) NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                            <label className="block text-sm font-medium text-gray-700">
                              Theta_Glide (deg)
                            </label>
                          </Tooltip>
                          <input
                            type="number"
                            value={assessment.ThetaGlide}
                            onChange={(e) =>
                              onChange({
                                ...assessment,
                                ThetaGlide: parseFloat(e.target.value) || 0.000
                              })
                            }
                            step="0.1"
                            min={0}
                            max={90}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.ThetaGlide === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                            //placeholder={AdviceThetaGlide().toString()}
                            
                          /> 
                    </div>
                  </div>






                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Terminaison avec parachute' ? (
                // {assessment.uasType === ''}
                <div>
                  
                  {/* Si ParachuteTime déjà définie on la rappelle ici en précisant origine de la def  */}
                  {assessment.ParachuteTime && (assessment.ContingencyParachuteManeuver || []).includes('OUI') ? (
                    
                      <label>Temps d'activation du parachute déjà définie pour la manoeuvre de contingence : {assessment.ParachuteTime}(s)</label>
                  ):( 
                    // Sinon on ajoute une entrée pour la spécifier
                      <div>
                        <Tooltip  text={
                                        <div>
                                          Temps d'activation du parachute (s)  
                                          <br />                                    
                                          Doit prendre en compte le temps d'ouverture et de mise en descente.
                                          <br />
                                          Ne peut être inférieur à 1 seconde.
                                        </div>
                                      }>
                        <label className="block text-sm font-medium text-gray-700">
                            Temps d'activation du parachute (s) 
                        </label>
                        </Tooltip>
                        <input
                          type="number"
                          value={assessment.ParachuteTime}
                          defaultValue={1.0}
                          onChange={(e) => onChange({ ...assessment, ParachuteTime: parseFloat(e.target.value), GRBWidth: CalulGRB()})}
                          step="0.1"
                          min={1.0} // Définit la valeur minimale autorisée
                          className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder={"1.0"}
                        />
                      </div>                          

                  )}
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Vitesse de déscente sous parachute (m/s)
                                          <br />
                                          Généralement de l'ordred de 6.0 m/s
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse de déscente sous parachute (m/s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.VzParachute}
                      onChange={(e) => onChange({ ...assessment, VzParachute: parseFloat(e.target.value) })}
                      step="0.1"
                      min={3.0} // Définit la valeur minimale autorisée
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                        assessment.VzParachute === undefined
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder={"6.0"}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Vitesse du vent considéré pour la déscente sous parachute (m/s)
                                          <br />
                                          Elle doit être comprise entre la Vitesse maximale du vent au décollage et la Vitesse maximale de tenue à la rafale en évolution .
                                          <br />
                                          Ces valeur ont été déclarées dans la section "Limitations environnementales" à l'Étape 1 : Concept d'opérations / ConOps
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse du vent considéré pour la déscente sous parachute (m/s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.VwindParachute}
                      onChange={(e) => onChange({ ...assessment, VwindParachute: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.environmentalLimitations.maxWindSpeedTakeoff} // Définit la valeur minimale autorisée
                      max={assessment.environmentalLimitations.maxGustSpeed} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.environmentalLimitations.maxWindSpeedTakeoff).toString()}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Spécifiée par le déposant' ? (
                // {assessment.uasType === ''}
                <div>
                  <label>'Autre Terminaison à préciser'</label>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.GRBWidth}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyWidth)}
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : (
                <div>
                  
                </div>
              )
            } 

          </div> 








          
          <h2 className="text-lg font-medium">Etape 2.4 : Determination de la Zone Adjacente (Adjacent Volume).</h2>    
          <img 
                    src={AdjacenteArea}
                    alt="AdjacenteArea" 
                    className="w-auto h-auto mb-6 mx-auto"
                  />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            
                <div>
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
                    value={CalculAdjacentVolumeWidth()}
                    onChange={(e) => onChange({ ...assessment, AdjacentVolumeWidth: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(5000.0)}
                    disabled
                  />  
                </div> 
                <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Limité à la valeur maximale du Range atteignable par l'UAS en 3 minutes.
                      </label>
                      <input
                        type="checkbox"
                        checked={(assessment.AdjacentVolumeWidthEqualMaxRange || []).includes('OUI')}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            AdjacentVolumeWidthEqualMaxRange: e.target.checked
                              ? 'OUI'
                              : 'NON',
                              AdjacentVolumeWidth: CalculAdjacentVolumeWidth(),
                          })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        
                      />
                </div>
                <div>
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
                    value={CalculAdjacentVolumeHeight()}
                    onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(0.0)}
                    disabled
                  />  
                </div> 
                {assessment.AdjacentVolumeWidthEqualMaxRange ===
              'OUI' ? (
                <div>
                  <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Zone Adjacente.">
                    <label className="block text-sm font-medium text-gray-700">
                      Justification de votre Zone Adjacente (Adjacent Volume)
                    </label>
                  </Tooltip>
                  <textarea
                      value={assessment.AdjacentVolume_Justification}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          AdjacentVolume_Justification: e.target.value,
                        })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                    />
                </div>
              ) : (
                <div>
                  </div>
              )}             
             
          </div> 
          
        </div>
      </section>

      <section className="space-y-4">  
        <div className="bg-gray-200 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <h2 className="text-lg font-medium">Ground Risk Assessment Initial<button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Main-Body-Release-JAR_doc_25.pdf#page=33', '_blank')}  
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS SORA v2.5 Main Body - Section 4.2 Step #2 – Determination of the intrinsic Ground Risk Class (iGRC) "
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </h2>
            <div>
                <Tooltip text={
                                  <div>
                                    <li>Le calcul de l'iGRC peut être déterminer par l'utilisateur qui devra alors fournir la densité de population, la vitesse maximale de l'UAS et la dimension caractéristique maximale étant alors utilisé pour déterminer un iGRC selon la table. Une justification de la densioté de population doit être fournie, en justifiant de la base de donnée de population utilisée.</li>
                                    <br />                                    
                                    <li>Sinon l'utilisateur peut choisir de générer un fichier d'input pour utiliser l'outil DROSERA(c). Il reportera le fichier de résultat DROSERA dans le champ à cet effet. </li>
                                    <br />
                                    <li>Enfin le déposant peut choisir de spécifier lui-même l'iGRC. Dans ce cas il devra remplir les informations tel que pour le calcul selon les table SORA qui lui fourniront alors à titre indicatif un iGRC. Le déposant devra alors sélectionner et justifier de son iGRC plus bas.</li>
                                  </div>
                }>
                  <label className="block text-sm font-medium text-gray-700">
                    Méthode d'évaluation de l'iGRC
                  </label>
                </Tooltip>
                <select
                  value={assessment.assessmentiGRC}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      assessmentiGRC: e.target
                        .value as assessmentiGRC,
                      iGRCNumber:
                        e.target.value === 'Spécifiée par le déposant'
                          ? assessment.iGRCNumber
                          : 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">                
                  <option value="Sélectionner une méthode d'évaluation iGRC">
                    Sélectionner une méthode d'évaluation iGRC
                  </option>
                  <option value="Calcul selon les tables SORA">
                    Calcul selon les tables SORA 
                  </option>
                  <option value="Calcul DROSERA">
                    Calcul DROSERA 
                  </option>
                  <option value="Spécifiée par le déposant">
                    Spécifiée par le déposant
                  </option>
                </select>
            </div>
              
                
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dimensions caractéristiques maximales (m)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxCharacteristicDimension}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vitesse maximales (m/s)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxSpeed}
                    </div>
                  </div>  
                  <img 

                    src={DefinitionOfFootprints}
                    alt="Centres d'Essais Drones France" 
                    className="w-auto h-auto mb-6 mx-auto md:col-span-2"
                  />
           <div>
                <Tooltip text={
                                  <div>
                                    <li>BDD Population</li>
                                    <br />                                    
                                    <li>. </li>
                                    <br />
                                    <li>.</li>
                                  </div>
                }>
                  <label className="block text-sm font-medium text-gray-700">
                    Base de donnée de population
                  </label>
                </Tooltip>
                <select
                  value={assessment.PopulationDensityDataBase}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      PopulationDensityDataBase: e.target
                        .value as PopulationDensityDataBase,
                      PopulationDensityDataBaseNumber:
                        e.target.value === 'Spécifiée par le déposant'
                          ? assessment.PopulationDensityDataBaseNumber
                          : 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">                
                  <option value="Sélectionner une Base de donnée de population">
                    Sélectionner une Base de donnée de population
                  </option>
                  <option value="INSEE_Filosofi2019_200m">
                    INSEE_Filosofi2019_200m
                  </option>
                  <option value="GHS_POP_E2025_GLOBE_R2023A_54009_100_V1_0_dens">
                    GHS_POP_E2025_GLOBE_R2023A_54009_100_V1_0_dens
                  </option>
                </select>
            </div>

          </div>   

          {assessment.assessmentiGRC ===
              'Calcul selon les tables SORA' || assessment.assessmentiGRC ==='Spécifiée par le déposant' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      iGRC Footprint : Densité Maximale de population(ppl/km²)
                    </label>
                    <select
                      value={assessment.populationDensity || 'Zone Contrôlée'}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          populationDensity: e.target.value as PopulationDensity,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Sélectionner une Densité de population">
                        Sélectionner une Densité de population
                      </option>
                      <option value="Zone Contrôlée">Zone Contrôlée</option>
                      <option value="<5">&lt;5</option>
                      <option value="<50">&lt;50</option>
                      <option value="<500">&lt;500</option>
                      <option value="<5,000">&lt;5,000</option>
                      <option value="<50,000">&lt;50,000</option>
                      <option value=">50,000">&gt;50,000</option>
                    </select>
                  </div> 
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la Densité de population sélectionnée.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Densité Maximale de population (iGRC Footprint)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.PopulationDensity_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            PopulationDensity_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div> 
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Zone adjacente : Densité Moyenne de population(ppl/km²)
                      </label>
                      <select
                        value={assessment.populationDensityAdjacentArea || 'Zone Contrôlée'}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            populationDensityAdjacentArea: e.target.value as PopulationDensity,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une Densité de population">
                          Sélectionner une Densité de population
                        </option>
                        <option value="Zone Contrôlée">Zone Contrôlée</option>
                      <option value="<5">&lt;5</option>
                      <option value="<50">&lt;50</option>
                      <option value="<500">&lt;500</option>
                      <option value="<5,000">&lt;5,000</option>
                      <option value="<50,000">&lt;50,000</option>
                      <option value=">50,000">&gt;50,000</option>
                      </select>
                    </div> 
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la Densité de population sélectionnée.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Densité de population moyenne en zone adjacente
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.PopulationDensity_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            PopulationDensity_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>      
                </div>  
                
              ) : assessment.assessmentiGRC === 'Calcul DROSERA' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    // onClick={() => exportToExcel(formData)}
                    onClick={() => generateDroseraInputFile()}
                    className=" flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Générer le fichier d'input pour DROSERA
                  </button>
                  <div></div>

                  <div>
                    <Tooltip text="Insérez fichier html output drosder">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drosera ouptut HTML
                      </label>
                    </Tooltip>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <input
                        ref={DroserafileInputRef}
                        type="file"
                        accept=".html"
                        onChange={handleDroseraOutputFileChange}
                        className="hidden"
                      // multiple
                      />
                      <div
                        onClick={() => DroserafileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Déposer le fichier Drosera HTML ici
                        </span>
                      </div>
                    </div>
                    {errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                        {errorMessage}
                      </div>
                    )}
                    
                    {assessment.droseraOutputFile && assessment.droseraOutputFile.length > 0 && (
                    <div className="mt-2 space-y-2">
                    {assessment.droseraOutputFile.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded"
                          >
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                              onClick={() => handleRemoveDroseraOutputFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                    </div>
                    )}
                </div>
                      <div className="bg-gray-400 p-4 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                          Résultat de l'analyse DROSERA
                        </label>
                        <div>
                          
                        </div>
                              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                {assessment.DroseraResTable && assessment.DroseraResTable.length > 0 ? (
                                  <table className="min-w-full bg-white">
                                    <thead>
                                      <tr className="bg-gray-100 text-black">
                                        <th className="py-2 px-4 border-b">Critical area (m²)</th>
                                        <th className="py-2 px-4 border-b">Max population density (ppl/km²)</th>
                                        <th className="py-2 px-4 border-b">Max iGRC</th>
                                        <th className="py-2 px-4 border-b">Average population density in adjacent area (ppl/km²)</th>
                                        <th className="py-2 px-4 border-b">Average iGRC in adjacent area</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      
                                        <tr className="bg-gray-50 text-gray-700">
                                          <td className="py-2 px-4 border-b">{assessment.DroseraResTable[0]}</td>
                                          <td className="py-2 px-4 border-b">{assessment.DroseraResTable[1]}</td>
                                          <td className="py-2 px-4 border-b">{assessment.DroseraResTable[2]}</td>
                                          <td className="py-2 px-4 border-b">{assessment.DroseraResTable[3]}</td>
                                          <td className="py-2 px-4 border-b">{assessment.DroseraResTable[4]}</td>
                                        </tr>   
                                      
                                    </tbody>
                                  </table>  
                                ) : (
                                  <div className="text-gray-600">
                                    Aucune donnée disponible. Veuillez télécharger un fichier DROSERA valide.   
                                  </div>
                                )}
                              </div>
                      </div>
                      <div>
                            <label className="block text-sm font-medium text-gray-700">
                              iGRC Footprint : Densité Maximale de population(ppl/km²)
                            </label>
                            <select
                              value={assessment.populationDensity || 'Zone Contrôlée'}
                              onChange={(e) =>
                                onChange({
                                  ...assessment,
                                  populationDensity: e.target.value as PopulationDensity,
                                })
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="Zone Contrôlée">Zone Contrôlée</option>
                              <option value="<5">&lt;5</option>
                              <option value="<50">&lt;50</option>
                              <option value="<500">&lt;500</option>
                              <option value="<5,000">&lt;5,000</option>
                              <option value="<50,000">&lt;50,000</option>
                              <option value=">50,000">&gt;50,000</option>
                            </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Zone adjacente : Densité Moyenne de population(ppl/km²)
                        </label>
                        <select
                          value={assessment.populationDensityAdjacentArea || 'Zone Contrôlée'}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              populationDensityAdjacentArea: e.target.value as PopulationDensity,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Sélectionner une Densité de population">
                            Sélectionner une Densité de population
                          </option>
                          <option value="Zone Contrôlée">Zone Contrôlée</option>
                          <option value="<5">&lt;5</option>
                          <option value="<50">&lt;50</option>
                          <option value="<500">&lt;500</option>
                          <option value="<5,000">&lt;5,000</option>
                          <option value="<50,000">&lt;50,000</option>
                          <option value=">50,000">&gt;50,000</option>
                        </select>
                      </div> 
                  </div>
                
              ) : (
                <div></div>
              )
        }

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                  <h2 className="text-1xl font-semibold">Tableau de détermination de l'iGRC</h2>
                    {assessment.assessmentiGRC !== 'Calcul DROSERA' ? (
                      <div>
                        <Tooltip text="Attention : Si vous activez une réduction de l'iGRC via cette option, et que vous la confirmée plus bas, vous devrez considérer que toute mitigation de type M2 lors de l'étape 3 sera jugée en regard de la catégorie de dimension attenante.">
                          <label className="block text-sm font-medium text-gray-700">
                            Utiliser la classe de Dimension Caractéristique Max. Applicable selon le calcul de la crash Area
                          </label>
                        </Tooltip>
                      <div> </div>
                      
                      <input
                        type="checkbox"
                        checked={(assessment.UsemaxCharacteristicDimension || []).includes('OUI')}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            UsemaxCharacteristicDimension: e.target.checked
                              ? 'OUI'
                              : 'NON',
                          })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        
                      />
                      <div className=" text-gray-200">{ComputeiGRC_colIndex()} </div>   
                      <Tooltip text="Attention : Si vous activez une réduction de l'iGRC via cette option, et que vous la confirmée plus bas, vous devrez considérer que toute mitigation de type M2 lors de l'étape 3 sera jugée en regard de la catégorie de dimension attenante.">
                        {assessment.UsemaxCharacteristicDimension ===
                      'OUI' ? (
                        <div> Dimension Caractéristique Maximale utilisée : {assessment.maxCharacteristicDimensionClass}m</div>
                          ): (
                        <div> Dimension Caractéristique Maximale utilisée : {assessment.maxCharacteristicDimension}m</div>)}
                      </Tooltip>
                      </div>
                                          ) : (
                          <div className=" text-gray-200">
                            {assessment.UsemaxCharacteristicDimension = 'NON'}
                            {ComputeiGRC_colIndex()}
                            <div className=" text-gray-600">
                              Dimension Caractéristique Maximale utilisée : {assessment.maxCharacteristicDimension}m
                            </div>
                          </div>
                    )}



                  <table className="min-w-full bg-white md:col-span-2">
                    <thead>
                      <tr className="bg-gray-100 text-black">
                        <Tooltip text="En bleu l'iGRC selon les tables SORA, en gris l'iGRC moyen dans la zone adjacente. Si vous avez utilisé les calculs DROSERA ces valeurs sont potentiellement majorante.">
                        <th colspan="7" className='  py-2 px-4 border-b'>Classe d'iGRC</th>
                        </Tooltip>
                      </tr>
                      <tr className="bg-blue-500 text-white">
                        <th colspan="2" className="bg-blue-400 py-2 px-4 border-b">Dimension caractéristique Maimale</th>
                        <th className="py-2 px-4 border-b">1m / appro. 3ft</th>
                        <th className="py-2 px-4 border-b">3m / appro. 10ft</th>
                        <th className="py-2 px-4 border-b">8m / appro. 25ft</th>
                        <th className="py-2 px-4 border-b">20m / appro. 65ft</th>
                        <th className="py-2 px-4 border-b">40m / appro. 130ft</th>
                      </tr>
                      <tr className="bg-green-500 text-white">
                        <th colspan="2" className="bg-green-400 py-2 px-4 border-b">Vitesse de Croisière Maximale</th>
                        <th className="py-2 px-4 border-b">25 m/s</th>
                        <th className="py-2 px-4 border-b">35 m/s</th>
                        <th className="py-2 px-4 border-b">75 m/s</th>
                        <th className="py-2 px-4 border-b">150 m/s</th>
                        <th className="py-2 px-4 border-b">200 m/s</th>
                      </tr>
                    </thead>
                    <tbody>
                      <th rowspan="8" className="bg-red-200 text-black">Densité de population iGRC Maximale (ppl/km²)</th>
                      {tableiGRCData.map((row, index) => (
                        <tr
                          key={index}
                          className={'bg-gray-200 text-gray-400'}
                        >
                          
                      
                          <th className="py-2 px-4 border-b bg-red-200 text-black">{row.PopDensity}</th>
                          {/* <th className={
                          row.PopDensity.endsWith(assessment.populationDensity) && iGRC_colIndex==1
                          ? 'bg-blue-900  text-white'
                          : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS1}    </th>
                          <th className={
                          row.PopDensity.endsWith(assessment.populationDensity) && iGRC_colIndex==2
                          ? 'bg-blue-900  text-white'
                          : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS2}</th>
                          <th className={
                          row.PopDensity.endsWith(assessment.populationDensity) && iGRC_colIndex==3
                          ? 'bg-blue-900  text-white'
                          : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS3}</th>
                          <th className={
                          row.PopDensity.endsWith(assessment.populationDensity) && iGRC_colIndex==4
                          ? 'bg-blue-900  text-white'
                          : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS4}</th>
                          <th className={
                          row.PopDensity.endsWith(assessment.populationDensity) && iGRC_colIndex==5
                          ? 'bg-blue-900  text-white'
                          : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS5}</th> */}
                          <th className={
                            assessment.iGRC_colIndex == 1
                              ?  (
                                row.PopDensity.endsWith(assessment.populationDensity) && row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                  ? 'bg-blue-400 text-white border-2 border-gray-500'
                                  : row.PopDensity.endsWith(assessment.populationDensity)
                                    ? 'bg-blue-400 border-2 border-blue-500 text-white'
                                    : row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                    ? 'bg-gray-400 border-2 border-gray-500 text-white'
                                    : 'py-2 px-4 border-b'
                              )
                              : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS1}    </th>
                          <th className={
                           assessment.iGRC_colIndex==2
                              ?  (
                                row.PopDensity.endsWith(assessment.populationDensity) && row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                  ? 'bg-blue-400 text-white border-2 border-gray-500'
                                  : row.PopDensity.endsWith(assessment.populationDensity)
                                    ? 'bg-blue-400 border-2 border-blue-500 text-white'
                                    : row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                    ? 'bg-gray-400 border-2 border-gray-500 text-white'
                                    : 'py-2 px-4 border-b'
                              )
                              : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS2}</th>
                          <th className={
                           assessment.iGRC_colIndex==3
                              ? (
                                row.PopDensity.endsWith(assessment.populationDensity) && row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                  ? 'bg-blue-400 text-white border-2 border-gray-500'
                                  : row.PopDensity.endsWith(assessment.populationDensity)
                                    ? 'bg-blue-400 border-2 border-blue-500 text-white'
                                    : row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                    ? 'bg-gray-400 border-2 border-gray-500 text-white'
                                    : 'py-2 px-4 border-b'
                              )
                              : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS3}</th>
                          <th className={
                           assessment.iGRC_colIndex==4
                              ?  (
                                row.PopDensity.endsWith(assessment.populationDensity) && row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                  ? 'bg-blue-400 text-white border-2 border-gray-500'
                                  : row.PopDensity.endsWith(assessment.populationDensity)
                                    ? 'bg-blue-400 border-2 border-blue-500 text-white'
                                    : row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                    ? 'bg-gray-400 border-2 border-gray-500 text-white'
                                    : 'py-2 px-4 border-b'
                              )
                              : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS4}</th>
                          <th className={
                           assessment.iGRC_colIndex==5
                              ?  (
                                row.PopDensity.endsWith(assessment.populationDensity) && row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                  ? 'bg-blue-400 text-white border-2 border-gray-500'
                                  : row.PopDensity.endsWith(assessment.populationDensity)
                                    ? 'bg-blue-400 border-2 border-blue-500 text-white'
                                    : row.PopDensity.endsWith(assessment.populationDensityAdjacentArea)
                                    ? 'bg-gray-400 border-2 border-gray-500 text-white'
                                    : 'py-2 px-4 border-b'
                              )
                              : 'py-2 px-4 border-b'
                          }>{row.MaxdimCS5}</th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>




              
              <h2 className="text-2xl font-semibold">iGRC</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Tooltip text="Veuillez entrer le niveau GRC Initial Maximal déclaré pour la zone d'Empreinte au sol de l'opération : Volume Opérationel + Zone Tampon.">
                      <label className="block text-sm font-medium text-gray-700">
                        Maximum iGRC (Empreinte au sol de l'opération UAS)
                      </label>
                    </Tooltip>
                    <select
                      value={assessment.iGRC}
                      onChange={(e) =>
                                    onChange({
                                      ...assessment,
                                      iGRC: e.target.value as iGRC,
                                    })
                                  }
                     className="mt-1 block w-full rounded-md border-blue-900 border-2 font-bold bg-blue-50 text-blue-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
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
                  <div>
                    <Tooltip text="Veuillez entrer le niveau GRC Initial déclaré.">
                      <label className="block text-sm font-medium text-gray-700">
                        iGRC Moyen (Zone adjacente)
                      </label>
                    </Tooltip>
                    <select
                      value={assessment.iGRCadjacentArea}
                      onChange={(e) =>
                                    onChange({
                                      ...assessment,
                                      iGRCadjacentArea: e.target.value as iGRC,
                                    })
                                  }
                      className="mt-1 block w-full rounded-md border-blue-900 border-2 font-bold bg-blue-50 text-blue-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
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
                    <div className="bg-gray-400 p-4 md:col-span-2">
                      <Tooltip text="Si votre iGRC déclaré diffère de celui calculé ou si vous avez choisi de spécifier vous même votre iGRC, une justification complémentaire devra être apportée. Dans les autres cas vous pouvez apporter un complément d'information ou laisser ce champ vide.">
                        <label className="block text-sm font-medium text-gray-700">
                          Justification complémnetaire de vos iGRC déclarés
                        </label>
                      </Tooltip>
                      <textarea
                          value={assessment.iGRC_Justification}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              iGRC_Justification: e.target.value,
                            })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={4}
                        />
                    </div> 
                  
                </div>
        </div>
      </section>
        
    </div>
  );
}

 export default GroundRiskInitial;
// export default RiskAssessmentForm;
