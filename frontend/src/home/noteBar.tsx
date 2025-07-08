import { useState } from "react";
import { Note, User } from "../generated/graphql";
import RelativeTime from "@yaireo/relative-time";

export function NoteBar({
  user,
  note,
  deleteNote,
  // sureDeleteNoteModal
}: {
  user: User;
  note: Note;
  deleteNote: (id: string) => void;
  // sureDeleteNoteModal: HTMLElement;
}) {
  const noteEditUrl = `/${note.id}/editor`;
  const sureDeleteNoteModal = document.getElementById(`sure-delete-modal-${note.id}`);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    {showModal && <div id={`sure-delete-modal-${note.id}`} className="fixed z-50 inset-0 flex w-screen h-screen justify-center items-center backdrop-blur-lg">
        <div className="flex flex-col justify-between bg-white h-128 w-modal max-w-4xl drop-shadow-2xl p-5">
          <p className="font-semibold text-2xl text-white -mx-5 -mt-5 py-4 bg-dark-blue">
            Delete Note
          </p>
          <div className="flex flex-col flex-grow justify-center">
            {/* TODO actual note name */}
            <p className="text-dark-blue text-2xl mb-2">Are you sure you want to delete this note?</p>
            <p className="text-dark-blue text-xl font-semibold">{note.title}</p>
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
              onClick={() => {
                deleteNote(note.id)
                setShowModal(!showModal)
              }}
              className="bg-dark-blue border-none rounded-none w-40 h-10 mx-3 uppercase font-medium hover:bg-light-blue hover:shadow-lg transition-all ease-in-out hover:scale-102 active:bg-dark-blue"
              type="button"
            >
              delete note
            </button>
          </div>
        </div>
      </div>
    }














      <div className="note-bar flex flex-row items-center justify-between w-full bg-medium-gray rounded-full py-3 pl-8 pr-4 mb-5">
        <div className="flex flex-row items-center">
          <p className="note-title text-dark-blue font-semibold mr-5">
            {note.title}
          </p>
          {note.owner.id !== user.id && (
            <p className="note-shared-status bg-dark-blue py-1 px-4 rounded-full mx-4">
              {/* change this to check if note user == current */}
            </p>
          )}

          <p className="note-owner text-dark-blue">
            owner: {note.owner.username}
          </p>
        </div>
        <div className="flex flex-row items-center">
          <p className="note-last-edited text-dark-blue">
            last edited: {new RelativeTime().from(new Date(parseInt(note.lastUpdated)))}
          </p>
          <button
            className="note-delete-button bg-dark-gray py-1 px-4 rounded-full w-24 ml-4 hover:shadow-lg transition-all ease-in-out hover:scale-102 active:scale-98"
            // onClick={() => deleteNote(note.id)}
            onClick={() => {setShowModal(!showModal)
            console.log(note)
            }}
          >
            delete
          </button>
          <a href={noteEditUrl}>
            <button className="note-open-button bg-light-blue py-1 px-4 rounded-full w-24 ml-4 hover:shadow-lg transition-all ease-in-out hover:scale-102 active:scale-98">
              open
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
