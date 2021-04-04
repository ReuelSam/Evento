import React, { Component } from 'react';
import { comment, uncomment} from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class Comment extends Component {
    state = {
        text: "",
        error: ""
    }

    handleChange = event => {
        this.setState({text: event.target.value, error: ""});
    }

    isValid = () => {
        const {text} = this.state;
        if ( !(text.length > 0) )
        {
            this.setState({error: "Comment should not be empty."});
            return false;
        }
        else if ( text.length > 150 )
        {
            this.setState({error: "Comment max length is 150 characters"});
            return false;
        }
        return true;
    }

    addComment = e => {
        e.preventDefault();

        if (!isAuthenticated()){
            this.setState({error: "Please Sign in to leave a comment"})
            return false;
        }
        

        if (this.isValid())
        {
            const token = isAuthenticated().token;
            const userId = isAuthenticated().user._id;
            const postId = this.props.postId;
            const newComment = {text: this.state.text};
            comment(userId, token, postId, newComment)
            .then(data => {
                if (data.error)
                {
                    console.log(data.error);
                }
                else
                {
                    this.setState({text: ''})
                    // dispatch fresh list of comments to parent component (SinglePost)
                    this.props.updateComments(data.comments);
                }
            });
        }
    };

    deleteComment = (comment) => {
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        const postId = this.props.postId;
        uncomment(userId, token, postId, comment)
        .then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                // dispatch fresh list of comments to parent component (SinglePost)
                this.props.updateComments(data.comments);
            }
        });
    }

    deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure you wish to delete your comment?");
        if (answer)
        {
            this.deleteComment(comment);
        }
    }


    render() {

        const {comments} = this.props;
        comments.reverse();
        const {error} = this.state;

        return (
            <div className="jumbotron"> 
                
                  
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                <div className="col-md-12">
                    <h3 className="text-primary">{" "}{comments.length} Comments <i className="fa fa-comment mb-2" /></h3>
                    <hr />
                    <form onSubmit={this.addComment}>
                        <div className="form-group mt-4">
                            <input type="text" onChange={this.handleChange} className="form-control" value={this.state.text} placeholder="Leave a Comment..."/>
                            <button className="btn btn-raised btn-success mt-2">Post</button>
                        </div>
                    </form>

                    {
                        comments.map((comment, i) => {
                            const posterProfile = comment.postedBy ? `/user/${comment.postedBy._id}` : "";
                            const posterName = comment.postedBy ? comment.postedBy.name : " Unknown";
                            const posterId = comment.postedBy ? `${comment.postedBy._id}` : "";
                            
                            return(
                            <div key={i}>
                                <div>
                                    <Link to={`/user/${posterProfile}`}> 
                                        <img 
                                            className="float-left mr-2" 
                                            style={{height: "30px", width: "auto", borderRadius: "50%"}}
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`} 
                                            alt={posterName} 
                                            onError={i => (i.target.src = `${DefaultProfile}`)}  
                                        />
                                    </Link>
                                    
                                    <div>
                                        <p className="lead">{comment.text}</p>
                                        <p className="font-italic mark bg-light">
                                            Posted By: <Link to={`/user/${posterProfile}`}>{posterName}{" "}</Link>
                                            on {new Date(comment.created).toDateString()}
                                            {console.log(isAuthenticated().user._id, " ", posterId)};
                                            <span>
                                                {
                                                    isAuthenticated().user && isAuthenticated().user._id === posterId && 
                                                    <>
                                                        <span onClick={ () => this.deleteConfirmed(comment)} className="text-danger float-right mr-1" style={{cursor:'pointer'}}>Remove</span>
                                                    </>
                                                }
                                            </span>
                                        </p>
                                        <hr />
                                    </div>

                                </div>
                            </div>
                            )
                            
                        })
                    }
                </div>

            </div>
        )
    }
}

export default Comment;