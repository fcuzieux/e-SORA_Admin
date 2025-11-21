import React, { useState } from 'react';
import { generateImage } from '../lib/openai';
import { ImagePrompt } from './ImagePrompt';
import { ImageResult } from './ImageResult';
import { ErrorMessage } from './ErrorMessage';
import { HomeButton } from './HomeButton';

export function ImageGenerator() {
  // ... reste du code inchangé ...

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <HomeButton />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Générateur d'Images AI
        </h1>
        {/* ... reste du code inchangé ... */}
      </div>

      {/* ... reste du code inchangé ... */}
    </div>
  );
}
