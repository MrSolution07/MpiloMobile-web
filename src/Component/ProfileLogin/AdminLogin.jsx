import { Link } from 'react-router-dom'
import { TbStethoscope } from "react-icons/tb";
    

    function AdminLogin() {
        return (
    <body className="account-body accountbg">
    <div className="container">
    <div className="row vh-100 ">
    <div className="col-12 align-self-center">
        <div className="auth-page">
            <div className="card auth-card shadow-lg" id="logpage">
                <div className="card-body">
                    <div className="px-3">
                        <div className="auth-logo-box">
                            <a href="/" className="logo logo-admin"><img src="../assets/images/mpiloLogo.png" height="55" alt="logo" className="auth-logo" /></a>
                        </div>
                        <div className="text-center auth-logo-text">
                            <h4 className="mt-0 mb-3 mt-5">Administrator Login</h4>
                            <p className="text-muted mb-0">Sign in to continue to Mpilo Mobile</p>
                        </div>
                        <form className="form-horizontal auth-form my-4" action="index.html">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-group mb-3">
                                    <span className="auth-form-icon">
                                        <i className="dripicons-user"></i>
                                    </span>
                                    <input type="text" className="form-control" id="username" placeholder="Enter username" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="userpassword">Password</label>
                                <div className="input-group mb-3">
                                    <span className="auth-form-icon">
                                        <i className="dripicons-lock"></i>
                                    </span>
                                    <input type="password" className="form-control" id="userpassword" placeholder="Enter password" />
                                </div>
                            </div>
                            <div className="form-group row mt-4">
                                <div className="col-sm-6">
                                    <div className="custom-control custom-switch switch-success">
                                        <input type="checkbox" className="custom-control-input" id="customSwitchSuccess" />
                                        <label className="custom-control-label text-muted" htmlFor="customSwitchSuccess">Remember me</label>
                                    </div>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <a href="/Forgotpsw" className="text-muted font-13"><i className="dripicons-lock"></i> Forgot password?</a>
                                </div>
                            </div>
                            <div className="form-group mb-0 row">
                                <div className="col-12 mt-2">                                    
                                    <a href='SkillUp/HTML/authentication/ProfilePage.html'><button className="btn btn-gradient-primary btn-round btn-block waves-effect waves-light" id="btnLog" type="button">Log In <i className="fas fa-sign-in-alt ml-1"></i></button></a>                                   
                                </div>
                            </div>
                        </form>
                    </div>
            
                    <div className='justify-content-center d-flex'>
                      <Link to="/LoginPage"><button className="SkillUplms-btn" >
                     <span className="admin-icon "><TbStethoscope /></span> I'm a practitioner 
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

    export default AdminLogin;
