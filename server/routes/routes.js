const Controller = require("../controllers/toDoController.js");
const UserController = require("../controllers/userController");
const { auth } = require("../middleware/middleware.js");

module.exports = (app) => {
  app.post("/register", UserController.register);
  app.post("/login", UserController.login);
  app.get("/authCheck", auth, UserController.authCheck);
  app.post("/logout", auth, UserController.logout);
  app.put("/edit/:id", auth, Controller.editTodo);
  app.post("/create", auth, Controller.createTodo);
  app.get("/gettodos", auth, Controller.getTodo);
  app.delete("/delete/:id", auth, Controller.deleteTodo);
};
