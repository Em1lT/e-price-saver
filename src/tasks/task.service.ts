import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { format } from 'date-fns';
import { ElectricityPrice } from '../electricity/electricity.dto';
import { ElectricityService } from '../electricity/electricity.service';
import { TelegramMessageService } from '../telegram/telegram.service';
import {
  formatCurrentPriceTelegramMessasge,
  formatTomorrowsPriceMessage,
  formatTodaysPriceMessage,
  concatArrayString,
} from '../telegram/utils/helper';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly telegram: TelegramMessageService,
    private readonly electricityService: ElectricityService,
  ) {}

  @Cron('1 7-21 * * *')
  async getHourlyElectricityPrices() {
    const priceObject = await this.electricityService.getElectricityPrice(
      format(Date.now(), 'H'),
    );
    if (priceObject.price < +process.env.PRICE_TOP) {
      this.logger.log(
        `Price is now ${priceObject.price} but not over the notification limit ${process.env.PRICE_TOP}`,
      );
      return;
    }

    const formattedText = formatCurrentPriceTelegramMessasge(priceObject);
    return this.telegram.sendMessage(formattedText);
  }

  @Cron('1 6 * * *')
  async getTodaysElectricityPrices() {
    this.logger.log('Fetching todays electricity prices', new Date());
    const tomorrowsPrices =
      await this.electricityService.getElectricityPrices(1);

    const priceTexts: string[] = tomorrowsPrices.map((item: ElectricityPrice) =>
      formatCurrentPriceTelegramMessasge(item),
    );
    const text = concatArrayString(priceTexts);

    const lowest =
      this.electricityService.getLowsetElectricityPrice(tomorrowsPrices);
    const highest =
      this.electricityService.getHighestElectricityPrice(tomorrowsPrices);
    const message = formatTodaysPriceMessage(text, highest.price, lowest.price);
    return this.telegram.sendMessage(message);
  }

  @Cron('1 15 * * *')
  async getTomorrowEPrices() {
    this.logger.log('Fetching tomorrows electricity prices', new Date());
    const tomorrowsPrices =
      await this.electricityService.getElectricityPrices(2);

    await this.electricityService.saveElectricityPrices(tomorrowsPrices);

    const priceTexts: string[] = tomorrowsPrices.map((item: ElectricityPrice) =>
      formatCurrentPriceTelegramMessasge(item),
    );
    const text = concatArrayString(priceTexts);

    const lowest =
      this.electricityService.getLowsetElectricityPrice(tomorrowsPrices);
    const highest =
      this.electricityService.getHighestElectricityPrice(tomorrowsPrices);
    const message = formatTomorrowsPriceMessage(
      text,
      highest.price,
      lowest.price,
    );

    return this.telegram.sendMessage(message);
  }
}

/* 

// if no tomorrows prices
GET https://www.porssisahkoa.fi/api/Prices/GetPrices?mode=2
[{"time":"2024-02-09T00:00:00+02:00","value":12.40}]
 

if working correctly
GET https://www.porssisahkoa.fi/api/Prices/GetPrices?mode=1
[
    {
        "time": "2024-02-08T00:00:00+02:00",
        "value": 11.79
    },
    {
        "time": "2024-02-08T01:00:00+02:00",
        "value": 12.69
    },
    {
        "time": "2024-02-08T02:00:00+02:00",
        "value": 11.03
    },
    {
        "time": "2024-02-08T03:00:00+02:00",
        "value": 9.92
    },
    {
        "time": "2024-02-08T04:00:00+02:00",
        "value": 8.95
    },
    {
        "time": "2024-02-08T05:00:00+02:00",
        "value": 11.10
    },
    {
        "time": "2024-02-08T06:00:00+02:00",
        "value": 16.56
    },
    {
        "time": "2024-02-08T07:00:00+02:00",
        "value": 16.71
    },
    {
        "time": "2024-02-08T08:00:00+02:00",
        "value": 16.32
    },
    {
        "time": "2024-02-08T09:00:00+02:00",
        "value": 16.59
    },
    {
        "time": "2024-02-08T10:00:00+02:00",
        "value": 14.08
    },
    {
        "time": "2024-02-08T11:00:00+02:00",
        "value": 12.13
    },
    {
        "time": "2024-02-08T12:00:00+02:00",
        "value": 11.39
    },
    {
        "time": "2024-02-08T13:00:00+02:00",
        "value": 12.50
    },
    {
        "time": "2024-02-08T14:00:00+02:00",
        "value": 15.31
    },
    {
        "time": "2024-02-08T15:00:00+02:00",
        "value": 15.72
    },
    {
        "time": "2024-02-08T16:00:00+02:00",
        "value": 16.12
    },
    {
        "time": "2024-02-08T17:00:00+02:00",
        "value": 15.30
    },
    {
        "time": "2024-02-08T18:00:00+02:00",
        "value": 16.47
    },
    {
        "time": "2024-02-08T19:00:00+02:00",
        "value": 15.83
    },
    {
        "time": "2024-02-08T20:00:00+02:00",
        "value": 15.86
    },
    {
        "time": "2024-02-08T21:00:00+02:00",
        "value": 14.93
    },
    {
        "time": "2024-02-08T22:00:00+02:00",
        "value": 13.97
    },
    {
        "time": "2024-02-08T23:00:00+02:00",
        "value": 12.60
    }
]

 */
