import React, { useMemo } from 'react';
import { OperatorInfo } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Calendar } from 'lucide-react';

interface OperatorFormProps {
  operator: OperatorInfo;
  onChange: (operator: OperatorInfo) => void;
}

export function OperatorForm({ operator, onChange }: OperatorFormProps) {
  const errors = useMemo(() => ({
    name: !operator.name.trim(),
    registrationNumber: !operator.registrationNumber.trim(),
    managerName: !operator.managerName.trim(),
    operationalContact: !operator.operationalContact.trim(),
    address: !operator.address.trim(),
    phone: !operator.phone.trim(),
    email: !operator.email.trim()
  }), [operator]);

  const getInputClassName = (fieldName: keyof typeof errors) => {
    return `mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
      errors[fieldName] 
        ? 'border-red-300 focus:border-red-500 bg-red-50' 
        : 'border-gray-300 focus:border-blue-500'
    }`;
  };

  const getLabelClassName = (fieldName: keyof typeof errors) => {
    return `block text-sm font-medium ${errors[fieldName] ? 'text-red-600' : 'text-gray-700'}`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Informations sur l'exploitant</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={getLabelClassName('name')}>
              Nom de l'opérateur *
            </label>
            <Tooltip text="Nom de l'opérateur de l'UAS tel qu'il a été déclaré au cours de la procédure d'enregistrement.">
              <input
                type="text"
                value={operator.name}
                onChange={(e) => onChange({ ...operator, name: e.target.value })}
                className={getInputClassName('name')}
              />
            </Tooltip>
          </div>

          <div>
            <label className={getLabelClassName('registrationNumber')}>
              Numéro d'enregistrement *
            </label>
            <Tooltip text="Numéro d'enregistrement de l'opérateur UAS conformément à l'article 14 du règlement (UE) 219/947.">
              <input
                type="text"
                value={operator.registrationNumber}
                onChange={(e) => onChange({ ...operator, registrationNumber: e.target.value })}
                className={getInputClassName('registrationNumber')}
              />
            </Tooltip>
          </div>

          <div className="md:col-span-2">
            <label className={getLabelClassName('managerName')}>
              Nom du gestionnaire responsable *
            </label>
            <Tooltip text="Nom du dirigeant responsable ou, dans le cas d'une personne physique, nom de l'opérateur de l'UAS.">
              <input
                type="text"
                value={operator.managerName}
                onChange={(e) => onChange({ ...operator, managerName: e.target.value })}
                className={getInputClassName('managerName')}
              />
            </Tooltip>
          </div>

          <div className="md:col-span-2">
            <label className={getLabelClassName('operationalContact')}>
              Point de contact opérationnel *
            </label>
            <Tooltip text="Coordonnées de la personne responsable de l'opération.">
              <input
                type="text"
                value={operator.operationalContact}
                onChange={(e) => onChange({ ...operator, operationalContact: e.target.value })}
                className={getInputClassName('operationalContact')}
              />
            </Tooltip>
          </div>

          <div className="md:col-span-2">
            <label className={getLabelClassName('address')}>
              Adresse *
            </label>
            <textarea
              value={operator.address}
              onChange={(e) => onChange({ ...operator, address: e.target.value })}
              rows={2}
              className={getInputClassName('address')}
            />
          </div>

          <div>
            <label className={getLabelClassName('phone')}>
              Téléphone *
            </label>
            <input
              type="tel"
              value={operator.phone}
              onChange={(e) => onChange({ ...operator, phone: e.target.value })}
              className={getInputClassName('phone')}
            />
          </div>

          <div>
            <label className={getLabelClassName('email')}>
              Email *
            </label>
            <input
              type="email"
              value={operator.email}
              onChange={(e) => onChange({ ...operator, email: e.target.value })}
              className={getInputClassName('email')}
            />
          </div>
        </div>

        {Object.values(errors).some(Boolean) && (
          <p className="text-sm text-red-600 mt-2">
            * Veuillez remplir tous les champs obligatoires
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Résumé de l'opération UAS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date prévue pour le début de l'opération
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                value={operator.startDate || ''}
                onChange={(e) => onChange({ ...operator, startDate: e.target.value })}
                className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin prévue
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                value={operator.endDate || ''}
                onChange={(e) => onChange({ ...operator, endDate: e.target.value })}
                className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Lieu(x) prévu(s) pour l'opération
            </label>
            <textarea
              value={operator.locations || ''}
              onChange={(e) => onChange({ ...operator, locations: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Saisissez les lieux prévus pour l'opération..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Référence et révision de l'évaluation des risques
            </label>
            <select
              value={operator.riskAssessmentVersion || 'SORA 2.5'}
              onChange={(e) => onChange({ ...operator, riskAssessmentVersion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="SORA 2.5">SORA 2.5</option>
              {/* <option value="SORA 2.0">SORA 2.0</option> */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
