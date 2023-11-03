import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

//the users here is a prop. the prop details will come from the content below, we deconstruct prop to get users.
//add new note 
const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation(); //this method is a hook provided by redux, the add new note function is return by useAddNewNoteMutation function. isLoading and others are also part of redux toolkit that is automatically created with the hook, the difference between isError and error is that isError is when the API request fails and is a boolean, and the error is when this specific function runs into an error while requesting and this is not a boolean, its an error type

  const navigate = useNavigate(); //this allows us to navigate to different routes within the code, so when we are done with something, we can call this and navigate back to the main screen for example

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => { //useEffect is a hook provided by redux which allows us to perform side effects of functional components and takes 2 arguments, the second argument is a dependancy array where if any items in this array were to change, for example, the isSuccess, or navigate, it will then the useEffect will run. the first argument is the code that will run when this useEffect is called.
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value); //this is a variable that stores a function that will be called when the user types anything in the input field below, since this is called on the onChange attribute on the label element tag. same with the other two functions below
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading; //this is a boolean variable that stores true if title, text, and userID have values, (the every.boolean checks if all items in the array are true or false), and we can save if we are not in the loading state of the api request

  const onSaveNoteClicked = async (e) => { //this is a variable function that when is called in the form submit button, we make sure to prevent default as it will disrupt our asynchronous code like the api request that is made just below it that if we can save (if its true from above) then we wadd a new note with these three variable
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  const options = users.map((user) => { //this will populate an option tag with the available users from our mongo db through middle ware from the back end to here 
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
