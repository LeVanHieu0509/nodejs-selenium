import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
export class HomeOwner {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn({ type: "int" })
  public id!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public name_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public address_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public phone_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public time_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public description_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public require_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public primary_owner!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public salary_owner!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public image_owner: string;

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
