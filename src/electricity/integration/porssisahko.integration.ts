import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { addHours } from 'date-fns';
import { ElectricityPriceDto } from '../electricity.dto';
import ElectricityPrice from '../electricity.entity';

@Injectable()
export class PorssiSahkoIntegration {
  private readonly logger = new Logger(PorssiSahkoIntegration.name);
  constructor() {}

  marshall(prices: ElectricityPriceDto[]): ElectricityPrice[] {
    return prices.map((item: ElectricityPriceDto): ElectricityPrice => {
      const from = new Date(item.time);
      const to = addHours(item.time, 1);
      const price = new ElectricityPrice();
      price.fromDate = from;
      price.toDate = to;
      price.price = item.value;
      return price;
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
