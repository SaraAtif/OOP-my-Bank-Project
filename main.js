import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
console.log(chalk.magenta.bold.italic("\n\t wellcome to `OOP My Bank` by SARA ATIF\n"));
console.log("=".repeat(60));
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName,
            this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(obj) {
        let newBal = this.account.filter((acc) => acc.accNumber !== obj.accNumber);
        this.account = [...newBal, obj];
    }
    ;
}
let HBL = new Bank();
//Create customer
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.helpers.fromRegExp("3#########"));
    let cus = new Customer(fName, lName, 18 * i, "male", num, 1000 + i);
    HBL.addCustomer(cus);
    HBL.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
//Bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please Select the service: ",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                name: "accountNum",
                type: "number",
                message: "Please Enter your Account Number: "
            });
            let account = HBL.account.find((acc) => acc.accNumber == res.accountNum);
            if (!account) {
                console.log(chalk.red.bold.italic("\nInvalid Account Number.\n"));
            }
            if (account) {
                let name = HBL.customer.find((acc) => acc.accNumber == account?.accNumber);
                console.log(`\n Dear ${chalk.blueBright.bold.italic(name?.firstName)} ${chalk.blueBright.bold.italic(name?.lastName)}, Your Account Balance is ${chalk.green.bold.italic(`$${account.balance}`)} \n`);
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                name: "accountNum",
                type: "number",
                message: "Please Enter your Account Number: "
            });
            let account = HBL.account.find((acc) => acc.accNumber == res.accountNum);
            if (!account) {
                console.log(chalk.red.bold.italic("\nInvalid Account Number.\n"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    name: "amount",
                    type: "number",
                    message: "Please Enter the amount you want to withdraw: $"
                });
                if (ans.amount > account.balance) {
                    console.log(chalk.red.bold.italic("\nSorry, You have insufficient balance...\n"));
                }
                else {
                    let newBalance = account.balance - ans.amount;
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(`\n$${chalk.greenBright.bold.italic(ans.amount)} withdraw successfully!, Your Remaining Balance is $${chalk.greenBright.bold.italic(newBalance)}\n`);
                }
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                name: "accountNum",
                type: "number",
                message: "Please Enter your Account Number: "
            });
            let account = HBL.account.find((acc) => acc.accNumber == res.accountNum);
            if (!account) {
                console.log(chalk.red.bold.italic("\nInvalid Account Number.\n"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    name: "amount",
                    type: "number",
                    message: "Please Enter the amount you want to deposit: $"
                });
                if (ans.amount >= 100) {
                    account.balance -= 1;
                }
                let newBalance = account.balance + ans.amount;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(`\n$${chalk.greenBright.bold.italic(ans.amount)} withdraw successfully!, Your Remaining Balance is $${chalk.greenBright.bold.italic(newBalance)}\n`);
            }
        }
        if (service.select == "Exit") {
            console.log(chalk.red.bold.italic("Exiting..."));
            process.exit();
        }
    } while (true);
}
bankService(HBL);
