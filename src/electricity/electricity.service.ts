import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, format, startOfDay, startOfHour } from 'date-fns';
import { Repository } from 'typeorm';
import ElectricityPrice from './electricity.entity';
import { PorssiSahkoIntegration } from './integration/porssisahko.integration';

@Injectable()
export class ElectricityService {
  private readonly logger = new Logger(ElectricityService.name);
  constructor(
    private readonly porssisahkoIntegration: PorssiSahkoIntegration,
    @InjectRepository(ElectricityPrice)
    private electricityRepository: Repository<ElectricityPrice>,
  ) {}

  async getElectricityPrice1() {
    const prices = await this.electricityRepository.find();
    return prices;
  }

  async getElectricityPrice(date: Date): Promise<ElectricityPrice> {
    const price = await this.electricityRepository.findOne({
      where: {
        fromDate: startOfHour(date),
      },
    });
    if (price) {
      throw new Error('No Price found');
    }

    return price;
  }

  async saveElectricityPrices(prices: ElectricityPrice[]) {
    return Promise.all(
      prices.map(async (item) => {
        const alreadyFound = await this.electricityRepository.findOne({
          where: {
            fromDate: item.fromDate,
            price: item.price,
          },
        });

        if (alreadyFound) {
          this.logger.log('Item already found!', JSON.stringify(item));
          return;
        }
        const price = new ElectricityPrice();
        price.fromDate = item.fromDate;
        price.toDate = item.toDate;
        price.price = item.price;
        await this.electricityRepository.save(price);
      }),
    );
  }

  async getNewElectricityPrices(mode: number): Promise<ElectricityPrice[]> {
    const prices = await this.porssisahkoIntegration.getElectricityPrices(mode);
    await this.saveElectricityPrices(prices);
    return prices;
  }

  async getElectricityPrices(date: Date): Promise<ElectricityPrice[]> {
    const prices = await this.electricityRepository.find({
      where: {
        fromDate: startOfDay(date),
        toDate: endOfDay(date),
      },
    });

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
