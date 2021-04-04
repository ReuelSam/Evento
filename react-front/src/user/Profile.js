import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost'

// import Users from './Users';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];

class Profile extends Component {
    constructor()
    {
        super()
        this.state = {
            user: {following: [], followers: []},
            redirectToSignin: false,
            load: false,
            following: true,
            posts: []
        }
    }

    // check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id
        })
        return match
    }

    // sends the method to FollowProfileButton.js
    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
    
        // console.log(userId, this.state.user._id)
        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
                // console.log("error is here\n", data)
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };


    // to get userid from url

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then(data => {
            if (data.error) 
            {
                this.setState({redirectToSignin: true});
            }
            else 
            {
                // console.log(data);
                let following = this.checkFollow(data)
                this.setState({user: data, load: true, following: following});
                this.loadPosts(data._id);
            }
        });
    }

    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
        .then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else 
            {
                this.setState({ posts: data});
            }
        })
    }


    componentDidMount() {
        //console.log("User ID from route params: ", this.props.match.params.userId);
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        //console.log("User ID from route params: ", this.props.match.params.userId);
        const userId = props.match.params.userId;
        this.init(userId);
    }

    generateTags = (tags) => (
        tags.map((value, index) => 
            {
                if (value >= 0.5)
                {
                    return (  
                        <label className='btn btn-raised btn-info col-md-3 mr-2' key={index}> {tagNames[index]} </label>
                    )
                }
                return true;
            }
        )
    )

    tagsList = (tags) => (
        <div className="form-group">
            <label className="text-muted">Interested Tags:</label>
            <br />
            <div className="button-group" >
                {this.generateTags(tags)}

            </div>
        </div>
    )


    render() {
        //this.init();
        const {redirectToSignin, user, posts} = this.state;
       
        if (redirectToSignin)
        {
            return <Redirect to="/signin" />
        }

        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile: {user.name}</h2>
                <div className="row">
                    <div className="col-md-4">
                        
                        <img 
                            style={{height: "300px", width:"auto"}} 
                            className="img-thumbnail" 
                            src={photoUrl} 
                            onError={i => (
                                i.target.src = `${DefaultProfile}`
                                )}  
                            alt={user.name}>
                        </img>

                    </div>

                    <div className="col-md-8">
                        
                        <div className="lead mt-5">
                            
                            <p>Email: {user.email}</p>
                            <p>{`Joined on: ${new Date(user.created).toDateString()}`}</p>
                            
                            
                            {(this.state.load) && this.tagsList(user.tags)}
                        </div>

                            
                        {
                            isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                                
                                <div className="d-block">
                                    {
                                    <Link className="btn btn-raised btn-light bg-dark mr-2" to={`/user/attending/${user._id}`}>
                                        Upcoming Events
                                    </Link>
                                    }
                                    <Link className="btn btn-raised btn-primary mr-2" to={`/user/post/new/${user._id}`}>
                                        Create Event
                                    </Link>
                                    
                                    <Link className="btn btn-raised btn-success mr-2" to={`/user/edit/${user._id}`}>
                                        Edit Profile
                                    </Link>
                                    
                                    <DeleteUser userId={ user._id} />
                                    
                                </div>

                            ) : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton}/>)
                        }

                        
                    </div>
                </div>

                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />

                        <ProfileTabs followers={user.followers} following={user.following} posts={posts} name={user.name}/>

                    </div>
                </div>
                
                
            </div>
        );
    }
}


export default Profile;