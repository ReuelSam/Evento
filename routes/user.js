const express = require('express');     // to be able to use express router
const { 
    userById, 
    allUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    hasAuthorization,
     userPhoto, 
     addFollowing, 
     addFollower, 
     removeFollowing, 
     removeFollower, 
     findPeople,
     updateTags,
     attend,
     unattend,
     getPostAttend,
     cluster
} = require('../controllers/user');
const {requireSignin} = require('../controllers/auth')

const router = express.Router();

// follow and unfollow
router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);
router.put('/user/update/tags', requireSignin, updateTags);

router.put('/user/post/attend', requireSignin, attend);
router.put('/user/post/unattend', requireSignin, unattend);

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization ,updateUser);                 // put is for updating. patch is for small changes. put is for the entire instance
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);              // delete method 

// photo
router.get("/user/photo/:userId", userPhoto);  

// who to follow - recommendation
router.get('/user/findpeople/:userId', requireSignin, cluster, findPeople)

router.get('/user/attend/:userId', requireSignin, getPostAttend);

// any route that contains userId, the app will first execute userById()
router.param("userId", userById);

module.exports = router;