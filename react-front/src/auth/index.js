export const signup = (user) => {
    // POST request using: fetch or axios
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(user)
    })
    // if success
    .then(response => {
        return response.json();
    })
    // if error
    .catch(err => console.log(err));
}; 

export const signin = (user) => {
    // POST request using: fetch or axios
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(user)
    })
    // if success
    .then(response => {
        return response.json();
    })
    // if error
    .catch(err => console.log(err));
};  

export const authenticate = (jwt, next) => {
    if(typeof window !== "undefined")
    {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
}


export const signout = (next) => {
    // two checks need to be performed
    // delete token from browser local storage
    if (typeof window !== "undefined")
    {
        localStorage.removeItem("jwt");
    }
    
    next(); // callback function that redirects user to a certain page. Done in client side
    
    // set token as valid at the backend. Server Side
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
    .then(response => {
       return response.json() 
    })
    .catch(err => console.log(err))
};


export const isAuthenticated = () => {
    if (typeof window == "undefined")
    {
        return false;
    }

    if (localStorage.getItem("jwt"))
    {
        return JSON.parse(localStorage.getItem("jwt"));
    }
    else
    {
        return false;
    }
}


export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
 
export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};


export const socialLogin = user => {
    // POST request using: fetch or axios
    return fetch(`${process.env.REACT_APP_API_URL}/social-login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(user)
    })
    // if success
    .then(response => {
        return response.json();
    })
    // if error
    .catch(err => console.log(err));
}