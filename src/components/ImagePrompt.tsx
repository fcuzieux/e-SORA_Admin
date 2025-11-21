import React from 'react';
import { Wand2 } from 'lucide-react';

interface ImagePromptProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ImagePrompt({ prompt, onPromptChange, onSubmit, loading }: ImagePromptProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Décrivez l'image que vous souhaitez générer..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          'Génération en cours...'
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Générer l'image
          </>
        )}
      </button>
    </form>
  );
}
