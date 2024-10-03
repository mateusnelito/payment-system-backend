export const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
export const BIRegex = /^\d{9}[A-Z]{2}\d{3}$/;
export const strongPasswordRegex =
  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,255})/g;
