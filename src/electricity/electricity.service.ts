import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Repository } from 'typeorm';
import ElectricityPrice from './electricity.entity';
import { ElectricityPrice as EPrice } from './electricity.dto';
import { PorssiSahkoIntegration } from './integration/porssisahko.integration';

@Injectable()
export class ElectricityService {
  private readonly logger = new Logger(ElectricityService.name);
  constructor(
    private readonly porssisahkoIntegration: PorssiSahkoIntegration,
    @InjectRepository(ElectricityPrice)
    private electricityRepository: Repository<ElectricityPrice>,
  ) {}

  async getElectricityPrice(hour: string): Promise<EPrice> {
    const prices = await this.porssisahkoIntegration.getElectricityPrices(1);
    const currentHour = hour;

    const price = prices.find(
      (price: EPrice) => format(price.from, 'H') === currentHour,
    );
    return price;
  }

  async saveElectricityPrices(prices: EPrice[]) {
    return Promise.all(
      prices.map((item) => {
        const price = new ElectricityPrice();
        price.fromDate = item.from;
        price.toDate = item.to;
        price.price = item.price;
        this.electricityRepository.save(price);
      }),
    );
  }

  async getElectricityPrices(mode: number): Promise<EPrice[]> {
    const prices = await this.porssisahkoIntegration.getElectricityPrices(
      mode || 1, // 0 yesterday, 1 today, 2 tomorrow
    );
    return prices;
  }

  getHighestElectricityPrice(prices: EPrice[]): EPrice {
    const sortedPrices = prices.sort((a, b) => {
      return a.price - b.price;
    });
    const highest = sortedPrices.pop();
    return highest;
  }

  getLowsetElectricityPrice(prices: EPrice[]): EPrice {
    const sortedPrices = prices.sort((a, b) => {
      return a.price - b.price;
    });
    return sortedPrices.shift();
  }
}
