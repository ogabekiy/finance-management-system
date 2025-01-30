import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/common/guards/authGuards';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Get('monthly')
  StatisticsMonthly(
  @Request() req :any,
  @Query('userId') userId: string,
  @Query('year') year:string,
  @Query('month') month:string
  ) {
  const authUserId = req.user.dataValues.id
  return this.reportsService.findStatisticsMonthly(+authUserId,+userId, +year,+month);  
  }

  @UseGuards(AuthGuard)
  @Get('yearly')
  StatisticsYearly(
  @Request() req:any,
  @Query('userId') userId :string,
  @Query('year') year:string
  ) {
  const authUserId = req.user.dataValues.id
  return this.reportsService.findStatisticsYearly(+authUserId,+userId, +year);  
  }

  @UseGuards(AuthGuard)
  @Get('daily')
  StatisticsDaily(
  @Request() req:any,
  @Query() userId :string,
  @Query('year') year:string,
  @Query('month') month:string,
  @Query('day') day:string
  ){
    const authUserId = req.user.dataValues.id
    return this.reportsService.findStatisticsDaily(+authUserId,+userId,+year,+month,+day)
  }  

}
