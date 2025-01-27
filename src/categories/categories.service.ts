import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { User } from 'src/users/user.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private CategoryModel : typeof Category,
  @InjectModel(User) private UserModel : typeof User
){}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.CategoryModel.findAll({where:{title:createCategoryDto.title,user_id:createCategoryDto.user_id}})
    console.log(data)
    if(data.length > 0){
      throw new ConflictException(`${createCategoryDto.title} nomli Categoriya mavjud`)
    }
    console.log(createCategoryDto)
    return await this.CategoryModel.create(createCategoryDto);
  }

  async findAll(id:number) {
    const user = await this.UserModel.findOne({where:{id:id}})
    console.log("role",user.role)
    if(user.role == 'user'){
        console.log(1)
         return await this.CategoryModel.findAll({where:{user_id:id}})
    }
    console.log(2)
    return await this.CategoryModel.findAll({
      include: [
          {
              model: User,
              attributes: ['id', 'name'], 
          },
      ],
  });
  }

  async findOne(id: number,userId: number) {
    const data = await this.CategoryModel.findOne({where: {id:id},include: [{model: User,attributes:['id','name']}]})
    if(!data){
      throw new NotFoundException('category not found')
    }

    const user = await this.UserModel.findOne({where:{id:userId}})

    if(user.role == 'admin'){
        return data
    }
    if(data.user_id === userId){
      return data ;
    }
    throw new ForbiddenException(`this category belongs to another user yu cant see it`)
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto,userId:number) {
    const user = await this.UserModel.findOne({where:{id:userId}})
    const data = await this.CategoryModel.findOne({where :{id}})
    if(user.role == 'admin' || data.user_id == userId){
      return this.CategoryModel.update(updateCategoryDto,{where:{id}})
    }
    else{
      throw new ForbiddenException(`yu cant edit others category`)
    }
    // return this.CategoryModel.update(updateCategoryDto,{where:{id}})
  }

  async remove(id: number,userId :number) {
    const user = await this.UserModel.findOne({where:{id:userId}}) 

    const data = await this.CategoryModel.findOne({where :{id}})

    if(user.role == 'admin' || data.user_id == userId){
      return this.CategoryModel.destroy({where:{id}})
    }
    else{
      throw new ForbiddenException(`yu cant remove others category`)
    }
    
    // return `This action removes a #${id} category`;
  }
}
