const ToDo = require("../models/toDoModel");

module.exports = {
  getTodo: (req, res) => {
    console.log("GetToDos HIT");
// mskes the userId variable to spefic what user to is created for
    const userId = req.user.id;
// finds user and todos assiocated with that user
    ToDo.find({ userId: userId })
   
      .then((todos) => {
        res.json(todos);
        console.log("todos", todos);
      })
      //catch errors
      .catch((err) => {
        console.error("Error fetching todos:", err);
        res.status(500).json({ msg: "Server error" });
      });
  },
  createTodo: (req, res) => {
    console.log("Create Hit", req.body);
//or you can also create a new to do with this format
//  ToDo.create().then(created=>{
 // console.log("created", created) res.json(created)})


//dynamically pulls in request
    const newTodo = new ToDo({
      ...req.body,
      userId: req.user.id,
    });
//saves the new todo
    newTodo
      .save()
      .then((todo) => {
        //sends data back
        res.json(todo).status(200);
      })
      .catch((err) => {
        console.error("Error creating todo:", err);
        res.status(500).json({ msg: "Server error" });
      });
  },
  //deletes todo
  deleteTodo: (req, res) => {
    {
      //shows todo deleted
      console.log("Delete HIT", req.params);
      console.log("Authenticated User:", req.user);
      //gets id and deletes
      ToDo.findByIdAndDelete(req.params.id)
        .then((deleted) => {
          console.log("deleted", deleted);
          res.json(deleted);
        })
        .catch((err) => {
          console.error("Error deleting todo:", err);
          res.status(500).json({ msg: "Internal server error" });
        });
    }
  },
//edits todos
  editTodo: (req, res) => {
    console.log("Edit Hit", req.params.id, req.body);
    //updates todo, wether its true and completed
    ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true, completed: false }).then(
      (updated) => {
        console.log("updatead", updated);
        res.json(updated);
      }
    );
  },
};
