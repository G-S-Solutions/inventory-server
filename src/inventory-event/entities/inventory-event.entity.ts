import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { EventStatus } from '../enum/event-status.enum';

@ObjectType()
export class InventoryEvent {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field(() => EventStatus)
  status: EventStatus;

  @Field(() => String)
  clientId: string;

  @Field(() => String)
  supervisorId: string;

  @Field(() => String, { nullable: true })
  observation?: string;

  // ******************** Audit fields ********************

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String)
  createdBy: string;

  @Field(() => String, { nullable: true })
  updatedBy?: string;

  // ******************** Relations ********************
  @Field(() => Client)
  client: Client;

  @Field(() => User)
  supervisor: User;

  
}
