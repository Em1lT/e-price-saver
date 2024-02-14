import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'electricityPrice' })
export default class ElectricityPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @Column()
  path: string;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;
}
