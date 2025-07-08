import { useEffect, useState } from "react";

import "./login.css";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import {
  HOME,
  isAuth,
  setTokenLocalStorage,
  setUserLocalStorage,
} from "../utils";
import { CreateTokenDocument } from "../generated/graphql";

function Login() {
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setloggedIn] = useState(isAuth());

  const [loginUser, { data, loading, error }] =
    useMutation(CreateTokenDocument);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  // gets the username and password fields and stores them in variables, can be accessed like i did below here.
  // Just need to do actual validation here
  const handleLogin = () => {
    try {
      loginUser({
        variables: {
          emailOrUsername: inputName,
          password: inputPassword,
          remember: rememberMe,
        },
      })
        .then((result) => {
          if (result.data?.createToken?.token) {
            setTokenLocalStorage(result.data.createToken.token);
            setUserLocalStorage(result.data.createToken.user!);
            console.log("Signed in");
            setloggedIn(true);
          } else {
            console.log("Invalid login credentials");
          }
        })
        .catch((error) => {
          console.error("An error occurred during login: ", error);
          promptUser();
        });
      resetInputFields();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const resetInputFields = () => {
    setInputName("");
    setInputPassword("");
  };

  const [labelText, setLabelText] = useState("");
  const promptUser = () => {
    setLabelText("Invalid username/password");
  };

  useEffect(() => {
    loggedIn && (window.location.href = HOME);
  }, [loggedIn]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-t from-dark-blue to-light-blue">
        <div className="flex flex-col justify-evenly content-center items-center login-container">
          <div className="welcome-screen-logo-container self-center">
            <img src="./fusion-logo.png" alt="Fusion Logo" />
          </div>
          <label style={{ color: "red" }} onChange={promptUser}>
            {labelText}
          </label>
          <form action="" className="flex flex-col w-9/12 mb-10">
            <input
              type="text"
              placeholder="username"
              className="bg-light-gray border-none mt-5 mb-2 py-3 text-dark-blue"
              value={inputName}
              onChange={handleNameChange}
              
              ref={(input) => {
                if (input && labelText) {
                  input.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
                }
              }}
            />
            <input
              id="password-input"
              type="password"
              placeholder="password"
              className="bg-light-gray border-none mt-2 mb-5 py-3 text-dark-blue"
              value={inputPassword}
              onChange={handlePasswordChange}
              ref={(input) => {
                if (input && labelText) {
                  input.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
                }
              }}
            />

            <div className="mb-8">
              <input
                type="checkbox"
                className="border-2 border-dark-gray"
                id="remember-me-box"
                value={rememberMe ? "true" : ""}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me-box" className="text-dark-gray ml-4">
                remember me
              </label>
            </div>

            <div className="flex flex-row justify-center">
              <button
                className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
                onClick={handleLogin}
              >
                login
              </button>
              <button className="rounded-none border-2 bg-light-gray w-40 h-10 mx-3 text-dark-gray uppercase font-medium hover:bg-light-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue">
                <Link to="/register">register</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
