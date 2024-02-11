import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { addHours, format } from 'date-fns';
import { ElectricityPrice, ElectricityPriceDto } from '../electricity.dto';

@Injectable()
export class PorssiSahkoIntegration {
  private readonly logger = new Logger(PorssiSahkoIntegration.name);
  constructor() {}

  marshall(prices: ElectricityPriceDto[]): ElectricityPrice[] {
    return prices.map((item: ElectricityPriceDto): ElectricityPrice => {
      const dateTime = new Date(item.time);
      return {
        price: item.value,
        from: dateTime,
        to: new Date(addHours(dateTime, 1)),
      };
    });
  }

  async getElectricityPrices(mode: number): Promise<ElectricityPrice[]> {
    const URL = `${process.env.ELECTRICITY_PRICE_URL}/api/Prices/GetPrices?mode=${mode}`;
    const response = await axios.get(URL);
    const data = response.data;
    return this.marshall(data);
  }
}
