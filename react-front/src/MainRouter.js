import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Home from './core/Home';
import Menu from './core/Menu';
import MenuMobile from './core/MenuMobile';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import FindPeople from './user/FindPeople';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';
import AttendPost from './post/AttendPost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import UnknownProfile from "./user/UnknownProfile";

const MainRouter = () => {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 700px)'
    })

    return ( 
        <div style={{fontFamily: "-moz-initial", backgroundColor:"#dce1e3", height: "100%"}}>
            { isDesktopOrLaptop && <Menu />}
            { !isDesktopOrLaptop && <MenuMobile />}

                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
                    <Route exact path="/users" component={Users}></Route>
                    <Route exact path="/signup" component={Signup}></Route>
                    <Route exact path="/signin" component={Signin}></Route>
                    <PrivateRoute exact path="/user" component={UnknownProfile} />
                    <PrivateRoute exact path="/user/:userId" component={Profile} />
                    <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
                    <PrivateRoute exact path="/user/findpeople/:userId" component={FindPeople} />
                    <PrivateRoute exact path="/user/post/new/:userId" component={NewPost} />
                    <PrivateRoute exact path="/post/:postId" component={SinglePost} />
                    <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
                    <PrivateRoute exact path="/user/Attending/:userId" component={AttendPost} />
                </Switch>
        </div>
    )
};

export default MainRouter;