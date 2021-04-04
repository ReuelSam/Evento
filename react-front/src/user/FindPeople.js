import React, { Component } from 'react';
import { findPeople, follow } from './apiUser';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import { isAuthenticated } from '../auth';

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            open: false,
            error: "",
            followMessage: "",
            loading: true
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        // method written in src/user/apiUser.js
        findPeople(userId, token).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                console.log("Data: ", data);
                this.setState({users: data, loading: false});
            }
        })
    }   

    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
        .then(data => {
            if (data.error)
            {
                this.setState({error: data.error})
            }
            else
            {
                let toFollow = this.state.users;
                toFollow.splice(i, 1);              // to remove the user from the list of users being suggested
                this.setState({
                    users: toFollow,
                    open: true,                     // determine when to show message that the new account has been followed
                    followMessage: `Following ${user.name}`,
                    error: ""
                })
            }
        })
    }

    renderUsers = (users) => (
        <div className="row">
            {
                users.map((user , i) => (
                    <div className="card col-md-4 mt-3" key={i}>
                    
                        <div className="card-body">

                            <img 
                                style={{height: "300px", width:"100%"}} 
                                className="img-thumbnail" 
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                                onError={i => (
                                    i.target.src = `${DefaultProfile}`
                                    )} 
                                alt={user.name}> 
                            </img>
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>

                            <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">
                                View Profile
                            </Link>
                            
                            <button onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-info float-right btn-sm">
                                Follow
                            </button>
                        </div>
                    </div>
                )
            )}   
        </div>
    )

    render() {
        const {users, open, followMessage, loading} = this.state;
        return (


            <div className="container" >
                <h2 className="mt-5 mb-5">Suggested Users</h2>
                
                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : "" }

                {   
                    open && <div className="alert alert-success">
                        <p>{followMessage}</p>
                    </div>
                }
                {this.renderUsers(users)}

            </div>
        )
    }
}

export default  FindPeople;