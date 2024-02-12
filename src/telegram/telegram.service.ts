import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class TelegramMessageService {
  private readonly logger = new Logger(TelegramMessageService.name);
  constructor(private readonly telegram: TelegramService) {}

  async sendMessage(text: string) {
    this.logger.log(
      `Sending telegram price message to chat id: (${process.env.TELEGRAM_CHAT_ID})  `,
      text,
    );

    if (process.env.NODE_ENV !== 'development') {
      const response = await this.telegram
        .sendMessage({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
        })
        .toPromise();
      return response;
    }
  }
}
