
export const generateRandomNumber = (): string => {
    const digits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
  
    while (result.length < 5) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      const randomDigit = digits[randomIndex];
  
      if (result === '' && randomDigit === '0') {
        continue;
      }
  
      if (!result.includes(randomDigit)) {
        result += randomDigit;
      }
    }
    
    return result.padStart(5, '0'); 
  };
  generateRandomNumber()
  