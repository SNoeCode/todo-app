
import React, { useState } from "react";
import axios from "axios";

const Create = ({ onCreate }) => {
  //track new to 
  const [newTodo, setNewTodo] = useState("");

  const handleChange = (e) => {
    setNewTodo(e.target.value);
  };
//sends to backend to create 
  const handleSubmit = async (e) => {
    e.preventDefault();//prevents page relaod
    //dont allow empty todos
    if (newTodo.trim() === "") {
      console.warn("Todo cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5001/create",
        { todo: newTodo,
          //converts the value of  createdAt key to "date" to readable date  and adds it to a tiem stamp 
          createdAt: new Date().toISOString() 
         },
         //include cookie for auth
        { withCredentials: true }
      );
      console.log("Create Hit", response.data);
      //if created succeffully
      //notifiy parent "Home" to refresh list 
      onCreate(newTodo);
      if (response.status === 200) {
        console.log("Todo created successfully:", response.data);
        setNewTodo("");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <div className="create-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={handleChange}
          placeholder="Add a new todo"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default Create;