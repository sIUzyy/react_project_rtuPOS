export const convertStringToArray = (string) => {
    // Remove any spaces before or after commas
    const trimmedString = string.trim().replace(/, /g, ",");
    // Split the string by commas and convert to an array
    const array = trimmedString.split(",");
    return array;
  }
  