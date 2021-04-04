export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const update = (userId, token, user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}




export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET"
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const updateUser = (user, next) => {
    if (typeof window !== 'undefined' ) 
    {
        if (localStorage.getItem('jwt'))
        {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
}

export const follow = (userId, token, followId) => {
    //console.log(userId, followId);
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, followId })
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const unfollow = (userId, token, unfollowId) => {
    //console.log(userId, followId);
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, unfollowId })
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}


export const findPeople = (userId, token ) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const updateTags = (userId, token, userTags) => {
    
    return fetch(`${process.env.REACT_APP_API_URL}/user/update/tags`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, userTags})
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}


export const attend = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/post/attend`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId})
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}

export const unattend = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/post/unattend`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId})
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}

export const getAttend = (userId, token) => {
    console.log("getAttend");
    return fetch(`${process.env.REACT_APP_API_URL}/user/attend/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}