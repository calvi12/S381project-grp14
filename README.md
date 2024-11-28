#S381F group

# shop management system

The project is a website to manage a supermarket warehouse database. It allows users to perform CRUD (Create, Read, Update, Delete) operations on data and supports user authentication through registration and login, logout operations can also be performed, and the application can connect to a MongoDB database to store and retrieve data.

# group 14 

# Participating students: 13664536 Chow ChiChung,13545375 Yao YiTong,13559724 Peng Haichen

#Project file intro:

.
├── models/
│   ├── productModel.js    # product attribute
│   └── userModel.js     # define the architecture of the user model in mongodb database
├── views/
│   ├── create.ejs       # create shop product information page
│   ├── detail.ejs       # product detail page
│   ├── edit.ejs         # edit shop product page
│   ├── login.ejs        # login page
│   ├── overview.ejs     # shop product table
│   ├── register.ejs     # create account
│   ├── info.ejs         # after delect product page
│   └── delete.ejs       # delect product
├── public/
│   ├── background.jpg   # login and register page background
│   ├── line_kiritori_sen.png   # overview page using picture
│   ├── line_vegetable.png      # overview page using picture
│   └── background2.jpeg   # overview, add product, updtate page backage
├── server.js            # main application file(description below)
├── package.json         # Basic information about server.js
└── README.md            # project information document

   ##- server.js: Identified 8099 as the port, connected to mongodb, introduced the user and product models, set ejs as the view engine, use session to manage user sessions, provide user authentication, product management, provide RESTful API interface to add, delete, find and change products in this interface, can handle variety of error condition.


#The cloud-based server URL: https://s381project-grp14.onrender.com

#Operation guides:

   ##- the use of login/logout pages: It could use 'guest' id and 'guest' password to login, and simply click 'logout' button it could logout the page. If the user input invaild user name or password, the website will display a message "Invalid user name or password."

   ##- CRUD use: 'Add Product' button use to create new product information, 'Edit' button use to edit product information, 'Delete' button use to delete product, all database will show as a table in overview page.

   ##- API: 

	###- the lists of Authentication Routes: 
		- **`GET /login`**: Display login page
		- **`POST /login`**: verify user login information
		- **`GET /register`**: display registration page
		- **`POST /register`**: create new user
		- **`GET /logout`**: process user logout

	###- the list of Management Routes:
		- **`GET /create`**: display create product page
		- **`POST /create`**: create new product
		- **`GET /products`**: fetch and display all products 
		- **`GET /details`**: view details of a specific product
		- **`GET /edit`**: display edit product page
		- **`POST /update`**: update information of a specific product
		- **`GET /delete`**: delete a specific product

   ##- RESTful:

	###- RESTful API Routes:
		- `GET /api/product/category/:category`
		- `POST /api/product/:productid`
		- `GET /api/product/:productid`
		- `PUT /api/product/:productid`
		- `DELETE /api/product/:productid`


	###- HTTP request type: GET, POST, PUT and DELETE.

	###- CURL testing command: 
	      - create: curl -X POST -H "Content-type:application/json" --data'{"productId":"005","name":"apple","category":"fruit","quantity":"10","price":"5"}'localhost:8099/api/product/005
	      - find: curl -X GET http://localhost:8099/api/product/123
		  - find: curl -X GET http://localhost:8099/api/product/category/food
	      - update: curl -X PUT -H "Content-Type:application/json" --data'{"name":"cake","category":"food","quantity":"19","price":"10"}'localhost:8099/api/product/123
	      - delete: curl -X DELETE localhost:8099/api/product/002

   ##- Example Usage:
	1. **Register a user**
	   Nevigate to 'Create a new account' and provide user name and password.
	2. **Login**
	   Input your user name and password and nevigate to 'Login'.
	3. **View supermarket warehouse product database**
	   After login is a overview page, the table is the supermarket warehouse product data.
	4. **Create data**
	   Nevigate to 'Add Product' and input product information, then 'Create'.
	5. **Edit special data**
	   Nevigate to 'Edit' and input the data need to 'Update'.
	6. **Delete special data**
	   Negigate to 'Delete'.
	7. **Logout**
	   Nevigate to 'Logout'.

   ## Steps
	1. Install [Node.js] and [npm]
	2. **Start the server**: npm start
	3. **Using node**: node server.js
	4. **Get the website url**: Server running at http://localhost:8099/
	5. **Open the website in your browser**: http://localhost:8099/

