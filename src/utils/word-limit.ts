export const breakInput = (input: string, maxCharacters: number) => {
  return input.length > maxCharacters
    ? input.slice(0, maxCharacters) + '...'
    : input;
};
