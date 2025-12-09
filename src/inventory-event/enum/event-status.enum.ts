import { registerEnumType } from "@nestjs/graphql";

export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(EventStatus, { name: 'EventStatus' });