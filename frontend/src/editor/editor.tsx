import React, { useEffect, useState } from "react";
import "./editor.css";
import { Link } from "react-router-dom";
import * as marked from "marked";
import { NoteCategory } from "../components/noteCategory";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  Category,
  GetNoteDocument,
  NoteUpdatedDocument,
  CreateNoteDocument,
  User,
  UpdateNoteDocument,
  GetUserNotesDocument,
} from "../generated/graphql";
import { useParams } from "react-router-dom";
import { HOME } from "../utils";

function Editor() {
  const [showModal, setShowModal] = useState(false);

  const { noteId } = useParams();

  if (noteId == undefined) {
    window.location.href = HOME;
  }
  const categoriesList = [] as Category[];

  const [markdownValue, setMarkdownValue] = useState("");
  const [title, setTitle] = useState("");
  const [colaborators, setColaborators] = useState([] as User[]);

  const userNotesQuery = useQuery(GetUserNotesDocument);

  // const noteQuery = useQuery(GetNoteDocument, {
  //   variables: { noteId: noteId! },
  //   onCompleted: (response) => {
  //     if (response.getNote?.content) setMarkdownValue(response.getNote.content);
  //     if (response.getNote?.title) setTitle(response.getNote.title);
  //   },
  // });

  const noteSubscription = useSubscription(NoteUpdatedDocument, {
    variables: { noteId: noteId! },
    onData: (response) => {
      if (response.data.data?.noteUpdated.content)
        setMarkdownValue(response.data.data.noteUpdated.content);
      if (response.data.data?.noteUpdated.title)
        setTitle(response.data.data?.noteUpdated.title!);
    },
  });

  const [noteUpdateMutation] = useMutation(UpdateNoteDocument);

  const f = () => {
    const preview = document.getElementById("preview");
    if (preview) {
      preview.innerHTML = update(markdownValue);
    }
  };

  useEffect(f, [markdownValue]);

  useEffect(() => {
    if (
      !userNotesQuery.loading &&
      userNotesQuery.error == undefined &&
      userNotesQuery.data?.getUserNotes != undefined &&
      userNotesQuery.data?.getUserNotes != null
    )
      for (const note of userNotesQuery.data.getUserNotes) {
        if (note.id === noteId) {
          setTitle(note.title);
          setMarkdownValue(note.content);
        }
      }
  }, [userNotesQuery.data]);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownValue(e.target.value);
    noteUpdateMutation({
      variables: { noteId: noteId!, title: title, content: e.target.value },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownValue(e.target.value);
    console.log(markdownValue);
  };

  function update(markdownText: string) {
    return marked.parse(markdownText);
  }

  const Title = title;
  console.log("HEERE" + "  " + Title);

  return (
    <div>
      {showModal && (
        <div
          id={`sure-delete-modal`}
          className="fixed z-50 inset-0 flex w-screen h-screen justify-center items-center backdrop-blur-lg"
        >
          <div className="flex flex-col justify-between bg-white h-128 w-modal max-w-4xl drop-shadow-2xl p-5">
            <p className="font-semibold text-2xl text-white -mx-5 -mt-5 py-4 bg-dark-blue">
              Share Note
            </p>
            <div className="flex flex-col flex-grow justify-center items-center">
              {/* TODO actual note name */}
              <p className="text-dark-blue text-2xl mb-2">
                Share with username:
              </p>
              {/* <label style={{ color: "red" }}>{}</label> */}
              {/* <label style={{ color: "grey" }}>{}</label> */}
              <input
                type="text"
                placeholder="username"
                className="bg-light-gray border-none mt-5 mb-8 py-3 text-dark-blue w-5/6"
                // value={}
                // onChange={}
              />
            </div>

            <div className="flex flex-row w-full justify-between">
              <button
                // id="close-new-note"
                onClick={() => setShowModal(!showModal)}
                className="bg-medium-gray text-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
              >
                cancel
              </button>
              <button
                // id="create-new-note"
                onClick={() => setShowModal(!showModal)}
                className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
                type="button"
              >
                share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upper Panel */}
      <div className="flex flex-row text-white justify-center w-screen bg-gradient-to-l from-dark-blue to-light-blue">
        <div className="flex flex-row w-full items-center justify-between container py-4">
          <div className="flex flex-row items-center">
            <label className="text-2xl font-semibold">{Title}</label>
          </div>
          {/* div for buttons */}
          <div className="flex flex-row items-center">
            <button
              className="bg-light-gray text-light-blue text-l py-3 px-3 rounded-none w-52 flex items-center justify-center mx-4 font-medium transition-all ease-in-out hover:scale-102 active:scale-98"
              onClick={() => setShowModal(!showModal)}
            >
              SHARE
            </button>
            <button className="bg-light-blue text-white text-l py-3 px-3 rounded-none w-52 flex items-center justify-center font-medium hover:bg-light-blue hover:text-white hover:shadow-lg transition-all ease-in-out hover:scale-102 active:scale-98" onClick={() => window.location.href = HOME}>
              SAVE AND EXIT
              
            </button>
          </div>
        </div>
      </div>

      {/* Main Screen */}
      <div className="flex flex-row text-white align-center justify-center w-screen h-full bg-white pb-3">
        <div className="container">
          {/* Editors Div */}
          <div className="mb-6 flex items-center justify-between text-dark-blue  pt-10">
            {/* Content for Editors Div */}
            <p className="font-medium text-lg">
              Current Editors:{" "}
              <span id="current-editors">Arlo, Clayton, Duncan</span>
            </p>
            <div className="flex flex-row justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/test.jpg"
                  alt="User Avatar"
                  className="w-full h-full text-dark-gray border-4 border-dark-blue rounded-full"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden -ml-5">
                <img
                  src="/test.jpg"
                  alt="User Avatar"
                  className="w-full h-full text-dark-gray border-4 border-light-blue rounded-full"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden -ml-5">
                <img
                  src="/test.jpg"
                  alt="User Avatar"
                  className="w-full h-full text-dark-gray border-4 border-dark-gray rounded-full"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden -ml-5">
                <img
                  src="/test.jpg"
                  alt="User Avatar"
                  className="w-full h-full text-dark-gray border-4 border-medium-gray rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Category Div */}
          <div className="mb-6 flex items-center mt-16 px-10 pb-10">
            {/* Content for Category Div */}
            <NoteCategory updateSelected={() => {}} />
          </div>

          {/* Editor Section */}
          <div className="flex flex-row text-dark-blue justify-between h-128">
            <textarea
              id="markdown"
              className="pane w-2/4 border-none resize-none rounded-lg mx-2 bg-light-gray"
              onChange={handleMarkdownChange}
              // defaultValue={markdownValue}
              value={markdownValue}
            />
            <div
              id="preview"
              className="prose pane w-2/4 text-left bg-light-gray rounded-lg mx-2 p-3 overflow-auto"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
