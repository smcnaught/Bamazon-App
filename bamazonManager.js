var mysql = require("mysql");
var inquirer = require("inquirer");
var choicesArr = ["Main Menu", "Items for Sale", "Low Inventory Items", "Add Inventory", "Add Products"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "password",
    database: "bamazon"
});

mainMenuFunc();

function mainMenuFunc() {
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "Hi Manager! What would you like?",
            choices: choicesArr
        }
    ]).then(function (answer) {
        var managerCommand = answer.menu;

        switch (managerCommand) {
            case "Main Menu":
                mainMenuFunc();
                break;
            case "Items for Sale":
                forSaleFunc();
                break;
            case "Low Inventory Items":
                lowInvFunc();
                break;
            case "Add Inventory":
                addInvFunc();
                break;
            case "Add Products":
                addProdFunc();
                break;
            default:
                console.log("Not a valid command");
                break;
        }
    })
}
function forSaleFunc() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        //If a manager selects View Products for Sale,
        //the app should list every available item: the item IDs, names, prices, and quantities.
        for (var i = 0; i < results.length; i++) {
            var id = results[i].item_id;
            var name = results[i].product_name;
            var price = results[i].price;
            var quantity = results[i].stock_quantity;
            console.log("Item: " + JSON.stringify(name));
            console.log("ID: " + JSON.stringify(id));
            console.log("Price: $" + JSON.stringify(price));
            console.log("Item quantity: " + JSON.stringify(quantity));
            console.log("=========================================");
        }
        // Takes the manager back to the main menu.
        mainMenuFunc();
    })
}

function lowInvFunc() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        // If a manager selects View Low Inventory, then it should list all items with an inventory 
        // count lower than five.
        for (var i = 0; i < results.length; i++) {
            var name = results[i].product_name;
            var quantity = results[i].stock_quantity;
            if (quantity < 5) {
                console.log(JSON.stringify(name) + " is running low");
                console.log("=========================================");
            }
        }
        // Takes the manager back to the main menu.
        mainMenuFunc();
    })
}

function addInvFunc() {
    inquirer.prompt([
        {
            name: "ID",
            type: "input",
            message: "Please enter the ID of the item you'd like to increase in inventory."
        },
        {
            name: "increaseBy",
            type: "input",
            message: "How much would you like to increase the inventory by?"
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products", function (error, results) {
            if (error) throw error;
            var managerIDAns = answer.ID;
            var considerArray = managerIDAns - 1;
            var curQuantity = results[considerArray].stock_quantity;

            // If a manager selects Add to Inventory, your app should display a prompt that will 
            // let the manager "add more" of any item currently in the store.
            for (var j = 0; j < results.length; j++) {
                if (managerIDAns == results[j].item_id) {
                    console.log("Inventory purchased!");

                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: parseInt(answer.increaseBy) + curQuantity
                            },
                            {
                                item_id: managerIDAns
                            }
                        ])
                }
            }

            // Takes the manager back to the main menu.
            mainMenuFunc();
        })

    })

}

function addProdFunc() {
    // If a manager selects Add New Product, it should allow the manager to add a completely 
    // new product to the store.
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What is the name of the product you would you like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "Which department does this product come from?",
        },
        {
            name: "price",
            type: "input",
            message: "What is the price per unit?"
        },
        {
            name: "stockQuan",
            type: "input",
            message: "How many do we have in stock?"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.productName,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stockQuan
            },
            function (err) {
                if (err) throw err;
            }

        )
        // Takes the manager back to the main menu.
        mainMenuFunc();

    })
}


