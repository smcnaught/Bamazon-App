var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var choicesArr = ["View Product Sales by Department", "Create New Department"];
var prodSalesArr = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "password",
    database: "bamazon"
});

mainMenu();

function mainMenu() {
    // Running this function will list a set of menu options:
    // (1) View Product Sales by Department
    // (2) Create New Department
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "What would you like to do Supervisor?",
            choices: choicesArr
        }
    ]).then(function (answers) {
        if (answers.menu === choicesArr[0]) {
            prodSalesFunc();
        } else if (answers.menu === choicesArr[1]) {
            createDeptFunc();
        } else {
            console.log("Not a valid command");
        }
    })

}

function prodSalesFunc() {
    // this table should show: 
    // department_id, department_name, over_head_costs, product_sales, total_profit
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (var k = 0; k < results.length; k++) {

            prodSalesArr.push(results[k].product_sales);
        }

        connection.query("SELECT * FROM departments", function (err, results) {
            if (err) throw err;

            // instantiate 
            var table = new Table({
                head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit']
                , colWidths: [20, 20, 20, 20, 20]
            });
            for (var i = 0; i < results.length; i++) {
                var deptID = results[i].department_id;
                var deptName = results[i].department_name;
                var overHC = results[i].over_head_costs;
                var prodSales = prodSalesArr[i];
                var totalProf = prodSales - overHC;


                // Insert values into the table.
                table.push(
                    [deptID, deptName, overHC, prodSales, totalProf]
                );

            }
            console.log(table.toString());

        })
    })

}

function createDeptFunc() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the department name?"
        },
        {
            name: "overHC",
            type: "input",
            message: "What are the over head costs associated with this department?"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO departments SET ?",
    {
        department_name: answer.departmentName,
        over_head_costs: answer.overHC
    },
    function(err){
        if (err) throw err;
    })
    console.log("Your department has been added.");
    })
}

