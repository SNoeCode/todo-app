import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Create from "../Create/Create";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";

import "./Home.css";
/// U MIGHT HAVE TO CLEAR THE SITE DATA IN THE APPLICATION, BECAUSE EVERTIME I CLOSE THE BROWESER WITHOUT LOGIN OUT PROPERLY I HAVE TO CLEAR DATA
const Home = () => {
  // state for todos and editing
  const [todo, setTodo] = useState([]);

  const [isUpdating, setIsUpdating] = useState(false);

  const [updated, setUpdated] = useState("");

  const [editingId, setEditingId] = useState(null);
  // get authed info from context and local storage
  const username = localStorage.getItem("username");
  const isUserSignedIn = !!localStorage.getItem("token");
  const { authedUser, setAuthedUser } = useContext(UserContext);
  //syncs local storage and contxt
  useEffect(() => {
    setAuthedUser(authedUser);
  }, [authedUser, setAuthedUser]);
  //fetching users todos from backend
  const fetchTodos = () => {
    axios
      .get("http://localhost:5001/gettodos", { withCredentials: true })
      .then((response) => {
        console.log("Fetched Todos:", response.data);
        // {why use Array.arrayvents errors if todo isnt array, ex "", so it dosent retunr empty array, makes cide nore reslient to form changes }
        if (Array.isArray(response.data)) {
          console.log(console.log("fetched", response.data))
          //sorts todos by date created
          const sortedTodos = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          //sets the todos to sorted todos
          setTodo(sortedTodos);
        } else {
          console.error("Unexpected response structure:", response.data);
          setTodo([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        setTodo([]);
      });
  };

  
  //loads todos when component mounts(loads) or when authed user changes
  useEffect(() => {
    if (isUserSignedIn) {
      fetchTodos();
    }
  }, [isUserSignedIn]);
  //console.log todos state for debugging
  useEffect(() => {
    console.log("Current todos state:", todo);
  }, [todo]);
  //refreshes todo list after created dto instantly see todos
  //inverse data flow
  const handleCreate = (input) => {
    console.log("input", input)
    fetchTodos();

  };
  //used for debugging
  useEffect(() => {
    console.log("Updated todos state:", todo);
  }, []);
  //start editing todo
  const handleUpdate = (id, currentTodo) => {
    setIsUpdating(true);
    // EditedAt: new Date().toISOString(),
     setUpdated(currentTodo);
   // setUpdated("");
    setEditingId(id);
  };
  //saved edited todo to backedn
  const saveUpdatedEdit = (id) => {
    axios
      .put(
        `http://localhost:5001/edit/${id}`,
        { todo: updated, EditedAt: new Date().toISOString() },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("res", response);

        if (response.status === 200) {
          console.log("Todo updated successfully:", response.data);
          //updates local storafe with edited todo
          setTodo((prevTodos) =>
            prevTodos.map((item) =>
              item._id === id ? { ...response.data, EditedAt: new Date().toISOString() 
              } : item
            )
          );
          setIsUpdating(false);
          setEditingId(null);
          //clears the inputs
          setUpdated("");
        } else {
          console.log("Error updating todo:", err);
        }
      })
      .catch((err) => console.log("err", err));
  };
  //toggles to do completion status and done status
  const handleToggle = (id) => {
    const currentTodo = todo.find((item) => item._id === id);
    if (!currentTodo) return;
    axios
      .put(
        `http://localhost:5001/edit/${id}`,
        {
          completed: !currentTodo.completed,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("res", response);
        if (response.status === 200) {
          //updates local state with new completed stauts
          setTodo((prevTodos) =>
            prevTodos.map((item) =>
              item._id === id ? { ...item, done: !item.done } : item
            )
          );
        }
      })
      .catch((error) => console.log("error", error));
  };
  //deletes toso
  const handleDelete = (id) => {
    console.log("Attempting to delete todo with ID:", id);
    axios
      .delete(`http://localhost:5001/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Test delete response:", response);
        //removes from local storafe
        setTodo((prevTodos) => prevTodos.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.log("Test delete error:", err);
      });
  };

  return (
    <>
      {/* User greeting */}
      {isUserSignedIn && username ? (
        <h2>Welcome, {username}</h2>
      ) : (
        <div>No username found</div>
      )}
      <div className="main">TO DO LIST</div>
      <Create onCreate={handleCreate} />
      {/* Todo list display */}
      <br />
      {console.log("Rendering todos:", todo)}
      {console.log("Is todo an array:", Array.isArray(todo))}

      {Array.isArray(todo) && todo.length > 0 ? (
        todo.map((item) => (
          <div key={item._id} className="container-todo">
            <h1 className="task-header">Task</h1>
            <br />
            <div className="toggle-container">
              <br />
              <p
                id="todo-task"
                className={item.done ? "mark-through" : ""}
                onClick={() => handleToggle(item._id)}
                style={{
                  textDecoration: item.done ? "line-through" : "none",
                  color: item.done ? "green" : "black",
                  flex: "1",
                }}
              >
                <div className="createdAt">
                  Time Created: {new Date(item.createdAt).toLocaleString()}
                </div>
                {item.todo}
              </p>
              <div className="task-complete"></div>
              <div className="span-text">
                <span className="span-check"> Mark Complete</span>
              </div>
              <button
                className="btn-toggle"
                onClick={() => handleToggle(item._id)}
              >
                {item.done ? "✔" : ""}
              </button>
            </div>
            {editingId === item._id ? (
              <div className="updated-container">
                <input
                  placeholder="Update text...."
                  className="update-input"
                  type="text"
                  value={updated}
                  onChange={(e) => setUpdated(e.target.value)}
                />
                <button
                  className="save-btn"
                  onClick={() => saveUpdatedEdit(item._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="btn-edit-icon"
                onClick={() => handleUpdate(item._id, item.todo)}
              >
                <RiEdit2Line className="icon" />
                Edit
              </button>
            )}
            <button
              className="btn-delete"
              onClick={() => handleDelete(item._id)}
            >
              <RiDeleteBin5Line className="icon" />
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No todos available</p>
      )}
    </>
  );
};

export default Home;
