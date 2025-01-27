import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/common/guards/authGuards';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto,@Request() req) {
    createTransactionDto.user_id = req.user.dataValues.id
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    // console.log('1',req.user.dataValues.id)
    // console.log('salom')
    return this.transactionsService.findAll(+req.user.dataValues.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req) {
    return this.transactionsService.findOne(+id,+req.user.dataValues.id);
  }


  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto,@Request() req) {
    return this.transactionsService.update(+id, updateTransactionDto,+req.user.dataValues.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.transactionsService.remove(+id,+req.user.dataValues.id);
  }
}
