export const ReadingTime = (speed: number, content: string) => {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / speed);
};
