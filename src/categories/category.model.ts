import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Transaction } from "src/transactions/transaction.model";
import { User } from "src/users/user.model";

@Table({tableName :'categories'})
export class Category extends Model<Category>{
    
    @ForeignKey(() => User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    user_id:number
    

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    title:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        defaultValue: 'expense', 
        validate: {
            isIn: [['income', 'expense']]
        }
    })
    type:string

    @BelongsTo(() => User)
    user: User

    @HasMany(() => Transaction)
    transactions: Transaction[];
}
