export const VOICE_CONFIG = {
  SUBTITLE_MAX_CHARS: 42,
  SUBTITLE_CYCLE_BASE_MS: 1600,
  SUBTITLE_CYCLE_PER_CHAR_MS: 28,
  USER_DISPLAY_MS: 2000,
  MESSAGE_FADE_DURATION: 6000,
  MAX_VISIBLE_MESSAGES: 4,
} as const;

export function chunkText(text: string, maxChars: number = VOICE_CONFIG.SUBTITLE_MAX_CHARS): string[] {
  if (text.length <= maxChars) return [text];
  
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    if (sentence.length <= maxChars) {
      chunks.push(sentence);
    } else {
      const words = sentence.split(' ');
      let currentChunk = '';
      for (const word of words) {
        const testChunk = currentChunk ? `${currentChunk} ${word}` : word;
        if (testChunk.length <= maxChars) {
          currentChunk = testChunk;
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = word;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    }
  }
  
  return chunks.length > 0 ? chunks : [text];
}
