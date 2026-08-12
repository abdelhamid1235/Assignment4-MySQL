// Part 3: (Using Node.js and MySQL) Answer the Questions below based on the given Scenario

// 1- Create the required tables for the retail store database based on 
// the tables structure and relationships
    
    // CREATE TABLE products(
    //     product_id int PRIMARY key AUTO_INCREMENT ,
    //     product_name varchar(100) not null ,
    //     price decimal(10,2) not null  ,
    //     stock_quantity INT not null ,
    //     P_supplier_id INT NOT NULL,
    //     CONSTRAINT FK_P_SUP FOREIGN KEY (P_supplier_id) REFERENCES suppliers (supplier_id)
    //     on  DELETE CASCADE 
    //     on UPDATE CASCADE
    // ); 



// 2.Suppliers Table:

    // CREATE TABLE suppliers(
    //     supplier_id int PRIMARY key AUTO_INCREMENT ,
    //     supplier_name varchar(100) not null ,
    //     contact_number varchar(100) not null 
    // );


// 3.Sales Table:

    // CREATE TABLE sales(
    //     sales_id int PRIMARY key AUTO_INCREMENT ,
    //     quantity_sold INT not null ,
    //     sale_date DATE not null ,
    //     s_product_id INT NOT NULL, 
    //     CONSTRAINT FK_P_Sales FOREIGN KEY (s_product_id) REFERENCES products (product_id)
    //     on  DELETE CASCADE 
    //     on UPDATE CASCADE
    // ); 


const express = require('express')
const { bootstrap , db } = require('./db')
const app = express()
const port = 3000

bootstrap(app , port)

app.use(express.json())


// 2:Create REST API endpoints to perform CRUD operations for the Products table:

// a:Create a product
app.post('/products', async (req, res , next) => {
    try {
        const { product_name, price, stock_quantity, P_supplier_id } = req.body;
        if (!product_name || price === undefined || stock_quantity === undefined || !P_supplier_id) {
            return res.status(400).json({
                message: 'product_name, price, stock_quantity and P_supplier_id are required'
            });
        }
        const query = `
            INSERT INTO products
            (product_name, price, stock_quantity, P_supplier_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            product_name,
            price,
            stock_quantity,
            P_supplier_id
        ]);
        res.status(201).json({
            message: 'Product created successfully',
            product_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
});

// b:Retrieve all products
app.get('/products', async (req, res , next) => {
    try {
        const [result] = await db.execute(
            'SELECT * FROM products'
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving products',
            error: error.message
        });
    }
});

//c:Retrieve a product by ID
app.get('/products/:id', async (req, res , next) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute(
            'SELECT * FROM products WHERE product_id = ?',
            [id]
        );
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving product',
            error: error.message
        });
    }
});

// d:Update a product
app.patch('/products/:id', async (req, res , next) => {
    try {
        const { id } = req.params;
        const { product_name, price, stock_quantity, P_supplier_id } = req.body;
        if (!product_name || price === undefined || stock_quantity === undefined || !P_supplier_id) {
            return res.status(400).json({
                message: 'product_name, price, stock_quantity and P_supplier_id are required'
            });
        }
        const query = `
            UPDATE products
            SET product_name = ?,
                price = ?,
                stock_quantity = ?,
                P_supplier_id = ?
            WHERE product_id = ?
        `;
        const [result] = await db.execute(query, [
            product_name,
            price,
            stock_quantity,
            P_supplier_id,
            id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json({
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});

// e:Delete a product
app.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute(
            'DELETE FROM products WHERE product_id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
});
//------------------------------------

// 3: Create REST API endpoints to perform CRUD operations for the Suppliers table:

// a:Create a supplier
app.post('/suppliers', async (req, res) => {
    try {
        const { supplier_name, contact_number } = req.body;
        if (!supplier_name || !contact_number) {
            return res.status(400).json({
                message: 'supplier_name and contact_number are required'
            });
        }
        const query = `
            INSERT INTO suppliers
            (supplier_name, contact_number)
            VALUES (?, ?)
        `;
        const [result] = await db.execute(query, [
            supplier_name,
            contact_number
        ]);
        res.status(201).json({
            message: 'Supplier created successfully',
            supplier_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating supplier',
            error: error.message
        });
    }
});

// b:Retrieve all suppliers
app.get('/suppliers', async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM suppliers
        `;

        const [result] = await db.execute(query);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving suppliers',
            error: error.message
        });
    }
});

