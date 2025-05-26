function ForgotPassword() {
  return (
    <body className="account-body accountbg">
      <div className="container">
        <div className="row vh-100">
          <div className="align-self-center col-12">
            <div className="auth-page">
              <div className="shadow-lg card auth-card" id="pwreset">
                <div className="card-body">
                  <div className="px-3">
                    <div className="auth-logo-box">
                      <a href="#" className="logo logo-admin">
                        <img
                          src="../assets/images/logo.png"
                          height="55"
                          alt="logo"
                          className="auth-logo"
                        />
                      </a>
                    </div>
                    <div className="text-center auth-logo-text">
                      <h4 className="mt-5 mb-3">
                        Reset Password For Mpilo Mobile
                      </h4>
                      <p className="mb-0 text-muted">
                        Enter your Email and instructions will be sent to you!
                      </p>
                    </div>
                    <form
                      className="my-4 form-horizontal auth-form"
                      action="index.html"
                    >
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
                          />
                        </div>
                      </div>
                      <div className="form-group mb-0 row">
                        <div className="mt-2 col-12">
                          <button
                            className="btn-block btn btn-gradient-primary btn-round waves-effect waves-light"
                            id="btnReset"
                            type="button"
                          >
                            Reset <i className="ml-1 fas fa-sign-in-alt"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="m-3 text-muted text-center">
                    <p className="">
                      Remember It ?{" "}
                      <a href="/login" className="ml-2 text-primary">
                        Sign in
                      </a>
                    </p>
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

export default ForgotPassword;
