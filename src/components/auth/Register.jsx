import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/register`, {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        mobileNumber: mobileNumber,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container" id="page">
      <div className="row vh-100">
        <div className="align-self-center col-12">
          <div className="auth-page">
            <div className="shadow-lg card auth-card" id="regpage">
              <div className="card-body">
                <div className="px-3">
                  <div className="auth-logo-box">
                    <a href="/" className="logo logo-admin">
                      <img
                        src="../assets/images/mpiloLogo.png"
                        height="55"
                        alt="logo"
                        className="auth-logo"
                      />
                    </a>
                  </div>
                  <div className="text-center auth-logo-text">
                    <h4 className="name">Mpilo Mobile</h4>
                    <p className="text-muted">Register your account now.</p>
                  </div>
                  <form
                    className="my-4 form-horizontal auth-form"
                    action="index.html"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <div className="input-group mb-3">
                        <span className="auth-form-icon">
                          <i className="dripicons-user"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter username"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="useremail">Email</label>
                      <div className="input-group mb-3">
                        <span className="auth-form-icon">
                          <i className="dripicons-mail"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="useremail"
                          placeholder="Enter Email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="userpassword">Password</label>
                      <div className="input-group mb-3">
                        <span className="auth-form-icon">
                          <i className="dripicons-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="userpassword"
                          placeholder="Enter password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-group mb-3">
                        <span className="auth-form-icon">
                          <i className="dripicons-lock-open"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          placeholder="Confirm Password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobileNumber">Mobile Number</label>
                      <div className="input-group mb-3">
                        <span className="auth-form-icon">
                          <i className="dripicons-phone"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="mobileNumber"
                          placeholder="Enter Mobile Number"
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group mt-4 row">
                      <div className="col-sm-12">
                        <div className="custom-control custom-switch switch-success">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customSwitchSuccess"
                          />
                          <label
                            className="text-muted custom-control-label"
                            htmlFor="customSwitchSuccess"
                          >
                            By registering you agree to the{" "}
                            <a href="#" className="text-primary">
                              Terms of Use
                            </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-0 row">
                      <div className="mt-2 col-12">
                        <button
                          className="btn-block btn btn-gradient-primary btn-round waves-effect waves-light"
                          type="submit"
                          id="btnReg"
                        >
                          Register <i className="ml-1 fas fa-sign-in-alt"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="m-3 text-muted text-center">
                  <p className="">
                    Already have an account ?{" "}
                    <a href="/login" className="ml-2 text-primary">
                      Log in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
