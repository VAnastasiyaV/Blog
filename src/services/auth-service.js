const apiBase = 'https://blog.kata.academy/api/';

const signUp = (username, email, password) => {
    return fetch(`${apiBase}users`, {
        method: 'POST',
        body: JSON.stringify({
            user: {
                username,
                email,
                password,
            }
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => {
        return response.json()
    }).then(response => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

export const login = (email, password) => {
    return fetch(`${apiBase}users/login`, {
        method: 'POST',
        body: JSON.stringify({
            "user": {
                email,
                password
            }
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => {
        return response.json();
    }).then((response) => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

export const update = (token, username, email, password, image) => {
    return fetch(`${apiBase}user`, {
        method: 'PUT',
        body: JSON.stringify({
            "user": {
                username,
                email,
                password,
                image,
            }
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Token ${token}`,
        },
    }).then(response => {
        return response.json();
    }).then((response) => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = (token) => {
    return fetch(`${apiBase}user`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then(response => {
            return response.json();
        }).then((response) => {
            if (!!response.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
                return response.user;
            }
            if (!!response.errors) {
                const value = Object.values(response.errors);
                const errorMessage = `${value[1].code}`;
                throw new Error(errorMessage);
            }
        }).catch((error) => {
            throw new Error(error);
        });
};

const AuthService = {
    signUp,
    login,
    update,
    logout,
    getCurrentUser,
}

export default AuthService;
