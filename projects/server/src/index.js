const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const {errorHandler} = require("./middleware/error.handler.js");
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app = express();

app.use(
  cors({
    origin: [
     process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(" "),
    ],
    exposedHeaders : "Authorization"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});


const AuthRouters = require("./controllers/authentication/routers.js")
const CatRouters = require("./controllers/category/routers.js")
const ProductsRouters = require("./controllers/products/routers.js")
const AddressRouters = require("./controllers/address/routers.js")
const DiscountRouters = require("./controllers/discount/routers.js")
const RecipeRouters = require("./controllers/upload-recipe/routers.js")
const CartRouters = require("./controllers/cart/routers.js")
const TransactionRouters = require("./controllers/transaction/routers.js")

app.use("/api/auth", AuthRouters)
app.use("/api/category",CatRouters)
app.use("/api/products", ProductsRouters)
app.use("/api/address", AddressRouters)
app.use("/api/discount", DiscountRouters)
app.use("/api/upload-recipe", RecipeRouters)
app.use("/api/cart", CartRouters)
app.use("/api/transaction",TransactionRouters)
app.use(errorHandler)

// ===========================

// not found
// app.use((req, res, next) => {
//   if (req.path.includes("/api/")) {
//     res.status(404).send("Not found !");
//   } else {
//     next();
//   }
// });

// error
// app.use((err, req, res, next) => {
//   if (req.path.includes("/api/")) {
//     console.error("Error : ", err.stack);
//     res.status(500).send("Error !");
//   } else {
//     next();
//   }
// });

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
