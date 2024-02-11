import { Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { TelegramService } from 'nestjs-telegram';
import { ElectricityPrice } from '../electricity/electricity.dto';

@Injectable()
export class TelegramMessageService {
  private readonly logger = new Logger(TelegramMessageService.name);
  constructor(private readonly telegram: TelegramService) {}

  formatMessage(type: string, price: ElectricityPrice): string {
    switch (type) {
      case 'price':
        return `Klo ${format(price.from, 'HH:mm')} - ${price.price} Snt/kwh \n`;
    }
    return;
  }

  async sendCurrentPriceMessage(text: string) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(
        'Development environment. Sending telegram price message:  ',
        text,
      );
      return;
    }
    const response = await this.telegram
      .sendMessage({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
      })
      .toPromise();
    return response;
  }
}
