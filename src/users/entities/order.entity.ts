import { User } from './user.entity';
import { Product } from './../../products/entities/product.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Order {
  @Column({ type: 'varchar', length: 255 })
  date: Date;

  @Column()
  user: User;

  @Column()
  products: Product[];
}
