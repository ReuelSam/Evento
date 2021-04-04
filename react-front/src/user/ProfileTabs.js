import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class ProfileTabs extends Component {
    render() {
        const {following, followers, posts, name} = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">Followers ({followers.length})</h3>
                        <hr />
                        {
                            followers.map((person, i) => (
                                <div key={i}>
                                    <div>
                                        <Link to={`/user/${person._id}`}> 
                                            <img 
                                                className="float-left mr-2" 
                                                style={{height: "30px", width: "30px", borderRadius: "50%"}}
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} 
                                                alt={person.name} 
                                                onError={i => (i.target.src = `${DefaultProfile}`)}  
                                            />
                                            <div>
                                                <p className="lead">{person.name}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                            ))
                        }
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-primary">Following ({following.length})</h3>
                        <hr />
                        {
                            following.map((person, i) => (
                                <div key={i}>
                                    
                                    <div>
                                        <Link to={`/user/${person._id}`}> 
                                            <img 
                                                className="float-left mr-2" 
                                                style={{height: "30px", width: "30px", borderRadius: "50%"}}
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} 
                                                alt={person.name} 
                                                onError={i => (i.target.src = `${DefaultProfile}`)}  
                                            />
                                            <div>
                                                <p className="lead">{person.name}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                            ))
                        }
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-primary">{name}'s Events  ({posts.length})</h3>
                            <hr />
                            {
                                posts.map((post, i) => (
                                    <div key={i}>
                                        
                                        <div>
                                            <Link to={`/post/${post._id}`}> 
                                                <div>
                                                    <p className="lead">{post.title}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                ))
                            }
                    </div>
                </div>

            </div>
        )
    }
}

export default ProfileTabs;