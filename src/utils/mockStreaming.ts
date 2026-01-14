export type StreamSpeed = 'fast' | 'normal' | 'slow';

export interface StreamChunk {
  text: string;
  timestamp: Date;
}

export interface StreamConfig {
  speed: StreamSpeed;
  chunks: StreamChunk[];
}

const SPEED_DELAYS = {
  fast: 30,
  normal: 100,
  slow: 300,
};

export async function* streamText(text: string, speed: StreamSpeed = 'normal'): AsyncGenerator<StreamChunk> {
  const delay = SPEED_DELAYS[speed];
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    const chunk = words.slice(i, i + 3).join(' ') + ' ';
    yield {
      text: chunk,
      timestamp: new Date(),
    };
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export async function streamTextFull(
  text: string,
  speed: StreamSpeed = 'normal',
  onChunk?: (chunk: StreamChunk) => void
): Promise<void> {
  for await (const chunk of streamText(text, speed)) {
    if (onChunk) {
      onChunk(chunk);
    }
  }
}

export async function* simulateStream(
  chunks: StreamChunk[],
  speed: StreamSpeed = 'normal'
): AsyncGenerator<StreamChunk> {
  const delay = SPEED_DELAYS[speed];
  
  for (const chunk of chunks) {
    yield {
      ...chunk,
      timestamp: new Date(),
    };
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export async function simulateStreamFull(
  chunks: StreamChunk[],
  speed: StreamSpeed = 'normal',
  onChunk?: (chunk: StreamChunk) => void
): Promise<void> {
  for await (const chunk of simulateStream(chunks, speed)) {
    if (onChunk) {
      onChunk(chunk);
    }
  }
}

export class StreamController {
  private cancelled = false;
  private paused = false;

  cancel() {
    this.cancelled = true;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  isCancelled() {
    return this.cancelled;
  }

  isPaused() {
    return this.paused;
  }

  async waitIfPaused() {
    while (this.paused && !this.cancelled) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

export async function streamTextWithController(
  text: string,
  speed: StreamSpeed = 'normal',
  controller: StreamController,
  onChunk?: (chunk: StreamChunk) => void
): Promise<void> {
  const delay = SPEED_DELAYS[speed];
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    if (controller.isCancelled()) {
      break;
    }
    
    await controller.waitIfPaused();
    
    if (controller.isCancelled()) {
      break;
    }
    
    const chunk = words.slice(i, i + 3).join(' ') + ' ';
    const streamChunk: StreamChunk = {
      text: chunk,
      timestamp: new Date(),
    };
    
    if (onChunk) {
      onChunk(streamChunk);
    }
    
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
