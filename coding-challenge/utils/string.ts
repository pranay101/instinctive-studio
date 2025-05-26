const formatCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[-_]/g, ' ');
};

const isValidString = (str: unknown) => {
  return typeof str === "string" && str.trim() !== "";
};

export { formatCapitalize, isValidString };
