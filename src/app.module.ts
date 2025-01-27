import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { SharedModule } from './common/shared.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';

// console.log

@Module({
  imports: [
    SequelizeModule.forRoot({
      logging: console.log,
      dialect:  'postgres', 
      database: 'finance',
      username: 'postgres',
      password: '123456',
      host: process.env.DB_HOST,
      port: 5432, 
      autoLoadModels: true, 
      synchronize: true,
    }),
    UsersModule,
    AuthsModule,
    SharedModule,
    CategoriesModule,
    TransactionsModule,
    ReportsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
