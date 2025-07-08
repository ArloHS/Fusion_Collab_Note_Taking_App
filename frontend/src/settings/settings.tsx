import { useState } from "react";
import "./settings.css";
import {
  HOME,
  getUserLocalStorage,
  logout,
  setUserLocalStorage,
} from "../utils";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  UpdateUserDocument,
  UpdateUserSecureDocument,
  DeleteUserDocument,
} from "../generated/graphql";
import { SideBar } from "../components/sideBar";

function Settings() {
  const [inputDelete, setInputDelete] = useState("");

  const sureDeleteNoteModal = document.getElementById(`sure-delete-modal`);

  const [showModal, setShowModal] = useState(false);

  const [inputCurrentPassword, setInputCurrentPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  const [inputCurrentEmail, setInputCurrentEmail] = useState("");
  const [inputNewEmail, setInputNewEmail] = useState("");
  const [inputConfirmEmail, setInputConfirmEmail] = useState("");
  const [inputCurrentPasswordEmail, setInputCurrentPasswordEmail] =
    useState("");

  const [inputCurrentUser, setInputCurrentUser] = useState("");
  const [inputNewUser, setInputNewUser] = useState("");
  const [inputConfirmUser, setInputConfirmUser] = useState("");

  const [inputCurrentName, setInputCurrentName] = useState("");
  const [inputNewName, setInputNewName] = useState("");
  const [inputConfirmName, setInputConfirmName] = useState("");

  const [inputCurrentSurname, setInputCurrentSurname] = useState("");
  const [inputNewSurname, setInputNewSurname] = useState("");
  const [inputConfirmSurname, setInputConfirmSurname] = useState("");

  const [updateSecure, updateSecureResponse] = useMutation(
    UpdateUserSecureDocument
  );

  const [deleteUser, deleteUserResponse] = useMutation(DeleteUserDocument);

  const [updateUser, updateUserResponse] = useMutation(UpdateUserDocument);

  const handleInputCurrentPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputCurrentPassword(e.target.value);
  };

  const handleInputNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewPassword(e.target.value);
  };

  const handleInputConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputConfirmPassword(e.target.value);
  };

  const handleInputCurrentEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCurrentEmail(e.target.value);
  };

  const handleInputNewEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewEmail(e.target.value);
  };

  const handleInputConfirmEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputConfirmEmail(e.target.value);
  };

  const handleInputCurrentEmailPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputCurrentPasswordEmail(e.target.value);
  };

  const handleInputCurrentUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCurrentUser(e.target.value);
  };

  const handleInputNewUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewUser(e.target.value);
  };

  const handleInputConfirmUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputConfirmUser(e.target.value);
  };

  const handleInputCurrentName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCurrentName(e.target.value);
  };

  const handleInputNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewName(e.target.value);
  };

  const handleInputConfirmName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputConfirmName(e.target.value);
  };

  const handleInputCurrentSurname = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputCurrentSurname(e.target.value);
  };

  const handleInputNewSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNewSurname(e.target.value);
  };

  const handleInputConfirmSurname = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputConfirmSurname(e.target.value);
  };

  const handleInputDelete = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDelete(e.target.value);
  };

  const handleDelete = () => {
    setRedLabelTextDelete("");
    setLabelTextDelete("");

    deleteUser({
      variables: {
        password: inputDelete,
      },
    })
      .then(() => {
        logout();
        window.location.href = "/";
      })
      .catch((e: Error) => setRedLabelTextDelete(e.message));
  };

  const handleChangePassword = () => {
    setRedLabelTextPass("");
    setLabelTextPass("");

    // validate password
    const pattern = /^[A-Za-z0-9!@#$%^&*()-_+=]{1,200}$/;

    // Call API, Change Password Validation
    if (inputNewPassword == inputConfirmPassword) {
      if (!pattern.test(inputNewPassword)) {
        setRedLabelTextPass("Invalid New Password");
      } else {
        updateSecure({
          variables: {
            originalPassword: inputCurrentPassword,
            password: inputNewPassword,
          },
        })
          .then(() => setLabelTextPass("Password Updated Successfully!"))
          .catch((e: Error) => setRedLabelTextPass(e.message));
      }
    } else {
      setRedLabelTextPass("New Passwords Don't Match.");
    }
    resetInputFieldsPassword();
  };
  const resetInputFieldsPassword = () => {
    setInputCurrentPassword("");
    setInputNewPassword("");
    setInputConfirmPassword("");
  };

  const handleChangeEmail = () => {
    setRedLabelTextEmail("");
    setLabelTextEmail("");

    setRedLabelTextEmail("");
    setLabelTextEmail("");
    // validate email
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Call API, Change Email Validation
    if (inputNewEmail == inputConfirmEmail) {
      if (!pattern.test(inputNewEmail)) {
        setRedLabelTextEmail("Invalid New Email");
      } else {
        updateSecure({
          variables: {
            email: inputNewEmail,
            originalPassword: inputCurrentPasswordEmail,
          },
        })
          .then(() => setLabelTextEmail("Email Updated Successfully!"))
          .catch((e: Error) => setRedLabelTextEmail(e.message));
      }
    } else {
      setRedLabelTextEmail("New Emails Don't Match.");
    }
    resetInputFieldsEmail();
  };
  const resetInputFieldsEmail = () => {
    setInputCurrentEmail("");
    setInputNewEmail("");
    setInputConfirmEmail("");
    setInputCurrentPasswordEmail("");
  };

  const handleChangeUser = () => {
    setRedLabelTextUser("");
    setLabelTextUser("");

    // validate Username
    const pattern = /^.{1,50}$/;

    // Call API, Change Username Validation
    if (inputNewUser == inputConfirmUser) {
      if (!pattern.test(inputNewUser)) {
        setRedLabelTextUser("Invalid New Username");
      } else {
        updateUser({
          variables: {
            username: inputNewUser,
          },
        })
          .then(() => setLabelTextUser("Username updated Successfully!"))
          .catch((e: Error) => setRedLabelTextUser(e.message));
      }
    } else {
      setRedLabelTextUser("New Usernames Don't Match.");
    }
    resetInputFieldsUser();
  };
  const resetInputFieldsUser = () => {
    setInputCurrentUser("");
    setInputNewUser("");
    setInputConfirmUser("");
  };

  const handleChangeName = () => {
    setRedLabelTextName("");
    setLabelTextName("");

    // validate Name
    const pattern = /^.{1,50}$/;

    // Call API, Change Name Validation
    if (inputNewName == inputConfirmName) {
      if (!pattern.test(inputNewName)) {
        setRedLabelTextName("Invalid New Name");
      } else {
        updateUser({
          variables: { firstName: inputNewName },
        })
          .then(() => {
            if (user?.firstName) {
              user.firstName = inputNewName;
              setUserLocalStorage(user);
            }
            setLabelTextName("First name updated Successfully!");
          })
          .catch((e: Error) => setRedLabelTextName(e.message));
      }
    } else {
      setRedLabelTextName("New Names Don't Match.");
    }
    resetInputFieldsName();
  };

  const resetInputFieldsName = () => {
    setInputCurrentName("");
    setInputNewName("");
    setInputConfirmName("");
  };

  const handleChangeSurname = () => {
    setRedLabelTextSur("");
    setLabelTextSur("");

    // validate Surname
    const pattern = /^.{1,50}$/;

    // Call API, Change Name Surname
    if (inputNewSurname == inputConfirmSurname) {
      if (!pattern.test(inputNewSurname)) {
        setRedLabelTextSur("Invalid New Surname");
      } else {
        updateUser({
          variables: { lastName: inputNewSurname },
        })
          .then(() => setLabelTextSur("Surname updated Successfully!"))
          .catch((e: Error) => setRedLabelTextSur(e.message));
      }
    } else {
      setRedLabelTextSur("New Surnames Don't Match.");
    }
    resetInputFieldsSurname();
  };

  const resetInputFieldsSurname = () => {
    setInputCurrentSurname("");
    setInputNewSurname("");
    setInputConfirmSurname("");
  };

  // SET USER NAME AND SURNAME FIELDS HERE FOR USER
  const user = getUserLocalStorage();
  const name = user?.firstName;
  const surname = user?.lastName;

  const [redLabelTextPass, setRedLabelTextPass] = useState("");
  const [labelTextPass, setLabelTextPass] = useState("");
  const [redLabelTextUser, setRedLabelTextUser] = useState("");
  const [labelTextUser, setLabelTextUser] = useState("");
  const [redLabelTextName, setRedLabelTextName] = useState("");
  const [labelTextName, setLabelTextName] = useState("");
  const [redLabelTextSur, setRedLabelTextSur] = useState("");
  const [labelTextSur, setLabelTextSur] = useState("");
  const [redLabelTextEmail, setRedLabelTextEmail] = useState("");
  const [labelTextEmail, setLabelTextEmail] = useState("");
  const [redLabelTextDelete, setRedLabelTextDelete] = useState("");
  const [labelTextDelete, setLabelTextDelete] = useState("");

  return (
    <div>
      {showModal && (
        <div
          id={`sure-delete-modal`}
          className="fixed z-50 inset-0 flex w-screen h-screen justify-center items-center backdrop-blur-lg"
        >
          <div className="flex flex-col justify-between bg-white h-128 w-modal max-w-4xl drop-shadow-2xl p-5">
            <p className="font-semibold text-2xl text-white -mx-5 -mt-5 py-4 bg-dark-blue">
              Delete Account
            </p>
            <div className="flex flex-col flex-grow justify-center items-center">
              {/* TODO actual note name */}
              <p className="text-dark-blue text-2xl mb-2">
                Are you sure you want to delete your account?
              </p>
              <label style={{ color: "red" }}>{redLabelTextDelete}</label>
              <label style={{ color: "grey" }}>{labelTextDelete}</label>
              <input
                type="text"
                placeholder="enter password to confirm deletion"
                className="bg-light-gray border-none mt-5 mb-8 py-3 text-dark-blue w-5/6"
                value={inputDelete}
                onChange={handleInputDelete}
              />
            </div>

            <div className="flex flex-row w-full justify-between">
              <button
                // id="close-new-note"
                onClick={() => setShowModal(!showModal)}
                className="bg-medium-gray text-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
              >
                don't delete
              </button>
              <button
                // id="create-new-note"
                onClick={() => handleDelete()}
                className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-red hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Panel*/}
      <SideBar />

      {/* Main Panel*/}
      <div className="text-white w-3/4 bg-white fixed top-0 left-1/4 ml-left h-screen overflow-y-scroll">
        <div className="mb-6 flex items-center mt-16">
          <div className="w-20 h-20 rounded-full overflow-hidden ml-16">
            <img
              src="/test.jpg"
              alt="User Avatar"
              className="w-full h-full text-dark-gray thicker-border border-dark-blue rounded-full"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-4xl font-semibold text-dark-blue ml-5">
              {name} {surname}
            </h2>
          </div>
          {/* Delete Account Button Nonsense*/}
          <button
            className="bg-medium-gray text-dark-gray py-3 px-6 rounded-none text-lg absolute top-20 right-20 mt-1 uppercase hover:bg-red hover:shadow-lg hover:text-white transition-all ease-in-out hover:scale-102 active:bg-light-blue"
            onClick={() => setShowModal(!showModal)}
          >
            Delete My Account
          </button>
        </div>

        {/* Password Change Form Stuff */}

        <div className="flex flex-col mt-32 ml-16">
          <h1 className="text-4xl font-bold mb-12 text-dark-blue text-left">
            Your Settings
          </h1>
          <form className="p-6 min-w-screen-sm max-w-screen-md bg-transparent">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              Update password
            </h3>
            <label style={{ color: "red" }}>{redLabelTextPass}</label>
            <label style={{ color: "grey" }}>{labelTextPass}</label>
            <div className="ml-3">
              <input
                type="password"
                placeholder="Current password"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentPassword}
                onChange={handleInputCurrentPassword}
                style={{ color: "gray" }}
              />
              <input
                type="password"
                placeholder="New password"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputNewPassword}
                onChange={handleInputNewPassword}
                style={{ color: "gray" }}
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputConfirmPassword}
                onChange={handleInputConfirmPassword}
                style={{ color: "gray" }}
              />
            </div>
            <div className="flex flex-row justify-end mt-5">
              <button
                className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue"
                type="button"
                onClick={handleChangePassword}
              >
                Update Password
              </button>
            </div>
          </form>

          <form className="p-6 min-w-screen-sm max-w-screen-md bg-transparent">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              Update username
            </h3>
            <label style={{ color: "red" }}>{redLabelTextUser}</label>
            <label style={{ color: "grey" }}>{labelTextUser}</label>
            <div className="ml-3">
              <input
                type="email"
                placeholder="Current username"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentUser}
                onChange={handleInputCurrentUser}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="New username"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputNewUser}
                onChange={handleInputNewUser}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="Confirm new username"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputConfirmUser}
                onChange={handleInputConfirmUser}
                style={{ color: "gray" }}
              />
            </div>
            <div className="flex flex-row justify-end mt-5">
              <button
                className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue"
                type="button"
                onClick={handleChangeUser}
              >
                Update username
              </button>
            </div>
          </form>

          <form className="p-6 min-w-screen-sm max-w-screen-md bg-transparent">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              Update email
            </h3>
            <label style={{ color: "red" }}>{redLabelTextEmail}</label>
            <label style={{ color: "grey" }}>{labelTextEmail}</label>
            <div className="ml-3">
              <input
                type="password"
                placeholder="Current password"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentPasswordEmail}
                onChange={handleInputCurrentEmailPassword}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="Current email"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentEmail}
                onChange={handleInputCurrentEmail}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="New email"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputNewEmail}
                onChange={handleInputNewEmail}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="Confirm new email"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputConfirmEmail}
                onChange={handleInputConfirmEmail}
                style={{ color: "gray" }}
              />
            </div>
            <div className="flex flex-row justify-end mt-5">
              <button
                className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue"
                type="button"
                onClick={handleChangeEmail}
              >
                Update email
              </button>
            </div>
          </form>

          <form className="p-6 min-w-screen-sm max-w-screen-md bg-transparent">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              Update name
            </h3>
            <label style={{ color: "red" }}>{redLabelTextName}</label>
            <label style={{ color: "grey" }}>{labelTextName}</label>
            <div className="ml-3">
              <input
                type="email"
                placeholder="Current name"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentName}
                onChange={handleInputCurrentName}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="New name"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputNewName}
                onChange={handleInputNewName}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="Confirm name"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputConfirmName}
                onChange={handleInputConfirmName}
                style={{ color: "gray" }}
              />
            </div>
            <div className="flex flex-row justify-end mt-5">
              <button
                className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue"
                type="button"
                onClick={handleChangeName}
              >
                Update name
              </button>
            </div>
          </form>

          <form className="p-6 min-w-screen-sm max-w-screen-md bg-transparent">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              Update surname
            </h3>
            <label style={{ color: "red" }}>{redLabelTextSur}</label>
            <label style={{ color: "grey" }}>{labelTextSur}</label>
            <div className="ml-3">
              <input
                type="email"
                placeholder="Current surname"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputCurrentSurname}
                onChange={handleInputCurrentSurname}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="New surname"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputNewSurname}
                onChange={handleInputNewSurname}
                style={{ color: "gray" }}
              />
              <input
                type="email"
                placeholder="Confirm surname"
                className="bg-light-gray border-none my-2 py-3 text-lg w-full"
                value={inputConfirmSurname}
                onChange={handleInputConfirmSurname}
                style={{ color: "gray" }}
              />
            </div>
            <div className="flex flex-row justify-end mt-5">
              <button
                className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue"
                type="button"
                onClick={handleChangeSurname}
              >
                Update surname
              </button>
            </div>
          </form>

          {/* Change Avatar Nonsense */}
          <div className="p-6 min-w-screen-sm max-w-screen-md">
            <h3 className="text-dark-blue text-xl font-semibold mb-4 text-left">
              User avatar
            </h3>
            <div className="flex flex-row items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden ml-3 mr-5">
                <img
                  src="/test.jpg"
                  alt="User Avatar"
                  className="w-full h-full text-dark-gray thicker-border border-light-blue rounded-full"
                />
              </div>
              <button className="bg-light-blue border-none rounded-none uppercase text-md px-5 py-2 ml-5 hover:bg-dark-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue">
                Pick New Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
function setloggedIn(arg0: boolean): any {
  throw new Error("Function not implemented.");
}
