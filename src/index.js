require("./database/mongoose.js");
const path = require("path");
const express = require("express");
const expressHBS = require("express-handlebars");
const fileUpload = require("express-fileupload");
const sessions = require("express-session");

const customerRouter = require("./routers/customer-router.js");
const adminRouter = require("./routers/admin-router.js");
const productRouter = require("./routers/product-router.js");
const categoryRouter = require("./routers/category-router.js");
const orderRouter = require("./routers/order-router.js");

const app = express();
const PORT = process.env.PORT;

const staticsFilesDir = path.join(__dirname, "../public");
app.use(express.static(staticsFilesDir));

app.engine("hbs",expressHBS.engine({
    layoutsDir: path.join(__dirname, "../views/layout"),
    defaultLayout: "main",
    extname: ".hbs"
}))
app.set("view engine", "hbs");

app.use(fileUpload());
app.use(sessions({secret: process.env.SECRET, saveUninitialized: true, resave: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(customerRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);

app.listen(PORT, () =>{
    
});