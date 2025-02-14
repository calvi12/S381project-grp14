const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('cookie-session');
// mongodb driver (connection string)
const uri = '' 
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const formidable = require('express-formidable');

const dbName = 'Shop_Management_System';
const userCollection = 'users';
const productCollection = 'products';
const key = 'Secert key';
const port = 8099;

// import userSchema
const userSchema = require('./models/userModel');
const User = mongoose.model('user', userSchema);

// import productSchema
const productSchema = require('./models/productModel');
const Product = mongoose.model('product', productSchema);

// Declare EJS as the view engine
app.set('view engine', 'ejs');

// Middleware for session management
app.use(session({
    name: 'loginSession',
    keys: [key]
}));

// Initialize express-formidable
app.use(formidable());
// Virtual path
app.use("/public", express.static('public/'));

// MongoDB document operations
const insertDocument = async (db, doc) => {
    const collection = db.collection(productCollection);
    let result = await collection.insertOne(doc);
    console.log("Inserted document: " + JSON.stringify(result));
    return result;
};

const findDocument = async (db, criteria) => {
    const collection = db.collection(productCollection);
    let result = await collection.find(criteria).toArray();
    return result;
};

const updateDocument = async (db, criteria, updateData) => {
    const collection = db.collection(productCollection);
    let result = await collection.updateOne(criteria, { $set: updateData });
    console.log("Updated document: " + JSON.stringify(result));
    return result;
};

const deleteDocument = async (db, criteria) => {
    const collection = db.collection(productCollection);
    let result = await collection.deleteOne(criteria);
    console.log("Deleted document: " + JSON.stringify(result));
    return result;
};

// User authentication functions
const checkUser = async (db, userName) => {
    const collection = db.collection(userCollection);
    let result = await collection.find({ name: userName }).toArray();
    return result.length > 0;
};

const checkPassword = async (db, password) => {
    const collection = db.collection(userCollection);
    let result = await collection.find({ password: password }).toArray();
    return result.length > 0;
};

// Product handling functions
const handleFindProducts = async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const products = await findDocument(db, {});
    await client.close();
    res.status(200).render('overview', { products, name: req.session.user });
};

const handleCreateProduct = async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    let newProduct = new Product({
        productId: req.fields.productid,
        name: req.fields.name,
        category: req.fields.category,
        quantity: req.fields.quantity,
        price: req.fields.price
    });
    await insertDocument(db, newProduct);
    res.redirect('/products');
};

const handleProductDetails = async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        let productId = { _id: new ObjectId(req.query.id) };
        const product = await findDocument(db, productId);
        await client.close();

        if (product.length > 0) {
            res.status(200).render('details', { product: product[0], user: req.session.user });
        } else {
            res.status(404).render('info', { message: 'Product not found', user: req.session.user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('info', { message: 'Internal Server Error', user: req.session.user });
    }
};

const handleEditProduct = async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        let productId = { _id: new ObjectId(req.query.id) };
        const product = await findDocument(db, productId);
        await client.close();

        if (product.length > 0) {
            res.status(200).render('edit', { product: product[0], user: req.session.user });
        } else {
            res.status(404).render('info', { message: 'Product not found', user: req.session.user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('info', { message: 'Internal Server Error', user: req.session.user });
    }
};

const handleUpdateProduct = async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        let productId = { _id: new ObjectId(req.query.id) };
        let updateData = {
            name: req.fields.name,
            category: req.fields.category,
            quantity: req.fields.quantity,
            price: req.fields.price
        };
        await updateDocument(db, productId, updateData);
        await client.close();
        res.status(200).render('info', { message: 'Product updated successfully', user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).render('info', { message: 'Internal Server Error', user: req.session.user });
    }
};

const handleDeleteProduct = async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        let productId = { _id: new ObjectId(req.query.id) };
        await deleteDocument(db, productId);
        await client.close();
        res.status(200).render('info', { message: 'Product deleted successfully', user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).render('info', { message: 'Internal Server Error', user: req.session.user });
    }
};
// Routes

app.get('/', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/login');
    } else {
        handleFindProducts(req, res);
    }
});

app.get('/login', (req, res) => {
    res.status(200).render('login', { msg: null });
});

