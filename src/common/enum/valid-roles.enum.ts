import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  ROOT = 'root',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERATOR = 'operator',
  USER = 'user',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
