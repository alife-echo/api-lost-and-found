export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@unifesspa\.edu\.br$/;
    return emailRegex.test(email);
  };