import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import ElectricityPrice from '../electricity/electricity.entity';
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
      new Date(),
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
    const todaysPrices = await this.electricityService.getElectricityPrices(
      new Date(),
    );

    const priceTexts: string[] = todaysPrices.map((item: ElectricityPrice) =>
      formatCurrentPriceTelegramMessasge(item),
    );
    const text = concatArrayString(priceTexts);

    const lowest =
      this.electricityService.getLowsetElectricityPrice(todaysPrices);
    const highest =
      this.electricityService.getHighestElectricityPrice(todaysPrices);
    const message = formatTodaysPriceMessage(text, highest.price, lowest.price);
    return this.telegram.sendMessage(message);
  }

  @Cron('1 15 * * *')
  async getTomorrowEPrices() {
    this.logger.log('Fetching tomorrows electricity prices', new Date());
    const tomorrowsPrices =
      await this.electricityService.getNewElectricityPrices(2);

    if (tomorrowsPrices.length < 5) {
      throw new Error('No tomorrows prices found!');
    }

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
