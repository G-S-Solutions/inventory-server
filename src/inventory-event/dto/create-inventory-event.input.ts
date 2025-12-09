import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '../enum/event-status.enum';

@InputType()
export class CreateInventoryEventInput {
  @Field(() => String)
  @IsString()
  code: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  storeName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @Field(() => EventStatus)
  @IsString()
  @IsOptional()
  status?: EventStatus;

  @Field(() => String)
  @IsString()
  clientId: string;
  
  @Field(() => String)
  @IsString()
  supervisorId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  observation?: string;
}
