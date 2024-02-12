import { format } from 'date-fns';
import { ElectricityPrice } from '../../electricity/electricity.dto';

export const formatCurrentPriceTelegramMessasge = (
  price: ElectricityPrice,
): string => {
  return `Klo ${format(price.from, 'HH:mm')} - ${price.price} Snt/kwh \n`;
};

export const concatArrayString = (text: string[]): string => {
  return text.join(',').replaceAll(',', '');
};

export const formatTodaysPriceMessage = (
  text: string,
  highest: number,
  lowest: number,
): string => {
  return `
Todays info! ⚡
highest: ${highest}
lowest: ${lowest}
------------------
${text}
      `;
};

export const formatTomorrowsPriceMessage = (
  text: string,
  highest: number,
  lowest: number,
): string => {
  return `
Tomorrows info! ⚡
highest: ${highest}
lowest: ${lowest}
------------------
${text}
      `;
};