// c:Update supplier information
app.patch('/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { supplier_name, contact_number } = req.body;

        if (!supplier_name || !contact_number) {
            return res.status(400).json({
                message: 'supplier_name and contact_number are required'
            });
        }

        const query = `
            UPDATE suppliers
            SET supplier_name = ?,
                contact_number = ?
            WHERE supplier_id = ?
        `;

        const [result] = await db.execute(query, [
            supplier_name,
            contact_number,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            message: 'Supplier updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating supplier',
            error: error.message
        });
    }
});

//d:Delete a supplier
app.delete('/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM suppliers
            WHERE supplier_id = ?
        `;

        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            message: 'Supplier deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting supplier',
            error: error.message
        });
    }
});
//--------------------------------------------

// 4:Create REST API endpoints to manage Sales :

// a:Record a sale
app.post('/sales', async (req, res ,  next) => {
    try {
        const { quantity_sold, sale_date, s_product_id } = req.body;

        if (!quantity_sold || !sale_date || !s_product_id) {
            return res.status(400).json({
                message: 'quantity_sold, sale_date and s_product_id are required'
            });
        }

        const query = `
            INSERT INTO sales
            (quantity_sold, sale_date, s_product_id)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            quantity_sold,
            sale_date,
            s_product_id
        ]);

        res.status(201).json({
            message: 'Sale recorded successfully',
            sales_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error recording sale',
            error: error.message
        });
    }
});

