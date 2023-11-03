import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
  const userRef = useRef(); //useRef hook provided by redux, this is used to hold a reference to a dom element, 
  const errRef = useRef(); //similar to above
  const [username, setUsername] = useState(""); //state the updates when the setUsername is changed 
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();//navigate hook which is to be used when we submit the form, and can navigate to the dash
  const dispatch = useDispatch();//instantiate for us to access the dispatch function form the redux store js, the dispatch function is now stored in the dispatch variable, functions can include other slices that are linked to the store as well, so in this case we are using a function exported by the auth slice

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => { //when this component loads, it will focus on the userref which reference an element in the dom, you can see that it is referenced below in the content  input element
    userRef.current.focus();
  }, []);

  useEffect(() => { //clears the error message when the username and password changes, the dependencies after the setErrMsg just tell this useEffect to execute when they are changed. since this is a single page web page, the error message will appear when the user logs in with bad requests, and will be cleared when the user tries again, without having to refersh the page, thats why we set it as preventdefault when we submit the form 
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevernt from reloading since submitting a form by default reloads this, and since this is a single page website, we want to prevent it from loading.
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken })); //when the user login successfully, this is dispatched with the access token being the payload, this will update the redux store's state with a new token, in the store, which is linked to the auth slice, the state of the accesstoken is updated when this is passed through, 
      setUsername(""); //clears the password and user name then navigate to the dash url
      setPassword("");
      navigate("/dash");
    } catch (err) { //error handling
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value); //related to the states above, whenever the user types a change within the username and password fields, these two functions are triggered, which change the state of the username and password
  const handlePwdInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg} 
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};
export default Login;
