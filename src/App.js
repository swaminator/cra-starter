import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";


import Amplify from "@aws-amplify/core";
import { DataStore } from "@aws-amplify/datastore";

import { Todo } from "./models";
import awsConfig from "./aws-exports";
Amplify.configure(awsConfig);

function onCreate() {
  DataStore.save(
    new Todo({
      description: `Test todo ${Math.random().toString(36).substring(2, 5)}`
    })
  );
}

function App() {
  const [todos, setTodos] = useState ([]);

  async function getTodos() {
    const alltodos = await DataStore.query(Todo)
    setTodos(alltodos)
  }

  useEffect(() => { 
    getTodos()
    const subscription = DataStore.observe(Todo).subscribe(() => getTodos())
    return () => subscription.unsubscribe()
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <div>
        <input type="button" value="NEW - SKIP BACKEND" onClick={() => { onCreate(); getTodos(setTodos)} } />
      </div>
      <table border="1">
        <thead>
          <tr><td>Id</td><td>Desc</td></tr>
        </thead>
        <tbody>
          {todos.map( (item,i) => {
            return <tr key={i}><td>{todos[i].id.substring(0,8)}...</td><td>{todos[i].description}</td></tr>
          } )}
        </tbody>
      </table>
      </header>
    </div>
  );
}

export default App;
