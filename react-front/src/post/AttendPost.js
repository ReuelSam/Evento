import React, { Component } from 'react'
import { isAuthenticated } from '../auth';
import { getAttend, read } from '../user/apiUser';
import { Link, Redirect } from 'react-router-dom';
import DefaultPost from '../images/event.jpg';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];

class AttendPost extends Component {
    constructor() {
        super();
        this.state = {
            redirectToProfile: false,
            posts: [],
            loading: true,
            user: {}
        }
    }

    componentDidMount() {
        // list method written in src/user/apiUser.js
        const userId = this.props.match.params.userId;
        if ( userId !== isAuthenticated().user._id)
        {
            this.setState({redirectToProfile: true})
        }
        const token = isAuthenticated().token;
        getAttend(userId, token).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                this.setState({posts: data, loading: false});
            }
        })
        read(userId, token)
        .then(data => {
            if (data.error) 
            {
                this.setState({redirectToSignin: true});
            }
            else 
            {
                this.setState({user: data})
            }
        });
    }   

    generateTags = (tags) => (
        tags.map((value, index) => 
            {
                if (value >= 0.5)
                {
                    return (  
                        <label className='btn btn-raised btn-info col-md-12 mr-1' key={index}> {tagNames[index]} </label>
                    )
                }
                return true;
            }
        )
    )

    tagsList = (tags) => (
        <div className="form-group">
            <label className="text-muted">Event Tags</label>
            <br />
            <div className="button-group ml-5 mr-5" >
                {this.generateTags(tags)}

            </div>
        </div>
    )

    
    renderPosts = (posts) => {
        return (
            <div className="row">
            {   posts.map((post , i) => {
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

                    return (
                        <div className="card col-md-4" key={i}>
                            
                            <div className="card-body">
                                <img 
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                    alt={post.title}
                                    onError={i => i.target.src = `${DefaultPost}`}
                                    className="img-thumbnail mb-3"
                                    style={{height: "200px", width:"100%"}}    
                                />

                                
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.substring(0, 100)}</p>
                                <br />
                                <p className="font-italic mark">
                                    Posted By: <Link to={`${posterId}`}>{posterName}{" "}</Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                {this.tagsList(post.tags)}
                                <Link to={`/post/${post._id}`} className="btn btn-raised btn-primary btn-sm">Expand</Link>
                            </div>
                        </div>
                    )
                }
            )}   
            </div>
        )
    }

    render() {
        const {posts, loading, user, redirectToProfile} = this.state;
        if (redirectToProfile)
        {
            return <Redirect to={`/user/${user.name}`} />
        }
        return (
            
            <div className="container">
                <h2 className="mt-5 mb-5"> {user.name}'s Upcoming Events:</h2>

                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : ( this.renderPosts(posts))}

            </div>
        )
    }
}

export default AttendPost;