var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);



});

// This application will first display all of the items available for sale, including IDs, names, and prices of products for sale. 

function displayInventory() {
    var query = "Select * FROM products";
    var Table = require('cli-table');
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Add values to table using CLI npm package
        // Instantiate 
        var table = new Table({
            head: ["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"], colWidths: [10, 20, 20, 20, 20]
        });

        // Loop through SQL table and push array into table in console.
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
        }

        console.log(table.toString());
    });
}; // Closes displayInventory. 

displayInventory();

// Prompt the user and ask what is the id of the product they would like to buy. 
var promptUser = function () {
    inquirer.prompt({
        name: "action",
        type: "input",
        message: "What is the id of the product you would like to buy?",

    }).then(function (user) {
        console.log(user.action);
        inquirer.prompt({
            name: "quantity",
            type: "input",
            message: "What is the quantity you would like to purchase? ",

        }).then(function (user) {
            console.log(user.quantity);
            checkQuantity();
        });
    });

}; // Closes promptUser function. 



// Check if your store has enough of the product to meet the customer's request. 
// If not, display "insufficient quantity" and prevent the order from going through. 
// If it does, fulfill the user's order. User should be shown the total cost of their purchase and update should reflect in SQL database. 

// Function to check product's stock quantity. 
var checkQuantity = function () {
    var query = "SELECT stock_quantity FROM products where item_id = ?";
    connection.query(query, [user.action], function (err, res) {
        if (res[0].stock_quantity > user.quantity ) {
            purchaseQuantity(); 
        } else {
            console.log ("Insufficient quantities available!"); 
        }
    });
};


// Function to update product's stock quantity after user "purchase". 
var purchaseQuantity = function () {
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ? ";
    connection.query(query, [user.quantity, user.action], function (err, res) {
        console.log(res); 
    });
};

promptUser(); 

connection.end(); 
