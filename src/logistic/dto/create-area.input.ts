import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateAreaInput {
  @Field(() => ID)
  @IsUUID()
  eventId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "SALÓN PRINCIPAL"
}