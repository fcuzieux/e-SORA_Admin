import React from 'react';
import { ImageDimensions } from '../types/image';

interface DimensionsInputProps {
  dimensions: ImageDimensions;
  onChange: (dimensions: ImageDimensions) => void;
}

export function DimensionsInput({ dimensions, onChange }: DimensionsInputProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Largeur (px)
        </label>
        <input
          type="number"
          min="1"
          value={dimensions.width}
          onChange={(e) => onChange({ ...dimensions, width: parseInt(e.target.value) || 1 })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hauteur (px)
        </label>
        <input
          type="number"
          min="1"
          value={dimensions.height}
          onChange={(e) => onChange({ ...dimensions, height: parseInt(e.target.value) || 1 })}
          className="w-full p-2 border rounded-md"
        />
      </div>
    </div>
  );
}
