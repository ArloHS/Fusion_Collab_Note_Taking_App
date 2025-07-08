import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useQuery } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Our Screens Added
import Login from "./login/login.jsx";
import Register from "./register/register.jsx";
import Home from "./home/home.jsx";
import Editor from "./editor/editor.jsx";
import Settings from "./settings/settings";

// const GET_GREETING = gql(`
//   query hello {
//     getHello
//   }
// `);

function App() {
  // const { loading, data } = useQuery(GET_GREETING);
  // return (
  //   <div className="App">
  //     {loading && <p>Loading ...</p>}
  //     {data && (
  //       <h1 className="text-3xl font-bold underline">{data.getHello}</h1>
  //     )}
  //   </div>
  // );
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:noteId/editor" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
