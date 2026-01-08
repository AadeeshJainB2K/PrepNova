import { Ollama } from 'ollama';

export interface OllamaModel {
  name: string;
  size: string;
  modified: string;
}

export interface ImageAttachment {
  fileUrl: string;
  mimeType: string;
}

export class OllamaProvider {
  private ollama: Ollama;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.ollama = new Ollama({ host: baseUrl });
  }

  async *generateStream(
    prompt: string,
    history: Array<{ role: string; content: string }>,
    model: string = 'llama3.2:3b',
    images?: ImageAttachment[]
  ): AsyncGenerator<string> {
    try {
      // Format messages for Ollama
      const messages = [
        ...history.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      ];

      // Add user message with optional images
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userMessage: any = {
        role: 'user',
        content: prompt,
      };

      // Add images if provided (for vision models like llava)
      if (images && images.length > 0) {
        // Extract base64 data from data URLs
        userMessage.images = images.map(img => {
          // Remove data:image/jpeg;base64, prefix
          const base64Data = img.fileUrl.includes(',') 
            ? img.fileUrl.split(',')[1] 
            : img.fileUrl;
          return base64Data;
        });
      }

      messages.push(userMessage);

      const response = await this.ollama.chat({
        model,
        messages,
        stream: true,
      });

      for await (const chunk of response) {
        if (chunk.message?.content) {
          yield chunk.message.content;
        }
      }
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error(`Ollama generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.ollama.list();
      return response.models.map(model => ({
        name: model.name,
        size: this.formatSize(model.size),
        modified: typeof model.modified_at === 'string' ? model.modified_at : new Date(model.modified_at).toISOString(),
      }));
    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }

  private formatSize(bytes: number): string {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(1)} GB`;
  }
}
