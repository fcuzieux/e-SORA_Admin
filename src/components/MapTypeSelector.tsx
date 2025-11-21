import React from 'react';

interface MapTypeSelectorProps {
  mapType: 'standard' | 'satellite';
  onChange: (type: 'standard' | 'satellite') => void;
}

export function MapTypeSelector({ mapType, onChange }: MapTypeSelectorProps) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <span className="text-sm font-medium">Map Type:</span>
      <div className="flex space-x-2">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            value="standard"
            checked={mapType === 'standard'}
            onChange={() => onChange('standard')}
            className="form-radio text-blue-500"
          />
          <span className="text-sm">Standard</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            value="satellite"
            checked={mapType === 'satellite'}
            onChange={() => onChange('satellite')}
            className="form-radio text-blue-500"
          />
          <span className="text-sm">Satellite</span>
        </label>
      </div>
    </div>
  );
}
