import React, { Component } from 'react';
import { list } from './apiPost';
import { Link } from 'react-router-dom';
import DefaultPost from '../images/event.jpg';
import { isAuthenticated } from '../auth';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];
const options = ["Recent", "Oldest", "Popular"];

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [null],
            loading: true,
            loadAll: false,
            option: 0,
            message: "Recent Events from Following",
            page: 1

        }
    }

    init = () => {
        console.log(this.state.loadAll ,this.state.option, options[this.state.option])
        // list method written in src/user/apiUser.js
        this.setState({loading: true, message: `${options[this.state.option]} Events from ${this.state.loadAll ? 'All Users' : 'Following'}`})
        this.loadPosts(this.state.page);        
    }

    loadPosts = page => {
        list(this.state.loadAll, this.state.option, isAuthenticated().user._id, page).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                this.setState({posts: data, loading: false});
            }
        })
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number, loading: true });
        this.loadPosts(this.state.page + number);
    };
 
    loadLess = number => {
        this.setState({ page: this.state.page - number, loading: true });
        this.loadPosts(this.state.page - number);
    };

    componentDidMount() {
        this.loadPosts(this.state.page);        
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

    
    checkLoadAll = () => event => {
        this.setState({loadAll: event.target.checked})
    }

    setOption = (value) => {
        this.setState({option: value});
    }

    renderFilters = () => {
        return (
            <div>
                
                
                <div className="jumbotron">

                <h3 className="mb-2">Filters</h3>

                    <center>
                    <label className="btn btn-primary ml-3">
                        <input type="checkbox" className="form-check-input" onChange={this.checkLoadAll()} checked={this.state.loadAll}/>
                        All Events
                    </label>
                   
                    <div className="dropdown d-inline">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {options[this.state.option]}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            
                                <button className="btn" style={{width: "170px"}} onClick={() => this.setOption(0)}>Recent</button>                                    
                           
                                <button className="btn" style={{width: "170px"}} onClick={() => this.setOption(1)}>Oldest</button>                                    
                           
                                <button className="btn" style={{width: "170px"}} onClick={() => this.setOption(2)}>Popular</button>                                    
                        </div>
                    </div>

                    <button onClick={this.init} className="btn btn-raised btn-primary mt-5 d-block">Filter</button>
                    </center>


                </div>
            </div>
        )
    }
    
    renderPosts = (posts) => {
        return (
            <div className="row">
            {   posts.map((post , i) => {
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

                    return (
                        <div className="card col-md-4 bg-light" key={i}>
                            
                            <div className="card-body">
                                <img 
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                    alt={post.title}
                                    onError={i => i.target.src = `${DefaultPost}`}
                                    className="img-thumbnail mb-3 "
                                    style={{height: "200px", width:"100%"}}    
                                />

                                
                                <h5 className="card-title" style={{fontSize: "1.75em"}}>{post.title}</h5>
                                <p className="card-text" style={{fontSize: "1.25em"}}>{post.body.substring(0, 100)}</p>
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
        const {posts, loading, page} = this.state;
        return (
            <div className="container">
                
                {this.renderFilters()}

                <h2 className="mt-5 mb-5">{this.state.message}</h2>

                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more posts" : ""}
                </h2>

                

                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : ( this.renderPosts(posts))}

                

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}
 
                {posts.length ? (
                    <button
                        className="btn btn-raised btn-primary mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}

            </div>
        )
    }
}

export default  Posts;