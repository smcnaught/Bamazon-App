var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "password",
    database: "bamazon"
});

forSaleFunc();
// connection.connect(function (err) {
//     if (err) throw err;

// })

function forSaleFunc() {
    // Display all the items available for sale (id, name & price).
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            var id = results[i].item_id;
            var name = results[i].product_name;
            var price = results[i].price;
            console.log("ID: " + JSON.stringify(id));
            console.log("Item: " + JSON.stringify(name));
            console.log("Price: " + JSON.stringify(price));
            console.log("=========================================");
        }
        purchaseQuestionsFunc();
    })
}

function purchaseQuestionsFunc() {
    // The first should ask them the ID of the product they would like to buy.
    // The second message should ask how many units of the product they would like to buy.
    inquirer.prompt([
        {
            name: "ID",
            type: "input",
            message: "What is the ID of the product you would like to purchase?"

        },
        {
            name: "Amount",
            type: "input",
            message: "How many units of the product would you like to purchase?"
        }]).then(function (answer) {
            // console.log(customerProd);
            connection.query("SELECT * FROM products", function (err, results) {
                var customerProd = answer.ID - 1;
                var stockQuan = results[customerProd].stock_quantity;
                var prodCost = results[customerProd].price;
                var prodSales = results[customerProd].product_sales;
                var totalCost = prodCost * answer.Amount;

                if (err) throw err;

                // console.log("This is how much I ordered: " + answer.Amount);
                // console.log("This is the current stock quantitiy for that item: " + stockQuan);
                // Check if store has enough product to meet the customer request.
                if (answer.Amount > stockQuan) {
                    console.log("Insufficient quantity!");
                } else {
                    // Update the bamazon database to reflect the remaining quantity.
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: stockQuan - answer.Amount,
                            product_sales: prodSales + totalCost
                        },
                        {
                            item_id: answer.ID

                        }
                    ],
                        function (error) {
                            if (error) throw error;
                            console.log("Your order has be placed!");
                            // Once the update goes through, show the customer the total cost of their purchase.
                            console.log("The total cost of your purchase was: $" + totalCost);
                        })

                }
            })

        })

}
