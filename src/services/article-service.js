const apiBase = 'https://blog.kata.academy/api/';

const processResponse = (response) => {
    if (!!response.article) {
        return response.article;
    }

    if (!!response.errors) {
        const value = Object.values(response.errors);
        const errorMessage = `${value[1].code}`;
        throw new Error(errorMessage);
    }
}

export const createArticle = (title, description, body, tagList, token) => {
    return fetch(`${apiBase}articles`, {
        method: 'POST',
        body: JSON.stringify({
            "article": {
                title,
                description,
                body,
                tagList
            }
        }),
        headers: {
            Authorization: `Token ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => {
        return response.json();
    }).then((response) => {
        return processResponse(response);
    }).catch((error) => {
        throw new Error(error);
    });
};

export const getArticles = (offset) => {
    return fetch(`${apiBase}articles?limit=5&offset=${offset}`)
        .then(response => {
            if (response.status > 199 && response.status < 300) {
                return response.json();
            }
            throw new Error();
        }).catch((error) => {
            throw new Error(error);
        });
}

export const getCurrentArticle = async (slug) => {
    return fetch(`${apiBase}articles/${slug}`
    ).then(response => {
        return response.json();
    }).then((response) => {
        return processResponse(response);
    }).catch((error) => {
        throw new Error(error);
    });
};

export const editArticle = (title, description, body, tagList, token, slug) => {
    return fetch(`${apiBase}articles/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({
            "article": {
                title,
                description,
                body,
                tagList
            }
        }),
        headers: {
            Authorization: `Token ${token}`,
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => {
        return response.json();
    }).then((response) => {
        return processResponse(response);
    }).catch((error) => {
        throw new Error(error);
    });
};

export const likeArticle = (slug, token) => {
    return fetch(`${apiBase}articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
        },
    }).then(response => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

export const dislikeArticle = (slug, token) => {
    return fetch(`${apiBase}articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
        },
    }).then(response => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

export const deleteArticle = (slug, token) => {
    return fetch(`${apiBase}articles/${slug}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
        },
    }).then(response => {
        return response;
    }).catch((error) => {
        throw new Error(error);
    });
};

const ArticleService = {
    getArticles,
    getCurrentArticle,
    createArticle,
    deleteArticle,
    editArticle,
    likeArticle,
    dislikeArticle,
}

export default ArticleService;
