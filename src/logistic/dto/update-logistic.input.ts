import { CreateLogisticInput } from './create-logistic.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLogisticInput extends PartialType(CreateLogisticInput) {
  @Field(() => Int)
  id: number;
}
