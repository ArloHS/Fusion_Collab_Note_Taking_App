import { useEffect, useState } from "react";
import "./home.css";
import { HOME, getUserLocalStorage, isAuth, logout } from "../utils";
import {
  Category,
  CreateNoteDocument,
  DeleteNoteDocument,
  GetUserNotesDocument,
  Note,
} from "../generated/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { NoteBar } from "./noteBar";
import { NoteCategory } from "../components/noteCategory";
import { FilterByCategory } from "./filterByCategory";
import { SideBar } from "../components/sideBar";

function Home() {
  const categoriesList = [] as Category[];

  const [isLastTimeEditedSelected, setIsLastTimeEditedSelected] =
    useState(true);
  const [userNotes, setUserNotes] = useState([] as Note[]);
  const [createNoteMutation] = useMutation(CreateNoteDocument);

  const userNotesQuery = useQuery(GetUserNotesDocument);

  const [deleteNoteMutation] = useMutation(DeleteNoteDocument);

  // use fields like this:
  // createNoteMutationFields.data

  const openNoteModal = document.getElementById("open-new-note");
  const closeNoteModal = document.getElementById("close-new-note");
  const newNoteModal = document.getElementById("new-note-modal");

  const sureDeleteNoteModal = document.getElementById("sure-delete-modal");

  let notebarElements;
  const user = getUserLocalStorage();

  // if (user === undefined) window.location.href = "/";

  useEffect(() => {
    !isAuth() && (window.location.href = "/");
  }, []);

  useEffect(() => {
    if (
      !userNotesQuery.loading &&
      userNotesQuery.error == undefined &&
      userNotesQuery.data?.getUserNotes != undefined &&
      userNotesQuery.data?.getUserNotes != null
    )
      setUserNotes(userNotesQuery.data.getUserNotes as Note[]);
  }, [userNotesQuery.data]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <>
      <div>
        {showModal && (
          <div
            id="new-note-modal"
            className="absolute z-50 inset-0 flex w-screen h-screen justify-center items-center backdrop-blur-lg"
          >
            <div className="flex flex-col justify-between bg-white h-128 w-modal max-w-4xl drop-shadow-2xl p-5">
              <p className="font-semibold text-2xl text-white -mx-5 -mt-5 py-4 bg-dark-blue">
                New Note
              </p>
              <div className="flex flex-col flex-grow justify-start">
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="note title"
                  className="bg-light-gray border-none mt-5 mb-8 py-3 text-dark-blue"
                />

                <NoteCategory updateSelected={() => {}} />
              </div>

              <div className="flex flex-row w-full justify-between">
                <button
                  id="close-new-note"
                  onClick={() => setShowModal(!showModal)}
                  className="bg-medium-gray text-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                  type="button"
                >
                  cancel
                </button>
                <button
                  id="create-new-note"
                  onClick={() => {
                    createNoteMutation({ variables: { title } }).then(
                      (response) => {
                        if (response.data?.createNote !== undefined) {
                          const notesList = [...userNotes];
                          notesList.push(response.data.createNote as Note);
                          setUserNotes(notesList);
                        }
                      }
                    );
                    setShowModal(!showModal);
                  }}
                  className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                  type="button"
                >
                  create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Side Panel*/}
        <SideBar />

        {/* Main Panel*/}
        <div className="flex flex-col items-center text-white w-3/4 bg-white fixed top-0 left-1/4 ml-left h-screen px-10 pt-10">
          <div className="flex flex-row-reverse items-center justify-between w-full">
            <div className="">
              <button
                id="open-new-note"
                className="bg-light-blue border-none rounded-none uppercase font-medium hover:bg-dark-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-light-blue text-md px-14 py-4"
                onClick={() => setShowModal(!showModal)}
              >
                Create Note
              </button>
            </div>
            {/* Search By Input*/}
            <div className="flex flex-row">
              <input
                className="border-2 border-dark-blue bg-light-gray rounded-none px-3 py-3 w-96 focus:outline-none text-dark-blue"
                type="text"
                placeholder="search by file name"
              />
              <button className="-ml-10 my-2 border-none bg-light-gray p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M21.1592 18.0701L19.2229 16.1313C18.8153 15.7231 18.2038 15.7231 17.7962 16.1313C17.3885 16.5394 17.3885 17.1517 17.7962 17.5599L19.7325 19.4986C20.0382 19.8048 20.0382 20.315 19.7325 20.6211C19.4268 20.9272 18.9172 20.9272 18.6115 20.6211L15.5541 17.5599C15.758 17.3558 15.9618 17.2537 16.1656 17.0496C17.6943 15.519 18.6115 13.3762 18.6115 11.2333C18.6115 8.98843 17.7962 6.94761 16.1656 5.417C12.9045 2.15169 7.70701 2.15169 4.44586 5.417C1.18471 8.6823 1.18471 13.8864 4.44586 17.1517C5.97452 18.6823 8.11465 19.6007 10.2548 19.6007C11.4777 19.6007 12.7006 19.2945 13.7197 18.7843L17.0828 22.1517C17.5924 22.6619 18.4076 22.968 19.121 22.968C19.8344 22.968 20.5478 22.6619 21.1592 22.1517C22.2803 20.9272 22.2803 19.0905 21.1592 18.0701ZM5.87261 15.519C3.42675 13.0701 3.42675 9.09047 5.87261 6.74353C7.09554 5.51904 8.6242 4.90679 10.2548 4.90679C11.8854 4.90679 13.414 5.51904 14.6369 6.74353C15.8599 7.96802 16.4713 9.49863 16.4713 11.1313C16.4713 12.7639 15.8599 14.3966 14.6369 15.519C13.414 16.6415 11.8854 17.3558 10.2548 17.3558C8.6242 17.3558 6.99363 16.7435 5.87261 15.519Z"
                    fill="#001756"
                  />
                </svg>
              </button>
              {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fas fa-hourglass-start text-gray-500"></i>
            </div> */}
            </div>
          </div>
          {/* Div for both Sort By and Filter Stuff*/}
          <div className="flex flex-row justify-between items-start mt-16 mb-6 text-left w-11/12">
            <div className="text-left mr-10">
              <p className="font-medium text-dark-blue text-lg h-12">Sort By</p>
              {/* Div for Sort By Buttons */}
              <div className="flex flex-col">
                <button
                  className={`w-48 h-10 rounded-full mb-2 focus:outline-none
                  ${
                    isLastTimeEditedSelected
                      ? "bg-dark-blue text-white"
                      : "bg-light-gray text-dark-blue"
                  }`}
                  onClick={() => setIsLastTimeEditedSelected(true)}
                >
                  Last Time Edited
                </button>

                <button
                  className={`w-48 h-10 rounded-full focus:outline-none
                  ${
                    isLastTimeEditedSelected
                      ? "bg-light-gray text-dark-blue"
                      : "bg-dark-blue text-white"
                  }`}
                  onClick={() => setIsLastTimeEditedSelected(false)}
                >
                  Name
                </button>
              </div>
            </div>
            {/* Div for categories */}
            <FilterByCategory categories={categoriesList} />
          </div>

          {/* Massive grey div area for displaying form and other stuff */}
          <div className="w-full h-128 pt-4 pb-10">
            <div className="h-full mx-auto w-11/12 px-4 py-4 relative bg-light-gray rounded-3xl overflow-auto">
              <div className="flex flex-col">
                {/* actual note bar with all information - must be dynamically created */}

                {/* for testing purposes - need to be created dynamically */}
                {userNotesQuery.data &&
                  [...userNotes]
                    .sort((n1: Note, n2: Note) =>
                      isLastTimeEditedSelected
                        ? parseInt(n2.lastUpdated) - parseInt(n1.lastUpdated)
                        : n1.title.localeCompare(n2.title)
                    )
                    .map((note: Note) => {
                      return (
                        <NoteBar
                          user={user!}
                          note={note as Note}
                          deleteNote={(noteId: string) => {
                            deleteNoteMutation({ variables: { noteId } });
                            setUserNotes(
                              userNotes.filter(({ id }) => noteId != id)
                            );
                          }}
                          key={note.id}
                        />
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
