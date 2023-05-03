import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { message, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { clearMessage } from "../../redux/reduser/message";
import { deleteArticle } from "../../redux/reduser/article";
import { likeArticle, getArticles, dislikeArticle } from "../../redux/reduser/article";
import Article from '../article/article';
import Spinner from '../spinner';

import '../header/header.scss';
import './article-page.scss';

function ArticlePage({ articleId, history }) {
   const [isLoading, setLoading] = useState(false);
   const { currentArticle } = useSelector((state) => state.articles);
   const { currentPage } = useSelector((state) => state.articles);
   const { user } = useSelector((state) => state.auth);
   const { message1 } = useSelector((state) => state.message);
   const username = user !== null ? user.username : 'unauthorized';
   const slug = currentArticle !== null ? currentArticle.slug : 'unauthorized';
   const token = user !== null ? user.token : 'unauthorized';
   const offset = (currentPage - 1) * 5;
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(clearMessage());
   }, [dispatch]);

   const confirm = () => {
      dispatch(deleteArticle({ slug, token }))
         .then((response) => {
            if (response.payload >= 200 && response.payload < 300) {
               message.success('The article has been deleted');
               dispatch(getArticles(offset));
               return;
            } else throw new Error();
         }).catch((error) => {
            message.error(`${error}`);
         });
   }

   const cancel = () => {
      return;
   };

   const setFavoriteArticles = (favoriteArticles, action, array) => {
      dispatch(action)
         .then(() => {
            //удаляем из массива объект с ключом username и добавляем вместо него полученный
            favoriteArticles = favoriteArticles.filter(item => !!item[username] === false);
            favoriteArticles = [...favoriteArticles, { [username]: array }];
            localStorage.setItem(`favorited`, JSON.stringify(favoriteArticles));
            setLoading(false);
         }).catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   }

   const like = () => {
      if (username === 'unauthorized') return message.warning(`First you need to login `);
      setLoading(true);
      let favoriteArticles = !localStorage.getItem('favorited') ? [] : JSON.parse(localStorage.getItem('favorited'));
      //находим в массиве объектов объект с ключом username
      const myFavorite = favoriteArticles.filter(item => !!item[username] === true);
      const myFavorite_1 = myFavorite.length === 0
         ? { [username]: [] }
         : myFavorite[0];
      let favorites = myFavorite_1[username];

      if (favorites.includes(slug)) {
         setFavoriteArticles(
            favoriteArticles,
            dislikeArticle({ slug, token }),
            favorites.filter((item) => item !== slug));
      } else {
         setFavoriteArticles(
            favoriteArticles,
            likeArticle({ slug, token }),
            [...favorites, slug]);
      }
   }

   if (isLoading) return <Spinner />;
   if (!currentArticle) return <Redirect to='/articles/' />;

   const buttons = username === currentArticle.author.username
      ? <div className='article-page__btn-group'>
         <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="right">
            <button
               className='header__link  header__link--small header__link--border 
                    header__link--red'>
               Delete
            </button>
         </Popconfirm>
         <button onClick={() => { return history.push(`/articles/${articleId.id}/edit`) }}
            className='header__link  header__link--small header__link--green'>
            <Link className='header__link--green' to={`/articles/${articleId.id}/edit`}>
               Edit
            </Link>
         </button>
      </div>
      : null;

   return (
      <div className='article-page'>
         <Article data={currentArticle}
            classNameLink='article__link--full'
            classNameDescrip='article__text--full'
            classNameTag='article__tag--grey'
            classNameDate='article__date--auto-width'
            headerBtn={buttons}
            onLiking={like}>
            <ReactMarkdown
               className='markdown'
               children={currentArticle.body}
               remarkPlugins={[remarkGfm]}
            >
            </ReactMarkdown>
         </Article>

         {!!message1 && (
            <div className="">
               <div className="alert alert-danger" role="alert">
                  {message1}
               </div>
            </div>
         )}
      </div>
   );
};

export default withRouter(ArticlePage);