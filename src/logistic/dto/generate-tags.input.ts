import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Min } from 'class-validator';

@InputType()
export class GenerateTagsInput {
  @Field(() => ID)
  @IsUUID()
  eventId: string;

  @Field(() => ID)
  @IsUUID()
  areaId: string;

  @Field(() => Int)
  @Min(1)
  rangeStart: number; // Ej: 1

  @Field(() => Int)
  @Min(1)
  rangeEnd: number;   // Ej: 100

  @Field(() => Int, { defaultValue: 5 })
  @IsInt()
  zeroPadding: number; // Ej: Si es 5, el 1 se convierte en "00001"
}