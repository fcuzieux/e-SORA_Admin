interface ImageResultProps {
  imageUrl: string;
  prompt: string;
}

export function ImageResult({ imageUrl, prompt }: ImageResultProps) {
  if (!imageUrl) return null;

  return (
    <div className="space-y-4">
      <img
        src={imageUrl}
        alt="Image générée"
        className="w-full rounded-lg shadow-lg"
      />
      <p className="text-sm text-gray-500 text-center">
        Image générée à partir de : "{prompt}"
      </p>
    </div>
  );
}
