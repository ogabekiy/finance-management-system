import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/authGuards';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto,@Request()req ) {
    // console.log(req.user.dataValues)
    createCategoryDto.user_id = req.user.dataValues.id
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request()req) {
    return this.categoriesService.findAll(req.user.dataValues.id);

  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req) {

    return this.categoriesService.findOne(+id,+req.user.dataValues.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto,@Request() req) {
    return this.categoriesService.update(+id, updateCategoryDto,+req.user.dataValues.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.categoriesService.remove(+id,+req.user.dataValues.id);
  }
}
