import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StudyNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function StudyNameDialog({ isOpen, onClose, onSubmit }: StudyNameDialogProps) {
  const [studyName, setStudyName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studyName.trim()) {
      onSubmit(studyName.trim());
      setStudyName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nouvelle étude SORA</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'étude
            </label>
            <input
              type="text"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Entrez le nom de l'étude"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
