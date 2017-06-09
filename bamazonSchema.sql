CREATE DATABASE if not exists bamazon_db;
 
USE bamazon_db;
 
CREATE TABLE products (
	item_id INTEGER(11) auto_increment NOT NULL, 
    product_name VARCHAR(30) NOT NULL, 
    department_name VARCHAR(30), 
    price FLOAT(10),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
); 
