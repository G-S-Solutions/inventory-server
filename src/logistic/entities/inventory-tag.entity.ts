import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum TagStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  AUDITED = 'AUDITED',
}

// Registramos el Enum para que GraphQL lo reconozca
registerEnumType(TagStatus, { name: 'TagStatus' });

@ObjectType()
export class InventoryTag {
  @Field(() => ID)
  id: string;

  @Field()
  code: string; // Ej: "02001"

  @Field({ nullable: true })
  description?: string;

  @Field(() => TagStatus)
  status: TagStatus;

  @Field(() => ID)
  areaId: string;

  @Field(() => ID)
  eventId: string;
}