// b:Retrieve all sales
app.get('/sales', async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM sales
        `;

        const [result] = await db.execute(query);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving sales',
            error: error.message
        });
    }
});

// c:Retrieve sales for a specific product
app.get('/sales/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const query = `
            SELECT *
            FROM sales
            WHERE s_product_id = ?
        `;

        const [result] = await db.execute(query, [productId]);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving sales for this product',
            error: error.message
        });
    }
});

// 5:Create API endpoints to perform the following database modifications:

// a- Add a column “Category” to the Products table
app.post('/addCategory' , (req , res , next)=>{
    const insertedQuery = `ALTER TABLE products ADD COLUMN  category VARCHAR(100);`

    db.execute(insertedQuery , (error , result , fields)=>{
        if(error){
            return res.status(500).json({message : "Query Error"})
        }
        return res.status(201).json({message : "Added Done" , result })

    })
})

// b Remove the “Category” column from Products
app.post('/deleteCategory' , (req , res , next)=>{
    const deletedQuery = `ALTER TABLE products DROP COLUMN category;`

    db.execute(deletedQuery, (error , result , fields)=>{
        if(error){
            return res.status(500).json({message : "Query Error" , error: error.message })
        }
        return res.status(201).json({message : "Column 'category' removed successfully" , result })

    })
})

// c- Change “ContactNumber” column in Suppliers to VARCHAR (15)
app.post('/changeContactNumber' , (req , res , next)=>{

    const changedQuery = ` ALTER TABLE suppliers MODIFY COLUMN contact_number VARCHAR(15);`
    db.execute(changedQuery , (error , result , fields )=>{

        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Column 'contactNumber' modified successfully" , result})

    })
})

// d - Add a NOT NULL constraint to ProductName
app.post('/changeProductName' , (req , res , next)=>{

    const changedQuery = `ALTER TABLE products MODIFY COLUMN product_name VARCHAR(100) not null;`
    db.execute(changedQuery , (error , result , fields )=>{

        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Column 'ProductName' modified successfully" , result})

    })
})
//--------------------------------------------

// 6- Create an API endpoint or initialization script to insert the following data

// a.Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
app.post('/addSupplier' , (req , res , next)=>{

    const changedQuery = `INSERT INTO suppliers (supplier_name, contact_number) VALUES ('FreshFoods', '01001234567');`
    db.execute(changedQuery , (error , result , fields )=>{

        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Supplier added successfully" , result})

    })
})

// b.Insert the following three products, all provided by 'FreshFoods':
app.post('/addProducts' , (req , res , next)=>{

    const changedQuery = `INSERT INTO products (product_name, price , stock_quantity,P_supplier_id )
        VALUES
        ('Milk', 15.00, 50, (SELECT supplier_id FROM suppliers WHERE supplier_name = 'FreshFoods')),
        ('Bread', 10.00, 30, (SELECT supplier_id FROM suppliers WHERE supplier_name = 'FreshFoods')),
        ('Eggs', 20.00, 40, (SELECT supplier_id FROM suppliers WHERE supplier_name = 'FreshFoods'));`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Products added successfully" , result})
    })
})
// c.Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
    app.post('/addSales' , (req , res , next)=>{

    const changedQuery = `INSERT INTO sales (quantity_sold, sale_date, s_product_id)
                VALUES (
                    2,
                    '2025-05-20',
                    (SELECT product_id FROM products WHERE product_name = 'Milk' LIMIT 1)
                );`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Sales added successfully" , result})

    })
})
//---------------------------------------------------

// 7 Update the price of 'Bread' to 25.00
app.post('/updateProduct' , (req , res , next)=>{

    const changedQuery = `update products SET price = 25.00 where product_name = 'Bread'`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "product updated successfully" , result})

    })
})

// 8 Delete the product 'Eggs'.
app.post('/deleteProduct' , (req , res , next)=>{
    const changedQuery = `delete from products where product_name = 'Eggs'`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "product deleted successfully" , result})

    })
})

// 9-  Retrieve the total quantity sold for each product
app.post('/retrieveQuantity' , (req , res , next)=>{
    const changedQuery = `SELECT p.product_name,SUM(s.quantity_sold) AS total_sold
                FROM products p
                JOIN sales s 
                    ON p.product_id = s.s_product_id
                GROUP BY p.product_id, p.product_name;`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Retrieve the total quantity sold successfully" , result})

    })
})

// 10- Get the product with the highest stock.
app.post('/highestStock' , (req , res , next)=>{
    const changedQuery =  `
        SELECT *
        FROM products
        ORDER BY stock_quantity DESC
        LIMIT 1;
    `
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        if (!result?.length ) {
            return res.status(404).json({message: "No products found"});
        }
        return res.status(201).json({message : " Get the highest stock successfully" , result})

    })
})

// 11 - Find suppliers with names starting with 'F'.
app.post('/findSuppliersWithName' , (req , res , next)=>{

    const changedQuery =`SELECT *
                FROM suppliers
                WHERE supplier_name LIKE 'F%';`
    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        if (!result?.length ) {
            return res.status(404).json({message: "No Suppliers found with name F"});
        }
        return res.status(201).json({message : " find Suppliers With Name successfully" , result})

    })
})

// 12- Show all products that have never been sold
app.post('/findProductNeverSold' , (req , res , next)=>{
    const changedQuery = `SELECT p.*
                FROM products p
                LEFT JOIN sales s
                ON p.product_id = s.s_product_id
                WHERE s.s_product_id IS NULL;`

    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        if (!result?.length ) {
            return res.status(404).json({message: "No products found"});
        }
        return res.status(201).json({message : " all products that have never been sold successfully" , result})

    })
})

// 13- Get all sales along with product name and sale date.
app.post('/GetSales' , (req , res , next)=>{
    const changedQuery = `SELECT 
            p.product_name,
            s.quantity_sold,
            s.sale_date
            FROM sales s
            JOIN products p
            ON s.s_product_id = p.product_id;`

    db.execute(changedQuery , (error , result , fields )=>{
        if(error){
            return res.status(500).json({message :"Query Error"})
        }
        return res.status(201).json({message : "Get all sales along with product name and sale date successfully" , result})

    })
})

// 14- Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables.

// CREATE USER 'store_manager'@'localhost' IDENTIFIED BY '123456';

// GRANT SELECT, INSERT, UPDATE
// ON retail_db_assignment.*
// TO 'store_manager'@'localhost';



// 15- Revoke UPDATE permission from “store_manager”.

// REVOKE UPDATE
// ON retail_db_assignment.*
// FROM 'store_manager'@'localhost';


// 16- Grant DELETE permission to “store_manager” only on the Sales table

// GRANT DELETE
// ON retail_db_assignment.sales
// TO 'store_manager'@'localhost';