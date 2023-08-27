export const getDateNow = (): string => {
    const date = new Date();
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados de 0 a 11
    const year = String(date.getFullYear()).slice(-2);
  
    return `${day}/${month}/${year}`;
  };