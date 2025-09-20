export const logAndCreateError = (message: string) => {
  console.error(message);
  return new Error(message);
};
