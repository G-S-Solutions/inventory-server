import { Module } from '@nestjs/common';
import { LogisticService } from './logistic.service';
import { LogisticResolver } from './logistic.resolver';

@Module({
  providers: [LogisticResolver, LogisticService],
})
export class LogisticModule {}
