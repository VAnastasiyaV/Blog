import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { message } from 'antd';
import { clearMessage } from "../../redux/reduser/message";
import { getArticles } from "../../redux/reduser/article";
import Spinner from '../spinner';

import '../header/header.scss';
import '../sign-sample/sign-sample.scss';
import './new-article.scss';

const NewArticle = ({ title1, description1, body1, tagList1, action, pageTitle }) => {
   const [loading, setLoading] = useState(false);
   const [created, setCreated] = useState(false);
   const [tags, setTags] = useState(tagList1);
   const { user } = useSelector((state) => state.auth);
   const { currentPage } = useSelector((state) => state.articles);
   const { currentArticle } = useSelector((state) => state.articles);
   const message1 = useSelector((state) => state.message.message);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(clearMessage());
   }, [dispatch]);

   const { handleSubmit, register, formState: { errors } } = useForm();

   const onSubmit = ({ title, description, text, ...data }) => {
      const token = user.token;
      const slug = !currentArticle ? '' : currentArticle.slug;
      setLoading(true);
      const tagsArr = Object.entries(data).length !== 0 ? Object.values(data) : [];
      let tagsList = [...new Set(tagsArr)];
      dispatch(action({
         title, description, text, tagsList, token, slug
      }))
         .then((response) => {
            setLoading(false);
            message.success('The article has been created/update');
            const offset = (currentPage - 1) * 5;
            dispatch(getArticles(offset));
            setCreated(true);
            return;
         })
         .catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   };

   if (created) {
      return <Redirect to='/articles/' />
   };

   if (!!loading)
      return <Spinner />

   const tagList = tags.map((tag, index) => {
      return (
         <li key={index} className='new-article__tags'>
            <input className='new-article__input new-article__width30vw'
               {...register(`tag${index}`,
                  {
                     value: tag,
                     required: {
                        value: true,
                        message: 'The tag is required. If you do not want to complete, delete it before sending the form.'
                     }
                  }
               )}
               style={{ borderColor: errors[`tag${index}`] && "red" }}
               type="text"
               placeholder="Tag"
            />
            <button type="button" className='header__link  header__link--height40px header__link--border header__link--red'
               onClick={() => setTags((tags) => tags.filter((item, index1) => index1 !== index))}>
               Delete
            </button>
            {errors[`tag${index}`] && <p className='new-article__tagsError'>{errors[`tag${index}`].message}</p>}
         </li >
      )
   });

   return (
      <div className='new-article'>
         <h1 className='new-article__h1'>{pageTitle}</h1>
         <form className='new-article__form' id='Create new article'
            onSubmit={handleSubmit(onSubmit)}
            method="POST">
            <label>
               Title
               <input className='new-article__input'
                  {...register("title", {
                     value: title1,
                     required: {
                        value: true,
                        message: 'This field is required.'
                     }, maxLength: {
                        value: 5000,
                        message: 'Too long title'
                     }
                  })}
                  style={{ borderColor: errors.title && "red" }}
                  type="text"
                  placeholder="Title"
                  autoFocus
               />
               {errors.title && <p style={{ marginTop: 5, color: 'red' }}>{errors.title.message}</p>}
            </label>

            <label>
               Short description
               <input className='new-article__input'
                  {...register("description", {
                     value: description1,
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  style={{ borderColor: errors.description && "red" }}
                  type="text"
                  placeholder="Title"
               />
               {errors.description && <p style={{ marginTop: 5, color: 'red' }}>{errors.description.message}</p>}
            </label>

            <label>
               Text
               <textarea
                  className='new-article__input new-article__auto-height'
                  {...register("text", {
                     value: body1,
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  style={{ borderColor: errors.text && "red" }}
                  type="text"
                  rows="5"
                  placeholder="Text"
               />
               {errors.text && <p style={{ marginTop: 5, color: 'red' }}>{errors.text.message}</p>}
            </label>

            <label>
               Tags
            </label>

            <div className='new-article--flex'>
               <ul>
                  {tagList}
               </ul>
               <button type="button" className='header__link  header__link--height40px header__link--border header__link--blue'
                  onClick={() => {
                     setTags((tags) => tags.length !== 0
                        ? [...tags, '']
                        : [''])
                  }}>
                  Add tag
               </button>
            </div>

            {!!message1 && (
               <div className="">
                  <div className="alert alert-danger" role="alert">
                     {message1}
                  </div>
               </div>
            )}

            <button className='new-article__button'>
               Send
            </button>

         </form >
      </div >
   );
};

export default NewArticle;
