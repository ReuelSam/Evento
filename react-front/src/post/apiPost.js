export const create = (userId, token, post) => {
    console.log(post);
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const list = (loadAll, option, userId, page) => {
    console.log(userId);
    if ( loadAll )
    {    
        if (option === 0)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
        if (option === 1)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/oldest/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
        if (option === 2)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/popular/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
    }
    else
    {
        if (option === 0)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/${userId}/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
        if (option === 1)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/oldest/${userId}/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
        if (option === 2)
        {
            return fetch(`${process.env.REACT_APP_API_URL}/posts/popular/${userId}/?page=${page}`, {
                method: "GET"
            })
            .then(response => {
                // promise will return response whether failure or success
                // but the response needs to be handled here. This is where we handle it
                return response.json();
            })
            .catch(error => console.log(error))
        }
    }
}

export const singlePost = postId => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}

export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "DELETE",
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

export const update = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(response => {
        // promise will return response whether failure or success
        // but the response needs to be handled here. This is where we handle it
        return response.json();
    })
    .catch(error => console.log(error))
}

export const like = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
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

export const unlike = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
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

export const notInterested = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/notInteresed`, {
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

export const undoNotInterested = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/notInteresed/undo`, {
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


export const comment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}

export const uncomment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.log(error))
}