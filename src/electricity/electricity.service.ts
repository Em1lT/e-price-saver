import { Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { ElectricityPrice } from './electricity.dto';
import { PorssiSahkoIntegration } from './integration/porssisahko.integration';

@Injectable()
export class ElectricityService {
  private readonly logger = new Logger(ElectricityService.name);
  constructor(
    private readonly porssisahkoIntegration: PorssiSahkoIntegration,
  ) {}

  async getElectricityPrice(hour: string): Promise<ElectricityPrice> {
    const prices = await this.porssisahkoIntegration.getElectricityPrices(1);
    const currentHour = hour;

    const price = prices.find(
      (price: ElectricityPrice) => format(price.from, 'H') === currentHour,
    );
    return price;
  }

  async getElectricityPrices(mode: number): Promise<ElectricityPrice[]> {
    const prices = await this.porssisahkoIntegration.getElectricityPrices(
      mode || 1, // 0 yesterday, 1 today, 2 tomorrow
    );
    return prices;
  }

  getHighestElectricityPrice(prices: ElectricityPrice[]): ElectricityPrice {
    const sortedPrices = prices.sort((a, b) => {
      return a.price - b.price;
    });
    const highest = sortedPrices.pop();
    return highest;
  }

  getLowsetElectricityPrice(prices: ElectricityPrice[]): ElectricityPrice {
    const sortedPrices = prices.sort((a, b) => {
      return a.price - b.price;
    });
    return sortedPrices.shift();
  }
}
