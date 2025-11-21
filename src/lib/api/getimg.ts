import axios from 'axios';
import { ResizeOptions } from '../../types/image';
import { API_CONFIG } from '../../config/api';

const API_URL = 'https://api.getimg.ai/v1/transformations/resize';

export async function resizeImage({ imageUrl, width, height }: ResizeOptions): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        image_url: imageUrl,
        width,
        height,
        maintain_ratio: true
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.GETIMG_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.output_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erreur lors du redimensionnement de l\'image');
    }
    throw new Error('Une erreur inattendue est survenue');
  }
}
