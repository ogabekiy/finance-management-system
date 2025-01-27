import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/category.model";
import { Transaction } from "src/transactions/transaction.model";

@Table({tableName: 'users'})
export class User extends Model<User>{
    @Column({
        type: DataType.STRING,
        allowNull:false
    })
    name: string

    @Column({
        type: DataType.STRING,
        allowNull:false,
        unique: true,
        validate :{
            isEmail: true
        }
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull:false,
        unique: true
    })
    phone: string

    @Column({
        type: DataType.STRING,
        allowNull:false
    })
    password: string

    @Column({
        type: DataType.TEXT,
        allowNull:true,
    })
    profile_image_url: string

    @Column({
        type: DataType.STRING,
        allowNull:true,
        defaultValue: 'user',
        validate: {
            isIn: [['admin', 'user']]
        }
    })
    role: string

    @HasMany(() => Category)
    categories: Category[];


    @HasMany(() => Transaction)
    transactions: Transaction[];
}