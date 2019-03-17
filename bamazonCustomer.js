// Required npm packages to for this project
      const mysql = require('mysql');
      const inquirer = require('inquirer');
// using easy-table npm package to display in a table format
      const Table = require('easy-table');
      
// create conection to database with password
      var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "----------",
        database: "bamazon"
      });
      connection.connect();
      console.log("=========================");
      console.log("Welcome to Bamazon store!");
      console.log("===========================");
      console.log("Products available for sale!");
      displayTable();
      
      
// function to display all my products 
      function displayTable() {
          connection.query("SELECT * FROM products", function(error, results) {
      
              if (error) throw error;
              console.log("\n");
      var t = new Table;
      
            results.forEach(function(product) {
                t.cell('Item_name', product.item_id);
                t.cell('Product_name', product.product_name);
                t.cell('Department_name', product.department_name);
                t.cell('Price', product.price);
                t.cell('Stock_quantity', product.stock_quantity)
                t.newRow();
      
            });
      
              console.log(t.toString());
              console.log("===============================================");

              inquirer.prompt([{
                  type: 'input',
                  name: 'product_name',
                  message: 'Enter the Product Name you would like to buy?',
                
              }, {
                  type: 'input',
                  name: 'quantity',
                  message: 'Enter how many units you would like to buy?',
              }]).then(function(answers) {
      
                  connection.query("SELECT * FROM products WHERE ?", {product_name: answers.product_name}, function(error, results) {
//--we check if we have enough quantity based on customer input ----//
                      if (results[0].stock_quantity < answers.quantity) {
                        console.log("\n");
                        console.log("Insufficient quantity!");
                        console.log("We currently only have " + results[0].stock_quantity + " " + results[0].product_name + ".");
                        console.log("\n");
                     
                      } else {
                        console.log("======================================================");
                        console.log("Thank you for your patronage! Your order of "+ answers.quantity + " " + results[0].product_name + " is now being processed.");
                        console.log("Your total is: $" + (answers.quantity * results[0].price));
                            };
                        continueShopping();
                   })

              })
            })
          };
//---- function to ask if customer wants to continue shop ----//
    function continueShopping(){
		inquirer.prompt([
			{
        name: "input",
				type: "confirm",
				message: "Would you like to continue shopping? "
			}
		])
		.then(function (shopping) {
			if (shopping.input) {
				displayTable();
			}
			else {
				exitBamazon();
			}
		});
	};
//---- function to exit the app ----//
	function exitBamazon(){
    connection.end();
    console.log("Thank you for shopping with us! Come back again soon!");
		console.log("Goodbye!!!");
	};
    
      
      
     

      
      
