import OpenAI from 'openai';
import { API_CONFIG } from '../config/api';
import { OpenAIConfigError, OpenAIGenerationError } from './errors';

const createOpenAIClient = () => {
  if (!API_CONFIG.OPENAI_API_KEY) {
    throw new OpenAIConfigError('La clé API OpenAI n\'est pas configurée. Veuillez ajouter VITE_OPENAI_API_KEY dans votre fichier .env');
  }

  return new OpenAI({
    apiKey: API_CONFIG.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const openai = createOpenAIClient();
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new OpenAIGenerationError('Aucune image n\'a été générée');
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new OpenAIConfigError('Erreur de configuration : Clé API manquante ou invalide');
      }
      throw new OpenAIGenerationError(error.message);
    }
    throw new OpenAIGenerationError('Une erreur inattendue est survenue');
  }
};
