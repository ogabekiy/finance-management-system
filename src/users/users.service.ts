import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs'
import { Category } from 'src/categories/category.model';
import { Transaction } from 'src/transactions/transaction.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserModel: typeof User){}

  async create(createUserDto: CreateUserDto) {
    const data  = await this.UserModel.findOne({where: {email: createUserDto.email}})
    if(data){
      throw new ConflictException("User with email already exists")
    }
    if(await this.UserModel.findOne({where: {phone: createUserDto.phone}})){
      throw new ConflictException("User with phone number already exists")
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password,10)

    
    console.log(createUserDto)

    try {
      
    return await this.UserModel.create(createUserDto);
      
    } catch (error) {
      console.error(error);
      throw new Error(error.message || 'Failed to create user');
    }
    

  }

  async findAll() {
    return this.UserModel.findAll({include:[{model:Category,attributes: ['id','title','type']},{model: Transaction,attributes: ['id','category_id','amount','description']}]})
  }

  async findOne(id: number) {
    const data = await this.UserModel.findOne({where:{id:id},include:[{model: Category,attributes: ['id','title','type'],},{model: Transaction}]})
    if(!data){
      throw new NotFoundException('User with this ID does not exist');
    }
    return this.UserModel.findOne({where:{id}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = await this.UserModel.findOne({where:{id:id}})
    if(!data){
      throw new NotFoundException('User with this ID does not exist');
    }
    return this.UserModel.update(updateUserDto,{where:{id}});
  }

  async remove(id: number) {
    const data = await this.UserModel.findOne({where:{id:id}})
    if(!data){
      throw new Error('user with this id dont exist')
    }
    return this.UserModel.destroy({where:{id}});
  }

  async findOneByEmail(email:string){
    return await this.UserModel.findOne({where:{email:email}})
  }

  

  
}
