import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from 'src/categories/category.model';
import { Transaction } from 'src/transactions/transaction.model';
import { User } from 'src/users/user.model';
@Injectable()
export class ReportsService {
  constructor(@InjectModel(User) private userModel: typeof User,
  @InjectModel(Transaction) private transactionModel: typeof Transaction
  ){}
  async findStatisticsMonthly(userId: number, year: number, month: number) {
    console.log('user', userId);
    console.log('year', year);
    console.log('month', month);
  
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); 
  
    const data = await this.transactionModel.findAll({
      where: {
        user_id: userId,
        transaction_date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'title', 'type'],
        },
      ],
      attributes: ['id', 'amount', 'description', 'transaction_date'],
    });
  
    const jsonData = JSON.stringify(data, null, 2);
    console.log(jsonData);
  
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCategories = {}; 
    let expenseCategories = {}; 
  
    data.forEach((transaction: any) => {
      if (transaction.category.type === 'income') {
        totalIncome += transaction.amount;
  
        const categoryTitle = transaction.category.title;
        if (!incomeCategories[categoryTitle]) {
          incomeCategories[categoryTitle] = 0;
        }
        incomeCategories[categoryTitle] += transaction.amount;
      } else if (transaction.category.type === 'expense') {
        totalExpense += transaction.amount;
  
        const categoryTitle = transaction.category.title;
        if (!expenseCategories[categoryTitle]) {
          expenseCategories[categoryTitle] = 0;
        }
        expenseCategories[categoryTitle] += transaction.amount;
      }
    });
  
    const maxExpenseCategory = Object.keys(expenseCategories).reduce((a, b) =>
      expenseCategories[a] > expenseCategories[b] ? a : b
    );
  
    const maxIncomeCategory = Object.keys(incomeCategories).reduce((a, b) =>
      incomeCategories[a] > incomeCategories[b] ? a : b
    );
  
    console.log('Total Income:', totalIncome);
    console.log('Total Expense:', totalExpense);
    console.log('Max Expense Category:', maxExpenseCategory);
    console.log('Max Income Category:', maxIncomeCategory);
  
    return {
      totalIncome,
      totalExpense,
      maxExpenseCategory,
      maxIncomeCategory,
    };
  }

  //pdf
  // async generatePDF(data: any, year: number) {
  //   const docDefinition = {
  //     content: [
  //       { text: `Financial Report for Year ${year}`, style: 'header' },
  //       {
  //         text: `Yearly Income: ${data.totalIncome}\nYearly Expense: ${data.totalExpense}`,
  //         style: 'summary',
  //       },
  //       {
  //         text: `Max Income Category: ${data.maxIncomeCategory}`,
  //         style: 'summary',
  //       },
  //       {
  //         text: `Max Expense Category: ${data.maxExpenseCategory}`,
  //         style: 'summary',
  //       },
  //       { text: 'Monthly Breakdown:', style: 'subheader' },
  //       ...data.monthlyStats.map((monthStat: any) => ({
  //         text: `Month ${monthStat.month}: Income - ${monthStat.totalIncome}, Expense - ${monthStat.totalExpense}, Max Income Category: ${monthStat.maxIncomeCategory}, Max Expense Category: ${monthStat.maxExpenseCategory}`,
  //         style: 'monthDetail',
  //       })),
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         alignment: 'center',
  //       },
  //       summary: {
  //         fontSize: 14,
  //         margin: [0, 5],
  //       },
  //       subheader: {
  //         fontSize: 16,
  //         bold: true,
  //         margin: [0, 10],
  //       },
  //       monthDetail: {
  //         fontSize: 12,
  //         margin: [0, 5],
  //       },
  //     },
  //   };

  //   // Generate PDF
  //   const pdfDoc = pdfMake.createPdf(docDefinition);
  //   const filePath = `reports/financial_report_${year}.pdf`;

  //   return new Promise<string>((resolve, reject) => {
  //     pdfDoc.getBuffer((buffer) => {
  //       fs.writeFile(filePath, buffer, (err) => {
  //         if (err) {
  //           reject('Error saving PDF file');
  //         } else {
  //           resolve(filePath); // Return the file path for download
  //         }
  //       });
  //     });
  //   });
  // }

  async findStatisticsYearly(userId: number, year: number) {
    console.log('user', userId);
    console.log('year', year);

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCategories = {}; 
    let expenseCategories = {}; 
    let monthlyStats = [];

    
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 0); 

      const data = await this.transactionModel.findAll({
        where: {
          user_id: userId,
          transaction_date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        include: [
          {
            model: Category,
            attributes: ['id', 'title', 'type'],
          },
        ],
        attributes: ['id', 'amount', 'description', 'transaction_date'],
      });

      let monthIncome = 0;
      let monthExpense = 0;
      let incomeCategoryData = {};
      let expenseCategoryData = {};

      data.forEach((transaction: any) => {
        if (transaction.category.type === 'income') {
          monthIncome += transaction.amount;
          const categoryTitle = transaction.category.title;
          incomeCategoryData[categoryTitle] = (incomeCategoryData[categoryTitle] || 0) + transaction.amount;
        } else if (transaction.category.type === 'expense') {
          monthExpense += transaction.amount;
          const categoryTitle = transaction.category.title;
          expenseCategoryData[categoryTitle] = (expenseCategoryData[categoryTitle] || 0) + transaction.amount;
        }
      });

      totalIncome += monthIncome;
      totalExpense += monthExpense;

      Object.keys(incomeCategoryData).forEach((category) => {
        incomeCategories[category] = (incomeCategories[category] || 0) + incomeCategoryData[category];
      });
      Object.keys(expenseCategoryData).forEach((category) => {
        expenseCategories[category] = (expenseCategories[category] || 0) + expenseCategoryData[category];
      });

      const maxIncomeCategory = Object.keys(incomeCategoryData).reduce((a, b) =>
        incomeCategoryData[a] > incomeCategoryData[b] ? a : b, ''
      );
      const maxExpenseCategory = Object.keys(expenseCategoryData).reduce((a, b) =>
        expenseCategoryData[a] > expenseCategoryData[b] ? a : b, ''
      );

      monthlyStats.push({
        month,
        totalIncome: monthIncome,
        totalExpense: monthExpense,
        maxIncomeCategory,
        maxExpenseCategory,
      });
    }

    const maxIncomeCategory = Object.keys(incomeCategories).reduce((a, b) =>
      incomeCategories[a] > incomeCategories[b] ? a : b, ''
    );
    const maxExpenseCategory = Object.keys(expenseCategories).reduce((a, b) =>
      expenseCategories[a] > expenseCategories[b] ? a : b, ''
    );

    

    const reportData= {
      totalIncome,
      totalExpense,
      maxIncomeCategory,
      maxExpenseCategory,
      monthlyStats,
    };
    // this.generatePDF(reportData,ye)
    return reportData
  }


  

}
