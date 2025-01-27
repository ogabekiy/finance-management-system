import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/category.model";
import { User } from "src/users/user.model";

@Table({tableName :'transactions'})
export class Transaction extends Model<Transaction>{
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    user_id: number


    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    category_id: number
    
    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull:false,
        validate: {
            min: 0,
        },
    })
    amount: number

    @Column({
        type: DataType.STRING,
        allowNull:false
    })
    description: string

    @Column({
        type :DataType.DATE,
        allowNull: false,
    })
    transaction_date: string


    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Category)
    category: Category

}
