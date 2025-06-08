export const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomDigit = Math.floor(Math.random() * 10);
  return Number(`${timestamp}${randomDigit}`);
};
