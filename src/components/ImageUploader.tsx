import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">
        Glissez-déposez une image ici ou{' '}
        <label className="text-blue-500 cursor-pointer hover:text-blue-600">
          parcourez
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  onImageSelect(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </p>
    </div>
  );
}
