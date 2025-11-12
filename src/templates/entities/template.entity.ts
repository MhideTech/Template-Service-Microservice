import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TemplateCategory } from '../template-categories.enum';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // Change category to be of enum type
  @Column({
    type: 'enum',
    enum: TemplateCategory,
    default: TemplateCategory.OTHER,
  })
  category: TemplateCategory;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
