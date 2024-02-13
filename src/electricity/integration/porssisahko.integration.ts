import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { addHours } from 'date-fns';
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
    this.logger.log(`[ GET ] request to url ${URL}`);
    const response = await axios.get(URL);
    process.env.NODE_ENV === 'development'
      ? this.logger.log(
          `[ RESPONSE ] ${
            response.status
          } from URL ${URL}} with data: ${JSON.stringify(response.data)}`,
        )
      : this.logger.log(`[ RESPONSE ] ${response.status} from URL ${URL}}`);
    const data = response.data;
    return this.marshall(data);
  }
}
