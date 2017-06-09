USE bamazon_db;

INSERT INTO products 
	(product_name, department_name, price, stock_quantity) 
VALUES 
	("T-shirt", "Clothing", 5, 200),
    ("Jean", "Clothing", 50, 500),
    ("Laptop", "Electronics", 1000, 700),
    ("Notebook", "Office Supplies", 2, 1000),
    ("Shampoo", "Beauty", 5, 500),
    ("Backpack", "Travel", 50, 600),
    ("Coffee", "Food", 5, 500),
    ("Conditioner", "Beauty", 5, 500),
    ("Light Bulb", "Home", 6, 700),
    ("Pencil", "Office Supplies", 1, 500);
    

SELECT * FROM products;

