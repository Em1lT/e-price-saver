import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { format, addHours } from 'date-fns';
import { TelegramService } from 'nestjs-telegram';

interface PriceObject {
  time: string;
  value: number;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly telegram: TelegramService) {}

  @Cron('1 7-21 * * *')
  async saveElectricityPrice() {
    this.logger.debug('Fetch new price of the electricity', new Date());
    const URL = `${process.env.ELECTRICITY_PRICE_URL}/api/Prices/GetPrices?mode=1`;
    const response = await axios.get(URL);
    const data = response.data;
    const currentHour = format(Date.now(), 'H');

    const price = data.find(
      (price: PriceObject) => format(price.time, 'H') === currentHour,
    );
    const dateTime = new Date(price.time);

    const priceObject = {
      price: price.value,
      from: dateTime.toISOString(), // new Date(new Date().setHours(fromHour)).toISOString(),
      to: new Date(addHours(dateTime, 1)).toISOString(), // new Date(new Date().setHours(fromHour)).toISOString(),
    };

    // const alreadySet = await this.prisma.price.findFirst({
    //   where: {
    //     price: priceObject.price,
    //     AND: [
    //       {
    //         to: { gte: new Date().toISOString() },
    //       },
    //     ],
    //   },
    // });

    // if (alreadySet) {
    //   this.logger.log('Already set this price', alreadySet);
    //   await this.telegram
    //     .sendMessage({
    //       chat_id: process.env.TELEGRAM_CHAT_ID,
    //       text: `Hinta nyt: ${alreadySet.price} €`,
    //     })
    //     .toPromise();
    //   return;
    // }

    // this.logger.log('Saving new price of the electricity', priceObject);
    // await this.prisma.price.create({
    //   data: priceObject,
    // });
    await this.telegram
      .sendMessage({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `Hinta nyt: ${priceObject.price} Snt/kwh`,
      })
      .toPromise();
    return;
  }

  @Cron('1 15 * * *')
  async getTomorrowEPrices() {
    this.logger.debug('Fetch new price of the electricity', new Date());
    const URL = `${process.env.ELECTRICITY_PRICE_URL}/api/Prices/GetPrices?mode=2`;
    const response = await axios.get(URL);
    const data = response.data;

    if (data.length < 5) {
      this.logger.debug('Prices not yet updated', new Date());
    }

    const tomorrowPrices = data.map((item: PriceObject) => {
      const dateTime = new Date(item.time);
      return {
        price: item.value,
        from: dateTime.toISOString(), // new Date(new Date().setHours(fromHour)).toISOString(),
        to: new Date(addHours(dateTime, 1)).toISOString(), // new Date(new Date().setHours(fromHour)).toISOString(),
      };
    });

    const text = tomorrowPrices
      .map(
        (item: any) =>
          `Klo ${format(item.from, 'HH:mm')} - ${item.price} Snt/kwh \n`,
      )
      .join(',')
      .replaceAll(',', '');

    const sortedPrices = tomorrowPrices.sort((a, b) => {
      return a.price - b.price;
    });
    const lowest = sortedPrices.shift();
    const highest = sortedPrices.pop();

    const t1 = `
Tomorrows info! ⚡
  highest: ${highest.price}
  lowest: ${lowest.price}
${text}
      `;
    await this.telegram
      .sendMessage({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: t1,
      })
      .toPromise();

    return;
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
