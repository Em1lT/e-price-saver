import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import cheerio from 'cheerio';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async saveElectricityPrice() {
    this.logger.debug('fetch new price of the electricity');
    const URL = 'https://www.porssisahkoa.fi/';
    const pageHtml = await fetch(URL);
    const $ = cheerio.load(await pageHtml.text());
    const $priceBanner = $('div > div > h1');
    const allChildren = $priceBanner.parent().children();
    const text = allChildren.map((_, item) => $(item).text()).get();

    const [from, to] = text[1].split(' - ').map((i) => i.trim());
    const fromHour = +from.split(' ').at(1) as number;

    const priceObject = {
      price: +text[2].replace(',', '.'),
      from: new Date(new Date().setHours(fromHour)).toISOString(),
      to: new Date(new Date().setHours(+to)).toISOString(),
    };

    const alreadySet = await this.prisma.price.findFirst({
      where: {
        price: priceObject.price,
        AND: [
          {
            to: { gte: new Date().toISOString() },
          },
        ],
      },
    });

    if (alreadySet) {
      this.logger.log('Already set this price', alreadySet);
      return;
    }

    this.logger.log('Saving new price of the electricity', priceObject);
    await this.prisma.price.create({
      data: priceObject,
    });
    return;
  }
}
