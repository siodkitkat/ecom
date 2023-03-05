export const errorResponse = (message: string, error: number) => {
  return {
    message,
    error,
  };
};

export const stringToNum = (input: string, type = "int" as "float" | "int", fallback = 0) => {
  const num = type === "float" ? parseFloat(input) : parseInt(input);
  return isNaN(num) ? fallback : isNaN;
};
