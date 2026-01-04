import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { CompanyModule } from './company/company.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClientModule } from './client/client.module';
import { InventoryEventModule } from './inventory-event/inventory-event.module';
import { SyncModule } from './sync/sync.module';
import { LogisticModule } from './logistic/logistic.module';
import { OperatorModule } from './operator/operator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [EnvVaribales],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // rootValue: '/',
      path: '/gql',
      plugins: [
        process.env.NODE_ENV === 'development'
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      // formatError: (error: GraphQLError) => {
      //   const originalError = error.extensions?.originalError as any;
        
      //   if (originalError?.statusCode) {
      //     const formattedError: GraphQLFormattedError = {
      //       message: error.message,
      //       extensions: {
      //         code: originalError.error?.toUpperCase() || 'BAD_REQUEST',
      //         statusCode: originalError.statusCode,
      //       },
      //     };
      //     return formattedError;
      //   }
        
      //   return error;
      // },
    }),
    UserModule,
    CommonModule,
    CompanyModule,
    MenuModule,
    RoleModule,
    AuthModule,
    FileModule,
    ClientModule,
    InventoryEventModule,
    SyncModule,
    LogisticModule,
    OperatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
