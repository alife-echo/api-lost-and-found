import { ItemUploadData } from "../types/GlobalTypes";
export const areAllPropertiesFilled = (item: ItemUploadData): boolean => {
    if (
      !item.name ||
      !item.littleDescription ||
      !item.questionsValidated ||
      !item.meetingLocation ||
      !item.image ||
      !item.userId
    ) {
      return false; 
    }
  
    return true; 
  }