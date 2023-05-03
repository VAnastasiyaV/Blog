import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { message } from 'antd';
import SignSample from '../sign-sample/sign-sample';
import Spinner from '../spinner';
import { update, resetUserError } from "../../redux/reduser/auth";

import '../sign-up-page/sign-up-page.scss';

function ProfilePage() {
   const [loading, setLoading] = useState(false);
   const [isUpdate, setIsUpdate] = useState(false);
   const { handleSubmit, register, formState: { errors } } = useForm();
   const dispatch = useDispatch();
   const { user, userErrors } = useSelector((state) => state.auth);
   let errorName;
   let errorEmail;

   // проверяем существование картинки профиля
   const isImgUrl = (url) => {
      const img = new Image();
      img.src = url;
      return new Promise((resolve) => {
         img.onerror = () => resolve(false);
         img.onload = () => resolve(true);
      });
   }

   const onSubmit = ({ name, email, password, image }) => {
      const { token, username } = user;
      setLoading(true);
      let favoriteArticles = JSON.parse(localStorage.getItem(`favorited`));

      // меняем username в массиве статей с лайками(в localStorage)
      if (`${name}` !== `${username}`) {
         let myFavorite = favoriteArticles.filter(item => !!item[username] === true);

         if (myFavorite.length > 0) {
            myFavorite = { [name]: myFavorite[0][username] };
            favoriteArticles = favoriteArticles.filter((item) => !!item[username] === false);
            favoriteArticles = [...favoriteArticles, myFavorite];
         };
      };

      isImgUrl(image)
         .then(res => {
            const isUpdating = res === true
               ? dispatch(update({ token, name, email, password, image }))
               : dispatch(update({ token, name, email, password, image: '' }));
            isUpdating.then(res => {
               if (!!res.payload.user) {
                  setIsUpdate(true);
                  localStorage.setItem(`favorited`, JSON.stringify(favoriteArticles));
                  message.success('The profile has been update');
                  setLoading(false);
               } else {
                  setLoading(false);
               }
            })
         }).catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   };
   if (userErrors) {
      errorName = Object.keys(userErrors).includes("username") ? `username: ${userErrors.username}` : null;
      errorEmail = Object.keys(userErrors).includes("email") ? `email: ${userErrors.email}` : null;
   }

   errorName = errors.name ? errors.name.message : errorName;
   errorEmail = errors.email ? errors.email.message : errorEmail;

   if (!!loading)
      return <Spinner />;

   if (isUpdate)
      return <Redirect to="/articles/" />;

   return (
      <SignSample
         title={'Edit Profile'}
         titleBtn={'Save'}
         handleSubmit={handleSubmit(onSubmit)}
         notAvaliable={user ? '' : ' sign-sample__button--grey'}
         body={<>
            <label className='sign-up-page__label'>
               Username
               <input className='sign-up-page__input'
                  {...register("name", {
                     onChange: () => dispatch(resetUserError()),
                     value: user.username,
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                     pattern: {
                        value: /^(?! )(?!.* $)[\s\S]{3,19}$/,
                        message: "Your name needs to be at least 3 characters. Space can't be the first or the last"
                     },
                  })}
                  style={{ borderColor: errorName && "red" }}
                  type="text"
                  placeholder="Username"
                  autoFocus
               />
            </label>
            {errorName
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errorName}</p>}

            <label className='sign-up-page__label'>
               Email address
               <input className='sign-up-page__input'
                  {...register("email", {
                     onChange: () => dispatch(resetUserError()),
                     value: user.email,
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  style={{ borderColor: errorEmail && "red" }}
                  type="email"
                  placeholder="Email address" />
            </label>
            {errorEmail
               && <p style={{ marginTop: 5, color: 'red' }}>{errorEmail}</p>}

            <label className='sign-up-page__label'>
               New password
               <input className='sign-up-page__input'
                  {...register("password", {
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                     pattern: {
                        value: /^(?! )(?!.* $)(?!(?:.* )).*[\s\S]{6,40}$/,
                        message: "Your password needs to be at least 6 characters.Your password can't contain spaces"
                     },
                  })}
                  style={{ borderColor: errors.password && "red" }}
                  type="password"
                  placeholder="Password" />
            </label>
            {errors.password
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errors.password.message}</p>}

            <label className='sign-up-page__label'>
               Avatar image (url)
               <input className={'sign-up-page__input'}
                  {...register("image", { value: user.image || '', pattern: /[^\s]{6,40}/ })}
                  type="text"
                  placeholder="Avatar image" />
            </label>
         </>}
      />
   );
}

export default ProfilePage;