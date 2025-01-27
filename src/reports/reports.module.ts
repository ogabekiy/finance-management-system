import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Category } from 'src/categories/category.model';
import { Transaction } from 'src/transactions/transaction.model';

@Module({
  imports: [SequelizeModule.forFeature([User,Category,Transaction])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
