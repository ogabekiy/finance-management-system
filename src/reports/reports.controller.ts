import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  StatisticsMonthly(
  @Query('userId') userId:string,
  @Query('year') year:string,
  @Query('month') month:string
  ) {
  return this.reportsService.findStatisticsMonthly(+userId, +year,+month);  
  }

  @Get('yearly')
  StatisticsYearly(
  @Query('userId') userId:string,
  @Query('year') year:string
  ) {
  return this.reportsService.findStatisticsYearly(+userId, +year);  
  }

  // @Get('yearly/pdf')
  // async generateYearlyPDF(
  //   @Query('userId') userId: string,
  //   @Query('year') year: string,
  //   @Res() res: Response,
  // ) {
  //   const filePath = await this.reportsService.findStatisticsYearly(+userId, +year);
    
  //   res.download(filePath, (err) => {
  //     if (err) {
  //       res.status(500).send('Error generating PDF');
  //     }
  //   });
  // }
  

}
