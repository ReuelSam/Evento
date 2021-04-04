import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path)
    {
        return {color: "#000000"}
    }
    else 
    {
        return {color: "#ffffff"}
    }
};

const HamburgerMenu = ({history}) => (

    <nav className="navbar navbar-light"  style={{ backgroundColor: "#116466"}}>

        <a className="lead text-light ml-2" href="/">Evento</a>

        <button className="navbar-toggler toggler-example" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1"
        aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"><span className="dark-blue-text"><i
            className="fa fa-bars fa-1x text-light"></i></span></button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent1">

            <ul className="navbar-nav mr-auto">
               

                <li className="nav-item">
                    <Link className="" to="/" style={isActive(history, "/")}  >
                        <i className="fa fa-home fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                            <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                {"   "}Home
                            </label>
                        </i> 
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="" to="/users" style={isActive(history, "/users")} >
                        <i className="fa fa-users fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                            <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                {"   "}Users
                            </label>
                        </i>     
                    </Link>   
                </li>

                {!isAuthenticated() && (
                    <>
                        <li className="nav-item">
                            <Link className="" to="/signin" style={isActive(history, "/signin")}  >
                                <i className="fa fa-sign-in fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                    <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                        {"   "}Sign In
                                    </label>
                                </i> 
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="" to="/signup" style={isActive(history, "/signup")} >
                                <i className="fa fa-plus-circle fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                    <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                        {"   "}Sign Up
                                    </label>
                                </i> 
                            </Link>
                        </li>   
                    </>
                )}

                {isAuthenticated() && (
                    <>
                        
                        <li className="nav-item">
                            
                            <Link className="" to={`/user/findpeople/${isAuthenticated().user._id}`} style={(isActive(history, `/user/findpeople/${isAuthenticated().user._id}` ))}>
                                <i className="fa fa-user-plus fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                    <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                        {"   "} Suggested Users
                                    </label>
                                </i> 
                            </Link>
                            
                        </li>

                        <li className="nav-item">
                            
                            <Link className="" to={`/user/post/new/${isAuthenticated().user._id}`} style={(isActive(history, `/user/post/new/${isAuthenticated().user._id}` ))}>
                                <i className="fa fa-plus-square fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                    <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                        {"   "}Create Event
                                    </label>
                                </i> 
                            </Link>
                            
                        </li>

                        <li className="nav-item">
                            
                            <Link className="" to={`/user/${isAuthenticated().user._id}`} style={(isActive(history, `/user/${isAuthenticated().user._id}` ))}>
                            <i className="fa fa-user fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                    {"   "}Profile
                                </label>
                            </i> 
                            </Link>
                            
                        </li>

                        <li className="nav-item">
                            <span className="" style={(isActive(history, "/signin"), {cursor: "pointer", color: "#fff"})} onClick={() => signout(() => history.push("/"))}>
                                <i className="fa fa-power-off fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} >
                                    <label className="lead text-light ml-2 mb-2" style={{fontSize: "0.75em"}}>
                                        {"   "}Sign Out
                                    </label>
                                </i> 
                            </span>
                        </li>

                    </>
                )}
            </ul>

        </div>

    </nav>
)

// withRouter is a higher order component. It accepts componant as an argument
export default withRouter(HamburgerMenu);


