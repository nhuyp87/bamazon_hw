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
inquirer.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "View products for sale",
      "View low inventory",
      "Add to inventory",
      "Add new product"
    ]
  }).then(function(answer) {
    switch (answer.action) {
      case "View products for sale":
        artistSearch();
        break;
      case "View low inventory":
        multiSearch();
        break;
      case "Add to inventory":
        rangeSearch();
        break;
      case "Add new product":
        songSearch();
        break;
    }
  });
};