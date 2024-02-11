export class ElectricityPriceDto {
  time: string;
  value: number;
}

export class ElectricityPrice {
  price: number;
  from: Date;
  to: Date;
}
