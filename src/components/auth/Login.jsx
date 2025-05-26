import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";

function Login() {
  return (
    <body className="account-body accountbg">
      <div className="container">
        <div className="row vh-100">
          <div className="align-self-center col-12">
            <div className="auth-page">
              <div className="shadow-lg card auth-card" id="logpage">
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
                      <h4 className="mt-0 mt-5 mb-3">
                        Healthcare Practitioner Login
                      </h4>
                      <p className="mb-0 text-muted">
                        Sign in to continue to Mpilo Mobile
                      </p>
                    </div>
                    <form
                      className="my-4 form-horizontal auth-form"
                      action="index.html"
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
                          />
                        </div>
                      </div>
                      <div className="form-group mt-4 row">
                        <div className="col-sm-6">
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
                              Remember me
                            </label>
                          </div>
                        </div>
                        <div className="text-right col-sm-6">
                          <a
                            href="/forgot-password"
                            className="font-13 text-muted"
                          >
                            <i className="dripicons-lock"></i> Forgot password?
                          </a>
                        </div>
                      </div>
                      <div className="form-group mb-0 row">
                        <div className="mt-2 col-12">
                          <a href="SkillUp/HTML/authentication/ProfilePage.html">
                            <button
                              className="btn-block btn btn-gradient-primary btn-round waves-effect waves-light"
                              id="btnLog"
                              type="button"
                            >
                              Log In <i className="ml-1 fas fa-sign-in-alt"></i>
                            </button>
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="m-3 text-muted text-center">
                    <p className="">
                      Don't have an account?
                      <a href="/Register" className="ml-2 text-primary">
                        Register
                      </a>
                    </p>
                  </div>
                  <div className="d-flex justify-content-center">
                    <Link to="/AdminLogin">
                      {" "}
                      <button className="SkillUplms-btn">
                        <span className="admin-icon">
                          <RiAdminFill />
                        </span>{" "}
                        I'm an Admin
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default Login;
