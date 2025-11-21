import { StepInfo } from '../types/navigation';

export const STEPS: StepInfo[] = [
  {
    id: 'operator-info',
    title: 'Informations sur l\'exploitant',
    subtitle: 'Operator Information',
    description: 'Renseignez les informations concernant l\'exploitant du drone'
  },
  {
    id: 'conops',
    title: 'Étape 1 : Concept d\'opérations / ConOps',
    subtitle: 'Step #1 – Documentation of the proposed operation(s)',
    description: 'Définissez les caractéristiques du drone et de l\'opération'
  },
  {
    id: 'initial-grc',
    title: 'Étape 2 : Détermination du GRC Initial',
    subtitle: 'Step #2 – Determination of the intrinsic Ground Risk Class (iGRC)',
    description: 'Évaluez le risque sol intrinsèque'
  },
  {
    id: 'final-grc',
    title: 'Étape 3 : Atténuation du risque sol et GRC Final',
    subtitle: 'Step #3 – Final Ground Risk Class (GRC) determination (optional)',
    description: 'Déterminez le risque sol final après atténuation (Optionel)'
  },
  {
    id: 'initial-arc',
    title: 'Étape 4 : Détermination de l\'ARC Initial',
    subtitle: 'Step #4 – Determination of the initial Air Risk Class (ARC)',
    description: 'Évaluez le risque air initial'
  },
  {
    id: 'final-arc',
    title: 'Étape 5 : Atténuation du risque air et ARC Résiduel',
    subtitle: 'Step #5 – Application of strategic mitigations to determine residual ARC (optional)',
    description: 'Déterminez le risque air résiduel après atténuation par Mitigation Strategique (Optionel)'
  },
  {
    id: 'tactical-mitigation',
    title: 'Étape 6 : Atténuation tactique du risque « air »',
    subtitle: 'Step #6 – Tactical Mitigation Performance Requirement (TMPR) and robustness levels',
    description: 'Définissez les mesures tactiques d\'atténuation du risque Air'
  },
  {
    id: 'sail',
    title: 'Étape 7 : Détermination du SAIL',
    subtitle: 'Step #7 – Specific Assurance and Integrity Levels (SAIL) determination',
    description: 'Déterminez le niveau SAIL'
  },
  {
    id: 'adjacent-areas',
    title: 'Étape 8 : Identification des exigences de confinement',
    subtitle: 'Step #8 – Determination of Containment requirements',
    description: 'Les exigences de confinement garantissent que le niveau de sécurité visé peut être atteint tant pour les risques au sol que risques airs dans la zone adjacente et l\'Airspace adjacent.'
  },
  {
    id: 'oso',
    title: 'Étape 9 : Objectifs de sécurité opérationnels (OSO)',
    subtitle: 'Step #9 – Identification of Operational Safety Objectives (OSO)',
    description: 'Définissez les objectifs de sécurité'
  },
  {
    id: 'summary',
    title: 'Résumé',
    subtitle: 'Summary',
    description: 'Récapitulatif de votre dossier SORA'
  }
];
