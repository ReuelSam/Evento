import React from 'react';
import Posts from '../post/Posts';
import {isAuthenticated} from '../auth';

const Home = () => (
    <div>
        <div className="jumbotron">
            <h2>Home Page</h2>
            <p className="lead">Welcome to Evento</p>
        </div>

        {isAuthenticated() && (
                <div className="container">
                    <Posts />
                </div>
            )
        }
    </div>
    
);

export default Home;