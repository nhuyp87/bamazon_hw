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

// Prompt the user. 
var promptUser = function () {
    inquirer.prompt({
        name: "action",
        type: "input",
        message: "What would you like to do?",
        choices: [
            "Find songs by artist",
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "Find songs by artist":
                artistSearch();
                break;

            case "Find all artists who appear more than once":
                multiSearch();
                break;

            case "Find data within a specific range":
                rangeSearch();
                break;

            case "Search for a specific song":
                songSearch();
                break;

            case "Find artists with a top song and top album in the same year":
                songAndAlbumSearch();
                break;
        }
    });

}; // Closes promptUser function. 

// What is the ID of the product they would like to buy?
// Check if your store has enough of the product to meet the customer's request. 
// If not, display "insufficient quantity" and prevent the order from going through. 
// If it does, fulfill the user's order. User should be shown the total cost of their purchase and update should reflect in SQL database. 



connection.end(); 
