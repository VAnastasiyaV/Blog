import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { message } from 'antd';
import SignSample from '../sign-sample';
import Spinner from '../spinner'
import { login, resetUserError } from "../../redux/reduser/auth";

import '../sign-up-page/sign-up-page.scss';
import './sign-in-page.scss';

const SignInPage = () => {
   const { isLoggedIn, userErrors, loading } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const { handleSubmit, register, formState: { errors } } = useForm();
   let errorPassword;

   const onSubmit = ({ email, password }) => {
      dispatch(login({
         email, password
      }))
         .catch((error) => {
            message.error(`${error}`);
         });
   };

   errorPassword = userErrors ? `${Object.keys(userErrors)[0]}: ${Object.values(userErrors)[0]}` : null
   errorPassword = errors.password ? errors.password.message : errorPassword;

   if (!!isLoggedIn)
      return <Redirect to="/articles/" />;

   if (loading)
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
                     onChange: () => dispatch(resetUserError()),
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  style={{ borderColor: errorPassword && userErrors && "red" }}
                  type="email"
                  placeholder="Email address"
                  required
                  autoFocus
               />
            </label>

            <label className='sign-up-page__label'>
               Password
               <input className='sign-up-page__input'
                  {...register("password", {
                     onChange: () => dispatch(resetUserError()),
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                     pattern: {
                        value: /^(?! )(?!.* $)(?!(?:.* )).*[\s\S]{6,40}$/,
                        message: "Your password needs to be at least 6 characters.Your password can't contain spaces"
                     },
                  })}
                  style={{ borderColor: errorPassword && "red" }}
                  type="password"
                  placeholder="Password"
               />
            </label>
            {errorPassword
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errorPassword}</p>}
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
