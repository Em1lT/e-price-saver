import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import cheerio from 'cheerio';

type PriceEntity = {
    price: string;
    from: string;
    to: string;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('fetch new price of the electricity');
    const URL = 'https://www.porssisahkoa.fi/'
    const s = await fetch(URL);
    const $ = cheerio.load(await s.text());
    const $p = $('div > div > h1');
    const allChildren = $p.parent().children();
    const text = allChildren.map((_, item) => $(item).text()).get();

    const [from, to] = text[1].split(' - ').map(i => i.trim());

    const price: PriceEntity = {
      price: text[2],
      from: new Date().setHours(+!from.split(' ').at(0) as number).toString(),
      to: new Date().setHours(+to).toString()
    }
    this.logger.log(price)
  }
}
