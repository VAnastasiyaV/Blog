import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";
import { message } from 'antd';
import { getCurrentArticle } from "../../redux/reduser/article";
import { clearMessage } from "../../redux/reduser/message";
import Article from '../article';

import './articles-list.scss';

function ArticlesList({ history }) {
    const { allArticles } = useSelector((state) => state.articles);
    const { message1 } = useSelector((state) => state.message);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const like = () => {
        message.warning('First open the article');
    };

    const elements = allArticles.map((item) => {
        const id = item.slug;
        return (
            <li key={id}>
                <Article
                    data={item}
                    onItemSelected={() => {
                        dispatch(getCurrentArticle(id)).then(res => {
                            history.push(`/articles/${id}`);
                        });
                        return;
                    }}
                    onLiking={like}
                />
            </li>
        )
    });

    return (
        <>
            <ul className='articles-list'>
                {elements}
            </ul>

            {!!message1 && (
                <div className="">
                    <div className="alert alert-danger" role="alert">
                        {message1}
                    </div>
                </div>
            )}
        </>
    )
};

export default withRouter(ArticlesList);