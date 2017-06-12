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





// List of menu options:
// - view products for sale 
//     - list every available item (item id, names, prices, and quantities)
// - view low inventory 
//     - list all items with inventory count lower than 5
// - add to inventory 
//     - display prompt that will let the manager add more of any item currently in the store 
// - add new product 
//     - allow manager to add a completely new product to the store 

// Main menu list. 
var mainMenu = function () {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View products for sale",
            "View low inventory",
            "Add to inventory",
            "Add new product"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View products for sale":
                viewProduct();
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addProduct();
                break;
        }
    });
};

// Function to allow user to make another purchase. Also restarts app. 
var contPurchase = function () {
    // Ask user if he or she would like to continue purchases. 
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Would you like to return to the main menu?",
        choices: ["Yes", "No"]

    }]).then(function (user) {
        if (user.action == "Yes") {
            mainMenu();
        } else {
            console.log("Thank you. Have a nice day.");
            connection.end();
        }

    });

};

// Display all products.

// Function to view products for sale and list ids, product names, quantities. 
function viewProduct() {
    var query = "Select * FROM products";
    var Table = require('cli-table');
    // Query to display table. 
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
        // Inquirer to prompt user. 
        contPurchase();
    });
}; // Closes viewProduct function.


// Function to view low inventory where quantities are lower than 5. 

function lowInventory() {
    var query = "Select * FROM products WHERE stock_quantity < 5";
    var Table = require('cli-table');
    // Query to display table. 
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
        // Inquirer to prompt user. 
        contPurchase();
    });
}; // Closes viewProduct function.


// Function to allow manager to add quantity to any product in the store. 


function addInventory() {
    viewProduct(); 
    inquirer.prompt([{
        name: "action",
        type: "input",
        message: "What is the id of the product for which you would like to add additional inventory?",

    }, {
        name: "quantity",
        type: "input",
        message: "How much inventory would you like to add? ",

    }]).then(function (user) {

        connection.query("UPDATE products SET stock_quantity ? WHERE item_id = ? UNION SELECT * FROM products", [user.quantity, user.action], function (err, res) {
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



    });

}




mainMenu();