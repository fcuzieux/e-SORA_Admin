export class OpenAIConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIConfigError';
  }
}

export class OpenAIGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIGenerationError';
  }
}
