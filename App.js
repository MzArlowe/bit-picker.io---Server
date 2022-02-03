require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");
const controllers = require("./controllers/indexController");

app.use(require("./middleware/headers"));
// app.use(cors());
app.use(Express.json());
app.use("/build", controllers.buildController);
app.use("/user", controllers.userController);
app.use("/parts", controllers.partsController);
// app.use("/cpu", controllers.cpuController);

dbConnection.authenticate()
// .then(() => dbConnection.sync({force: true}))
.then(() => dbConnection.sync({/*force: true*/}))

.then(() => {
  // console.log(process.env.NODE_ENV)
  app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
  });
})
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}.`);
  });