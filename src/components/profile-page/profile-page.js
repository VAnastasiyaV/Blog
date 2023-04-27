import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { message } from 'antd';
import SignSample from '../sign-sample/sign-sample';
import Spinner from '../spinner';
import { update } from "../../redux/reduser/auth";

import '../sign-up-page/sign-up-page.scss';

function ProfilePage() {
   const [loading, setLoading] = useState(false);
   const [isUpdate, setIsUpdate] = useState(false);
   const { handleSubmit, register, formState: { errors } } = useForm();
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.auth);

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
               if (!!res.payload) {
                  setIsUpdate(true);
                  localStorage.setItem(`favorited`, JSON.stringify(favoriteArticles));
                  message.success('The profile has been update');
                  setLoading(false);
               }
            })
         }).catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   };

   const invalidName = !!errors.name
      ? <p className='sign-up-page__invalid'>Your name needs to be at least 3 characters.</p>
      : null;
   const invalidClassName = !!errors.name ? ' sign-up-page__input--invalid' : '';
   const invalidPassword = !!errors.password
      ? <p className='sign-up-page__invalid'>Your password needs to be at least 6 characters.</p>
      : null;
   const invalidClassPassword = !!errors.password ? ' sign-up-page__input--invalid' : '';

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
               <input className={'sign-up-page__input' + invalidClassName}
                  {...register("name", { value: user.username, required: true, pattern: /[A-Za-zА-Яа-яЁё0-9]{1}[A-Za-zА-Яа-яЁё0-9\s]{2,19}/ })}
                  type="text"
                  title="Your name needs to be at least 3 characters. Only letters or numbers,space can't be the first"
                  placeholder="Username"
                  autoFocus
               />
            </label>
            {invalidName}
            {errors.email && errors.email.message}

            <label className='sign-up-page__label'>
               Email address
               <input className='sign-up-page__input'
                  {...register("email", { value: user.email, required: true })}
                  type="email"
                  placeholder="Email address" />
            </label>

            <label className='sign-up-page__label'>
               New password
               <input className={'sign-up-page__input' + invalidClassPassword}
                  {...register("password", { required: true, pattern: /[^\s]{6,40}/ })}
                  type="password"
                  title="Your password needs to be at least 6 characters.Your password can't contain spaces"
                  placeholder="New password" />
            </label>
            {invalidPassword}

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