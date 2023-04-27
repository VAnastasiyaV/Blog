import React, { useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { message } from 'antd';
import SignSample from '../sign-sample';
import Spinner from '../spinner'
import { login } from "../../redux/reduser/auth";

import '../sign-up-page/sign-up-page.scss';
import './sign-in-page.scss';

const SignInPage = () => {
   const [loading, setLoading] = useState(false);
   const { isLoggedIn } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const { handleSubmit, register, formState: { errors } } = useForm();

   const onSubmit = ({ email, password }) => {
      setLoading(true);
      dispatch(login({
         email, password
      }))
         .then(setLoading(false))
         .catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   };

   if (!!isLoggedIn)
      return <Redirect to="/articles/" />;

   if (!!loading)
      return <Spinner />

   return (
      <SignSample
         title={'Sign In'}
         titleBtn={'Login'}
         handleSubmit={handleSubmit(onSubmit)}

         body={<>
            <label className='sign-up-page__label'>
               Email address
               <input className='sign-up-page__input'
                  {...register("email", {
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  style={{ borderColor: errors.email && "red" }}
                  type="email"
                  placeholder="Email address"
                  required
                  autoFocus
               />
            </label>
            {errors.email
               && <p style={{ marginTop: 5, color: 'red' }}>{errors.email.message}</p>}

            <label className='sign-up-page__label'>
               Password
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
                  placeholder="Password"
               />
            </label>
            {errors.password
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errors.password.message}</p>}
         </>}

         footer={
            <div>
               <span className='sign-up-page__link sign-up-page__link--grey'>Don’t have an account? </span>
               <Link to='/signup' className='sign-up-page__link'>
                  Sign Up.
               </Link>
            </div>
         }
      />
   );
};

export default withRouter(SignInPage);
