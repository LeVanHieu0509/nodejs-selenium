import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
export class HouseKeeper {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn({ type: "int" })
  public id!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public name_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public year_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public religion_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public address_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public phone_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public phone_relative_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public where_work_housekeeper!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public level_housekeeper!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public health_housekeeper: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public family_housekeeper: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public skill_housekeeper: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public desire_housekeeper: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public salary_housekeeper: string;

  @Field()
  @Column({ type: "smallint", default: 0 })
  public is_published!: boolean;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public status!: string;

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
