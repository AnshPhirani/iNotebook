import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setcredentials] = useState({
    email: "",
    name: "",
    password: "",
  });
  const confirmPassword = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(confirmPassword.current.value !== credentials.password){
        console.log("password not equal");
        props.showAlert("Password doesnot match", "danger");
        return;
    }
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth-token and redirect
      localStorage.setItem("authToken", json.authToken);
      navigate("/");
      props.showAlert("Acount Created Successfully", "success");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container col-5 mt-4">
      <h1 className="mb-2 text-primary">Welcome to iNotebook</h1>
      <p className="text-center">Please create an account to continue</p>
      <form onSubmit={handleSubmit}>
        <div className="form-groupmy-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={credentials.name}
            onChange={onChange}
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            placeholder="Enter your name"
            required
            minLength={3}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            value={credentials.email}
            onChange={onChange}
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required
            minLength={5}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group my-3">
          <label htmlFor="password">Password</label>
          <input
            value={credentials.password}
            onChange={onChange}
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            required
            minLength={5}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
           ref = {confirmPassword}
            type="password"
            className="form-control"
            id="confirmpassword"
            name="confirmpassword"
            placeholder="Confirm Password"
            required
            minLength={5}
          />
        </div>
        <button type="submit" className="btn btn-primary my-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
