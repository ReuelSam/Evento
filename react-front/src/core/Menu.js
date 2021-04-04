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

const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs" style={{ backgroundColor: "#116466"}}>
            <li className="nav-item">
                
                <Link className="nav-link" to="/" style={isActive(history, "/")} >
                    <i className="fa fa-home fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                </Link>   
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/users" style={isActive(history, "/users")} >
                    <i className="fa fa-users fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />    
                </Link>   
            </li>

            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin" style={isActive(history, "/signin")}  >
                            <i className="fa fa-sign-in fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </Link>
                    </li>
                    
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup" style={isActive(history, "/signup")} >
                            <i className="fa fa-plus-circle fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </Link>
                    </li>   
                </>
            )}

            {isAuthenticated() && (
                <>
                    
                    <li className="nav-item">
                        
                        <Link className="nav-link" to={`/user/findpeople/${isAuthenticated().user._id}`} style={(isActive(history, `/user/findpeople/${isAuthenticated().user._id}` ))}>
                            <i className="fa fa-user-plus fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </Link>
                        
                    </li>

                    <li className="nav-item">
                        
                        <Link className="nav-link" to={`/user/post/new/${isAuthenticated().user._id}`} style={(isActive(history, `/user/post/new/${isAuthenticated().user._id}` ))}>
                            <i className="fa fa-plus-square fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </Link>
                        
                    </li>

                    <li className="nav-item">
                        
                        <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`} style={(isActive(history, `/user/${isAuthenticated().user._id}` ))}>
                        <i className="fa fa-user fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </Link>
                        
                    </li>

                    <li className="nav-item">
                        <span className="nav-link" style={(isActive(history, "/signin"), {cursor: "pointer", color: "#fff"})} onClick={() => signout(() => history.push("/"))}>
                            <i className="fa fa-power-off fa-2x text-light" style={{padding: '10px', borderRadius:"50%"}} />
                        </span>
                    </li>

                </>
            )}
        </ul>
    </div>
);



// withRouter is a higher order component. It accepts componant as an argument
export default withRouter(Menu);


