import { useEffect, useState } from "react";
import "./register.css";
import { gql, useMutation } from "@apollo/client";
import {
  HOME,
  isAuth,
  setTokenLocalStorage,
  setUserLocalStorage,
} from "../utils";
import { SignupDocument, User } from "../generated/graphql";

function Register() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);//@ JOSH
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setRedLabelText("Invalid File, must be .jpg or .png.");
    }
    console.log(file)
  };
  // JOSH
  // const handleFileUpload = () => {
  //   if (selectedFile) {
  //     uploadFile({
  //       variables: { file: selectedFile },
  //     }).then(response => {
  //       // Handle the response from the server, e.g., show a success message or update UI.
  //     }).catch(error => {
  //       // Handle any errors that occur during the upload.
  //     });
  //   }
  // };

  const [inputName, setInputName] = useState("");
  const [inputSurname, setInputSurname] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputCheckPassword, setInputCheckPassword] = useState("");
  const [loggedIn, setloggedIn] = useState(isAuth());

  const [registerUser, { data, loading, error }] = useMutation(SignupDocument);
  //   //Need to handle image upload here, TODO

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };
  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSurname(e.target.value);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  const handleCheckPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputCheckPassword(e.target.value);
  };

  // gets the username, email, password, checkPassword fields and stores them in variables, can be accessed like i did below here.
  // Just need to do actual validation here
  // TODO PROFILE PHOTO
  const handleRegistration = () => {
    var register = true;
    setRedLabelText("");
    setLabelText("");

    const pattern = /^[A-Za-z0-9!@#$%^&*()-_+=]{1,50}$/;
    const pattern2 = /^[A-Za-z0-9!@#$%^&*()-_+=]{1,200}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    //Data Validation
    if (!pattern.test(inputName)) {
      register = false;
      setRedLabelText("Invalid Name");
    }
    if (!pattern.test(inputSurname)) {
      register = false;
      setRedLabelText("Invalid Surname");
    }
    if (!pattern.test(inputUsername)) {
      register = false;
      setRedLabelText("Invalid Username");
    }
    if (!emailRegex.test(inputEmail)) {
      register = false;
      setRedLabelText("Invalid Email");
    }
    if (!pattern2.test(inputPassword)) {
      register = false;
      setRedLabelText("Invalid Password");
    }
    if (inputCheckPassword != inputPassword) {
      register = false;
      setRedLabelText("Passwords Don't Match");
    }

    if (register == true) {
      registerUser({
        variables: {
          username: inputUsername,
          email: inputEmail,
          password: inputPassword,
          firstName: inputName,
          lastName: inputSurname,
        },
      })
        .then((response): void => {
          if (response.data?.signup?.token) {
            setTokenLocalStorage(response.data.signup.token);
            setUserLocalStorage(response.data.signup.user!);
            setloggedIn(true);
          }
          setLabelText("Registered Succesfully!");
        })
        .catch((e: Error) =>
          setRedLabelText(e.message + ", Username or Email may Already exist")
        );
    }
    resetInputFields();
  };

  const resetInputFields = () => {
    setInputName("");
    setInputSurname("");
    setInputUsername("");
    setInputEmail("");
    setInputPassword("");
    setInputCheckPassword("");
  };

  const [redLabelText, setRedLabelText] = useState("");
  const [labelText, setLabelText] = useState("");

  useEffect(() => {
    loggedIn && (window.location.href = HOME);
  }, [loggedIn]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-t from-dark-blue to-light-blue">
        <div className="flex flex-col justify-evenly content-center items-center register-container">
          <div className="welcome-screen-logo-container self-center">
            <img src="./fusion-logo.png" alt="Fusion Logo" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-6 text-dark-blue">
            Create Account
          </h1>
          <label style={{ color: "red" }}>{redLabelText}</label>
          <label style={{ color: "grey" }}>{labelText}</label>

          <form action="" className="flex flex-col w-9/12 mb-10">
            <input
              type="text"
              placeholder="name"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputName}
              onChange={handleNameChange}
            />
            <input
              type="text"
              placeholder="surname"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputSurname}
              onChange={handleSurnameChange}
            />
            <input
              type="text"
              placeholder="username"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputUsername}
              onChange={handleUsernameChange}
            />
            <input
              type="email"
              placeholder="email"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputEmail}
              onChange={handleEmailChange}
            />
            <input
              type="password"
              placeholder="password"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputPassword}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              placeholder="confirm password"
              className="bg-light-gray border-none my-2 py-3 text-dark-blue"
              value={inputCheckPassword}
              onChange={handleCheckPasswordChange}
            />
            <label className="bg-light-gray border-none my-2 py-3 flex justify-between items-center cursor-pointer">
              <span className="text-dark-gray pl-3">upload profile photo</span>
              <span className="text-dark-gray pr-3">
                {selectedFile ? selectedFile.name : 'Select a file'}
              </span>
              <input
                type="file"
                className="opacity-0 absolute cursor-pointer"
                accept="image/*"
                // value={selectedFile}
                onChange={handleFileChange}
              />
            </label>

            <div className="flex flex-row justify-center mt-5 mb-4">
              <button
                id="register-button"
                className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
                onClick={handleRegistration}
              >
                register
              </button>
            </div>
            <label htmlFor="register-button" className="text-sm text-dark-gray">
              you will be logged in automatically
            </label>
          </form>
        </div>
      </div>
    </>
  );
}
export default Register;
