import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { User } from 'src/users/user.model';
import { Category } from 'src/categories/category.model';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction) private transactionModel:typeof Transaction,
  @InjectModel(User) private userModel:typeof User,
  @InjectModel(Category) private categoryModel:typeof Category
  ){}

  async create(createTransactionDto: CreateTransactionDto) {
    const category = await this.categoryModel.findOne({where :{id:createTransactionDto.category_id}})

    if(category.user_id == createTransactionDto.user_id){
      return await this.transactionModel.create(createTransactionDto);
    }
    else{
      throw new ForbiddenException('yu cant use others category')
    }
    // return await this.transactionModel.create(createTransactionDto);
  }

  async findAll(userId:number) {
    const user = await this.userModel.findOne({where:{id: userId}})
    if(user.role == 'admin'){
      return await this.transactionModel.findAll({
        include: [{
          model: User,
          attributes: ['id', 'name']
        },{model: Category,attributes: ['id','title','type']}]
      });
    }
    else{
      return await this.transactionModel.findAll({where:{user_id: userId},include: [{
        model: User,
        attributes: ['id', 'name']
      },{model: Category,attributes: ['id','title','type']}]})
    }
    
  }

  async findOne(id: number,userId: number) {
    console.log('userid',userId)
    const user = await this.userModel.findOne({where: {id:userId}})
    const data = await this.transactionModel.findOne({where :{id},include: [{model :User,},{model: Category}]});
    if(user.role === 'admin' || data.user_id == userId){
      return data
    }
    else{
        throw new ForbiddenException('yu cant see others transactions')
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto,userId:number) {
    const user = await this.userModel.findOne({where: {id:userId}})
    const data = await this.transactionModel.findOne({where :{id}})

    if(user.role == 'admin' || data.user_id == userId){
      return await this.transactionModel.update(updateTransactionDto,{where: {id}})
    }
    else{
      throw new ForbiddenException('yu cant update others transactions')
    }
  }

  async remove(id: number,userId :number) {
    const user = await this.userModel.findOne({where: {id:userId}})
    const data = await this.transactionModel.findOne({where: {id}})
    if(user.role == 'admin' || data.user_id == userId){
      return await this.transactionModel.destroy({where :{id}})
    }
    else{
      throw new ForbiddenException('yu cant remove others transactions')
    }

  }
}
