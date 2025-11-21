import React from 'react';
import { X } from 'lucide-react';

interface SaveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
}

export function SaveConfirmDialog({ isOpen, onClose, onSaveAndExit, onExitWithoutSaving }: SaveConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sauvegarder les modifications ?</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Voulez-vous sauvegarder votre travail avant de quitter ?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onExitWithoutSaving}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Quitter sans sauvegarder
          </button>
          <button
            onClick={onSaveAndExit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sauvegarder et quitter
          </button>
        </div>
      </div>
    </div>
  );
}
