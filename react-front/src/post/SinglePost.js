import React, { Component } from 'react';
import { singlePost, remove, like, unlike, notInterested, undoNotInterested } from './apiPost';
import { read, updateTags, attend, unattend } from '../user/apiUser';
import { Link, Redirect } from 'react-router-dom';
import DefaultPost from '../images/event.jpg';
import { isAuthenticated } from '../auth';
import Comment from './Comment';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];

class SinglePost extends Component {
    state = {
        post: '',
        tags: [],
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        notInterested: false,
        userTags: [],
        comments: []
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = (likes.indexOf(userId) !== -1);// indexOf returns -1 if not found
        return match;
    }

    init = () => {
        const token = isAuthenticated().token;
        const userId = isAuthenticated() && isAuthenticated().user._id;
        read(userId, token)
        .then(data => {
            if (data.error) 
            {
                this.setState({redirectToProfile: true});
            }
            else 
            {
                // console.log(data);
                this.setState({userTags: data.tags});
            }
        });
    }

    componentDidMount = () => {
        this.init();
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                this.setState(
                    {
                        post: data, 
                        tags: data.tags,
                        likes: data.likes.length,
                        like: this.checkLike(data.likes),
                        notInterested: this.checkLike(data.notInterested),
                        comments: data.comments 
                    }
                )
            }
        })
    }

    //  userTags[index] = (userTags[index] > 1) ? 1: userTags[index];
    //  userTags[index] = (userTags[index] < 0) ? 0: userTags[index];

    
    updateTags = (flag) => {
        const {tags, userTags} = this.state;
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        tags.map( (value, index) => {
            var change = 0.05 * tags[index];
            if (flag)
            {
                userTags[index] += change;
            }
            else
            {
                userTags[index] -= change;
            }
            return true;
        })
        updateTags(userId, token, userTags).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                ;
            }
        })
    }

    updateComments = comments => {
        this.setState({comments})
    }


    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        console.log("like toggled");
        let callApi = this.state.like ? unlike : like;
        let callApi2 = this.state.like ? unattend : attend;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        callApi(userId, token, postId).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                console.log("like done");
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length,
                    //notInterested: !this.state.notInterested
                })
                if (this.state.like && this.state.notInterested)
                {
                    this.notInterestedToggle();
                }
                this.updateTags(this.state.like);
            }
        })
        callApi2(userId, token, postId).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                ;
            }
        })
    }

    notInterestedToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        console.log("notInterested toggled");
        let callApi = this.state.notInterested ? undoNotInterested : notInterested;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        callApi(userId, token, postId).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                console.log("not interested done");
                this.setState({
                    notInterested: !this.state.notInterested,
                    //like: !this.state.like
                })
                if (this.state.notInterested && this.state.like)
                {
                    this.likeToggle();
                }
                this.updateTags(!this.state.notInterested);
            }
        })
        
    }

    generateTags = (tags) => (
        
        tags.map((value, index) => 
            {
                if (value >= 0.5)
                {
                    return (  
                        <label className='btn btn-raised btn-info col-md-2 mr-2' key={index}> {tagNames[index]} </label>
                    )
                }
                return true;
            }
        )
    )

    tagsList = (tags) => (
        <div className="form-group">
            <label className="text-muted">Event Tags:</label>
            <br />
            <div className="button-group" >
                {this.generateTags(tags)}

            </div>
        </div>
    )

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
        .then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                this.setState({redirectToHome: true})
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you wish to delete your event? This will delete all details regarding your event from our database.");
        if (answer)
        {
            this.deletePost();
        }
    }


    renderPost = (post) => {

        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
        
        const { like, likes, notInterested} = this.state;

        return (

            
                <div className="card-body">
                    <img 
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                        alt={post.title}
                        onError={i => i.target.src = `${DefaultPost}`}
                        className="img-thumbnail mb-3"
                        style={{height: "400px", width:"100%", objectFit: "cover"}}    
                    />

                    {(isAuthenticated().user._id !== post.postedBy._id) && (like ? 
                        (
                            <h4 className="d-inline mr-1">
                                <i onClick={this.likeToggle} className="fa fa-thumbs-up text-success bg-dark" style={{padding: '10px', borderRadius:"50%"}} />
                            </h4>
                        ) 
                        : 
                        (
                            <h4 className="d-inline mr-1">
                                <i  onClick={this.likeToggle} className="fa fa-thumbs-up text-light bg-dark" style={{padding: '10px', borderRadius:"50%"}} />  
                            </h4>
                        )
                    )}

                    {(isAuthenticated().user._id !== post.postedBy._id) && (!notInterested ?
                        (
                            <h4 className="d-inline">
                                <i onClick={this.notInterestedToggle} className="fa fa-thumbs-down text-light bg-dark mr-3" style={{padding: '10px', borderRadius:"50%"}}/>

                            </h4>
                        ) 
                        : 
                        (
                            <h4 className="d-inline">
                                <i onClick={this.notInterestedToggle} className="fa fa-thumbs-down text-warning bg-dark m3-3" style={{padding: '10px', borderRadius:"50%"}}/>

                            </h4>
                        )
                    )}

                    <h4 className="d-inline">
                       {" "}{likes} Attending

                    </h4>

                    {/*(isAuthenticated().user._id !== post.postedBy._id) && (!notInterested ?
                        (
                            <button onClick={this.notInterestedToggle} className="btn btn-raised btn-warning btn-sm btn-rounded mb-3 ml-5 d-inline">Not Interested</button>
                        )
                        :
                        (
                            <button onClick={this.notInterestedToggle} className="btn btn-raised btn-light btn-sm btn-rounded mb-3 ml-5 d-inline" style={{color: "black"}}>Undo Not Interested</button>
                        )
                    )*/
                    }

                    
                    <p className="card-text mt-3">{post.body}</p>
                    <p className="card-text"><strong>Venue:</strong> {post.venue}</p>
                    <p className="card-text"><strong>Date and Time:</strong> {post.dateAndTime}</p>
                    <br />


                    <p className="font-italic mark">
                        Posted By: <Link to={`${posterId}`}>{posterName}{" "}</Link>
                        on {new Date(post.created).toDateString()}
                    </p>

                    {this.tagsList(this.state.tags)}

                    <div className="d-inline-block">
                        <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">Back to Events</Link>

                        {
                            isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && 
                            <>
                                <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5">Update Event</Link>
                                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger btn-sm">Delete Event</button>
                            </>
                        }
                        
                    </div>

                </div>
            
            
        )
    }

    render() {
        const {post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome)
        {
            return <Redirect to={`/`} />
        }
        else if (redirectToSignin) 
        {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                { !post ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : ( this.renderPost(post))}

                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments}/>

            </div>
        )
    }
}

export default SinglePost;