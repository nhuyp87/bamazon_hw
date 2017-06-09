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
        promptUser();
    });


}; // Closes displayInventory. 


// Prompt the user and ask what is the id of the product they would like to buy. 
var promptUser = function () {
    inquirer.prompt([{
        name: "action",
        type: "input",
        message: "What is the id of the product you would like to buy?",

    }, {
        name: "quantity",
        type: "input",
        message: "What is the quantity you would like to purchase? ",

    }]).then(function (user) {

        checkQuantity(user);

    });

}; // Closes promptUser function. 

// Check if your store has enough of the product to meet the customer's request. 
// If not, display "insufficient quantity" and prevent the order from going through. 
// If it does, fulfill the user's order. User should be shown the total cost of their purchase and update should reflect in SQL database. 

// Function to check product's stock quantity. 
var checkQuantity = function (user) {
    connection.query("SELECT * FROM products WHERE item_id = ?", [user.action], function (err, res) {
        if (res[0].stock_quantity > user.quantity) {
            purchaseQuantity(user, res);
        } else {
            console.log("Insufficient quantities available!");
            contPurchase(); 
        }
    });
};


// Function to update product's stock quantity after user "purchase". 
var purchaseQuantity = function (user, res) {
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ? ";
    connection.query(query, [res[0].stock_quantity-parseInt(user.quantity), user.action], function (err, resUpdate) {
       console.log("You have completed your purchase."); 
    });
    
   contPurchase();  
};

// Function to allow user to make another purchase. Also restarts app. 
var contPurchase = function () {
    // Ask user if he or she would like to continue purchases. 
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Would you like to make another purchase?",
        choices: ["Yes", "No"]

    }]).then(function (user) {
        if (user.action == "Yes") {
            displayInventory(); 
        } else {
            console.log("Thank you. Have a nice day.");
            connection.end(); 
        }
    
    });

}; 


displayInventory();

