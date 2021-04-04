import React, { Component } from 'react'
import { singlePost, update } from './apiPost';
import { isAuthenticated } from '../auth';
import DefaultPost from '../images/event.jpg';
import { Link, Redirect } from 'react-router-dom';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            body: '',
            venue: '',
            dateAndTime: '',
            redirectToProfile: false,
            error: '',
            fileSize: 0,
            loading: false,
            defaultImage: true,
            imagePath: "",
            tags: [],
        }
    }

    init = (postId) => {
        singlePost(postId)
        .then(data => {
            if (data.error) 
            {
                this.setState({redirectToProfile: true});
            }
            else 
            {               
                this.setState({ 
                    id: data.postedBy._id, 
                    title: data.title, 
                    body: data.body, 
                    tags: data.tags,
                    venue: data.venue,
                    dateAndTime: data.dateAndTime,
                    error: "",
                });
                console.log(this.state.tags)
            }
        });
    }
 

    componentDidMount() {
        //console.log("User ID from route params: ", this.props.match.params.userId);
        this.postData = new FormData();                 // API
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    // higher order function: function that returns another function. This function takes the 'event'
    handleChange = (name) => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        if (value === undefined)
        {
            this.setState({ defaultImage: true});
            return;
        }
        else if (name === "photo")
        {
            this.setState({ defaultImage: false, imagePath: URL.createObjectURL(event.target.files[0])});
            
        }
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize, error: "" });
    };


    //check if input fields are valid
    isValid = () => {
        const { title, body, fileSize } = this.state;
        
        if (fileSize > 200000)      // 100KB
        {
            this.setState({error: "File size should be less 200KB"});
            return false;
        }
        
        if (title.length === 0 || body.length === 0)
        {
            this.setState({error: "Title and Body is required."});
            return false;
        }

        // email@domain.com
        // eslint-disable-next-line
        
        return true;
    }

    clickSubmit = event => {
        // browser reloads page by defualt on submit. therefore, we need to prevent default behavior
        event.preventDefault();
        
        console.log(this.state.tags);
        if (this.isValid())
        {
            this.setState({loading: true});
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData)
            // checking for error response
            .then(data => {
                if (data.error)
                {
                    this.setState({error: data.error})
                }
                else
                {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        photo: "",
                        redirectToProfile: true
                    })
                    
                }
            })
        }
    };
    
    tagChecked = (name) => event => {
        this.setState({tagCheck: true, open: false});
        
        let flag = event.target.checked;
        let index = tagNames.indexOf(name);
        //console.log(index);
        let arr = this.state.tags;
        arr[index] = flag ? 1:0;
        this.setState({ tags: arr });
        this.postData.set("tags", arr);
    }

    createCheckbox = label => (
        <label className="btn btn-primary" key={tagNames.indexOf(label)}>
            <input type="checkbox" className="form-check-input" onChange={this.tagChecked(label)} checked={!!(this.state.tags[tagNames.indexOf(label)])} />
                {label}
        </label>
    )

    createCheckboxes = () => (
        tagNames.map(this.createCheckbox)
    )
    
    tagsForm = () => (
        <div className="form-group">
            <label className="text-muted">Event Tags</label>
            <br />
            <div className="button-group ml-5 mr-5" >
                
                {this.createCheckboxes()}

            </div>
        </div>
    )


    editPostForm = (id, title, body, venue, dateAndTime) => (

        <form>
            <div className="form-group">
                <label className="text-muted">Image</label>
                <input onChange={this.handleChange("photo")} type="file" className="form-control" accept="image/*"/>
            </div>
            
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Venue</label>
                <input onChange={this.handleChange("venue")} type="text" className="form-control" value={venue}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Date and Time</label>
                <input onChange={this.handleChange("dateAndTime")} type="text" className="form-control" value={dateAndTime}/>
            </div>
            

            {this.tagsForm()}
            <div className="d-inline-block">
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary mr-5">Update Event</button>
                <Link to={`/post/${id}`} className="btn btn-raised btn-danger">Cancel</Link>
            </div>

        </form>
    )

    render() {
        const {id, title, body, venue, dateAndTime, error, defaultImage, imagePath, redirectToProfile, loading} = this.state;

        if (redirectToProfile)
        {
            return <Redirect to={`/post/${id}`} />
        }
        
        return (
            <div className="container">
                <h2 className="mt-5 md-5">Edit Event</h2>

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ): (
                    ""  
                )}

                {
                    defaultImage ? 
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`}
                                    alt={title}
                                    onError={i => i.target.src = `${DefaultPost}`}                     
                                />
                                <figcaption className="figure-caption">Existing Event Image</figcaption>
                            </figure>
                        )
                        :
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={imagePath}                
                                    alt={title} 
                                />
                                <figcaption className="figure-caption">Image to be uploaded</figcaption>
                            </figure>  
                        )
                }   

                {isAuthenticated().user.role === "admin" ||
                    (isAuthenticated().user._id === id &&
                        this.editPostForm(id, title, body, venue, dateAndTime))}
            </div>
        )
    }
}

export default EditPost;