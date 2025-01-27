import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcryptjs'
import { LoginAuthDto } from './dto/login-auth';
import * as jwt from 'jsonwebtoken'
import { ConfigService } from 'src/common/config/config.service';
@Injectable()
export class AuthsService {
  constructor(@InjectModel(User) private UserModel: typeof User,
  @Inject() private configService:ConfigService    ){}

  async create(createUserDto: CreateUserDto) {
      const data  = await this.UserModel.findOne({where: {email: createUserDto.email}})
      if(data){
        throw new ConflictException("User with email already exists")
      }
  
      if (createUserDto.password.length < 5) {
        throw new Error('Password must be at least 5 characters long');
      }
  
      createUserDto.password = await bcrypt.hash(createUserDto.password,10)
  
      return this.UserModel.create(createUserDto)
  }

  async login(loginAuthDto :LoginAuthDto){
    const data  = await this.UserModel.findOne({where: {email: loginAuthDto.email}})
    if(!data){
      throw new BadRequestException("password or email wrong")
    }

    const checkPassword = await bcrypt.compare(loginAuthDto.password,data.password)
    if(!checkPassword){
      throw new UnauthorizedException("valid email or password")
    }
    
    const token = await jwt.sign({email: loginAuthDto.email},this.configService.get('JWT_ACCESS_TOKEN'),{expiresIn: '1h'})

    return await {token}
  }

}