app.post('/login', async (req, res) => {
    let userName = req.fields.name; 
    let password = req.fields.password; 
    try {
        await client.connect();
        const db = client.db(dbName);
        if (await checkUser(db, userName) && await checkPassword(db, password)) {
            req.session.authenticated = true;
            req.session.user = userName;
            res.redirect('/');
        } else {
            res.render('login', { msg: 'Invalid username or password!' });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    res.status(200).render('register', { msg: null });
});

app.post('/register', async (req, res) => {
    let userName = req.fields.name; 
    let password = req.fields.password; 
    let passwordConfirm = req.fields.passwordConfirm; 
    try {
        await client.connect();
        const db = client.db(dbName);
        if (await checkUser(db, userName)) {
            res.render('register', { msg: 'User is already used' });
        } else if (password.length < 4) {
            res.render('register', { msg: 'Password is too short' });
        } else if (password !== passwordConfirm) {
            res.render('register', { msg: 'Passwords do not match' });
        } else {
            const user = new User({ name: userName, password: password });
            await db.collection(userCollection).insertOne(user);
            res.render('login', { msg: null });
        }
    } catch (error) {
        console.error(error);
    }
});

app.get('/logout', (req, res) => {
    req.session = null; // clear cookie-session
    console.log('User logged out!');
    res.redirect('/');
});

app.get('/create', (req, res) => {
    res.status(200).render('create', { name: req.session.user });
});

app.post('/create', (req, res) => {
    handleCreateProduct(req, res);
});

app.get('/products', (req, res) => {
    handleFindProducts(req, res);
});

app.get('/details', (req, res) => {
    handleProductDetails(req, res);
});

app.get('/edit', (req, res) => {
    handleEditProduct(req, res);
});

app.post('/update', (req, res) => {
    handleUpdateProduct(req, res);
});

app.get('/delete', (req, res) => {
    handleDeleteProduct(req, res);
});


//RESTFUL

//Create
app.post('/api/product/:productid', async(req, res) => {
    if (req.params.productid){
        console.log(req.body);
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        const newDoc = new Product({
            productId: req.fields.productId || req.params.productid,
            name: req.fields.name,
            category: req.fields.category,
            quantity: req.fields.quantity,
            price: req.fields.price
        });
        await insertDocument(db, newDoc);
        res.status(200).json({"Successfully inserted": newDoc}).end();
    } else{
        res.status(500).json({"error": "missing product id"});
    }
})

//Find by productid
app.get('/api/product/:productid', async(req, res) =>{
    if(req.params.productid){
        console.log(req.body);
        let criteria = {};
        criteria['productId'] = req.params.productid;
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);
        res.status(200).json(docs);
    }else{
        res.status(500).json({"error": "missing product id"}).end();
    }
})

//Find by category
app.get('/api/product/category/:category', async(req, res) => {
    if(req.params.category){
        console.log(req.body);
        let criteria = {};
        criteria['category'] = req.params.category;
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);
        res.status(200).json(docs);
    }else{
        res.status(500).json({"error": "missing category"}).end();
    }
})

//Find by name
app.get('/api/product/name/:name', async(req, res) => {
    if(req.params.name){
        console.log(req.body);
        let criteria = {};
        criteria['name'] = req.params.name;
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);
        res.status(200).json(docs);
    }else{
        res.status(500).json({"error": "missing name"}).end();
    }
})

//Update
app.put('/api/product/:productid', async(req, res) =>{
    if(req.params.productid){
        console.log(req.body);
        let criteria = {};
        criteria['productId'] = req.params.productid;
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        let results = {
            name: req.fields.name,
            category: req.fields.category,
            quantity: req.fields.quantity,
            price: req.fields.price
        }
        let docs = await updateDocument(db, criteria, results);
        res.status(200).json(docs).end();
    }else{
        res.status(500).json({"error": "missing product id"}).end();
    }
})

//Delete
app.delete('/api/product/:productid', async(req, res) =>{
    if(req.params.productid){
        console.log(req.body);
        let criteria = {};
        criteria['productId'] = req.params.productid;
        await client.connect();
        console.log("Connected successflly to server");
        const db = client.db(dbName);
        let docs = await deleteDocument(db, criteria);
        res.status(200).json(docs).end();
    }else{
        res.status(500).json({"error": "missing product id"}).end();
    }
})

//End of Restful

// Start the server
app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
