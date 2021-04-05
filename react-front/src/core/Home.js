import React from 'react';
import Posts from '../post/Posts';
import Info from './Info';
import {isAuthenticated} from '../auth';
import DefaultProfile from '../images/evento_logo_white.png';

const Home = () => (
    <div style={{fontFamily: "-moz-initial", backgroundColor:"#dce1e3"}}>
        <div className="jumbotron" style={{  backgroundColor: "#2f7f80", color: "#ffffff", fontFamily: "-moz-initial" ,borderRadius: "0px"}}>
            
                <center>


                    <img  style={{height: "125px", width: "auto"}} className="col-md-1" src={DefaultProfile}  alt="Logo"/>

                    <div style={{display: "inline"}}>
                        
                    <h1>Home Page</h1>
                    <h3 className="lead ml-2">Welcome to Evento</h3>
                    </div>
                
                </center>
                

            
        </div>

        {isAuthenticated() ?
            (
                <div className="container">
                    <Posts />
                </div>
            )
            :
            (
                <div className="container">
                    <Info />
                </div>
            )
        }
    </div>
    
);

export default Home;