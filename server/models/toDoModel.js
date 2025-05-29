const mongoose = require("mongoose");
//I added the userId so that each user could load there specific todos also gives the ability to logout
const Schema = mongoose.Schema;
const ToDoSchema = new Schema({
  todo: { type: String, required: true },
  //showed when created, time
  created: { type: Number },
  createdAt: { type: Date, default: Date.now },
  //still working on the edited
  editedAt: {type: Date, default: Date.now },
  //if to do is completed
  completed: {
    type: Boolean,
    default: false,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  new: {
    type: Boolean,
    default: true
  }
});
const ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = ToDo;
