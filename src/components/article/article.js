import React, { } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Space, Tag } from 'antd';
import whiteHeart from './article-white-heart.png';
import redHeart from './article-red-heart.png';

import './article.scss';

function Article({ data, classNameLink, classNameDescrip, classNameTag,
    classNameDate, onItemSelected, onLiking, headerBtn,
    ...props }) {
    const { tagList,
        slug, favoritesCount, updatedAt, description, author } = data;
    const title = !data.title ? 'No title' : data.title;
    const { user } = useSelector((state) => state.auth);
    const username = user !== null ? user.username : 'unauthorized';

    const taglist = tagList.length === 0
        ? null
        : tagList.map((item, index) => {
            item = item.trim();
            if (!!item) {
                return (<Tag className={`article__tag ${classNameTag}`} key={index}>{item}</Tag>)
            } else {
                return null;
            }
        });

    const getDate = (date) => {
        const month = format(new Date(date), 'MMMM');
        const day = format(new Date(date), 'dd');
        const year = format(new Date(date), 'yyyy');
        return `${month} ${day}, ${year}`
    };

    let favorite;
    if (!localStorage.getItem(`favorited`) || !user) {
        favorite = false;
    } else {
        const favoriteArticles = JSON.parse(localStorage.getItem(`favorited`));
        const myFavorite = favoriteArticles.filter(item => !!item[user.username] === true);
        if (myFavorite.length > 0) {
            favorite = myFavorite[0][username].includes(slug) ? true : false;
        } else {
            favorite = false;
        }
    }

    return (
        <article className='article'>
            <div className='article__title'>
                <button className='article__btn article__btn--min-width'
                    onClick={onItemSelected}>
                    <Link to={`/articles/${slug}`} className={`article__link ${classNameLink}`}>{title}</Link>
                </button>
                <button className='article__btn article__btn--margin' onClick={onLiking}>
                    <img className='article__img'
                        src={favorite ? redHeart : whiteHeart}
                        alt='heart' />
                    <strong>{favoritesCount}</strong>
                </button>
            </div>
            <div className='article__name'>
                {author.username}
                <time className={`article__date ${classNameDate}`}>
                    {getDate(updatedAt)}
                </time>
            </div>
            <img className='article__avatar' src={author.image} alt='avatar' />
            <Space size={[0, 8]} >
                {taglist}
            </Space>
            {headerBtn}
            <div className={`article__text ${classNameDescrip}`}>
                {description.trim()}
            </div>
            {props.children}
        </article >
    )
};

export default Article;