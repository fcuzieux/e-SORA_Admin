import React from 'react';
import { X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  studyName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ isOpen, studyName, onClose, onConfirm }: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Supprimer l'évaluation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Êtes-vous sûr de vouloir supprimer l'évaluation "{studyName}" ? Cette action est irréversible.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
