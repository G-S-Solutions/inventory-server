import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorResolver } from './operator.resolver';

@Module({
  providers: [OperatorResolver, OperatorService],
})
export class OperatorModule {}
