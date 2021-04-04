const express = require('express');     // to be able to use express router
const {
    getPosts, 
    createPost, 
    postsByUser, 
    postById, 
    isPoster, 
    deletePost, 
    updatePost,
    photo,
    singlePost,
    like,
    unlike,
    notInterested,
    undoNotInterested,
    comment,
    uncomment,
    getPostsFollow,
    getPostsOldest,
    getPostsFollowOldest,
    getPostsPopular,
    getPostsFollowPopular
} = require('../controllers/post');
const {requireSignin} = require('../controllers/auth')
const { userById, hasAuthorization } = require('../controllers/user');
const {createPostValidator} = require('../validator'); // index file automatically loads


const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/oldest', getPostsOldest);
router.get('/posts/popular', getPostsPopular);


// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);
router.put('/post/notInteresed', requireSignin, notInterested);
router.put('/post/notInteresed/undo', requireSignin, undoNotInterested);

// comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.get('/post/:postId', singlePost);
router.post('/post/new/:userId', requireSignin, hasAuthorization, createPost, createPostValidator);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

router.get('/posts/:userId', getPostsFollow);
router.get('/posts/oldest/:userId', getPostsFollowOldest);
router.get('/posts/popular/:userId', getPostsFollowPopular);



//photo
router.get("/post/photo/:postId", photo);

// any route that contains userId, the app will first execute userById()
router.param("userId", userById);
// any route that contains psotId, the app will first execute postById()
router.param("postId", postById);

module.exports = router;