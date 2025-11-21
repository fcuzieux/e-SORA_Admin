interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {message}
    </div>
  );
}
