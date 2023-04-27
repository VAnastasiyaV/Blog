import React, { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Divider, message } from 'antd';
import { signUp } from "../../redux/reduser/auth";
import SignSample from '../sign-sample/sign-sample';
import Spinner from '../spinner';

import './sign-up-page.scss';

function SignUpPage() {
   const [newUser, setNewUser] = useState({ agreement: true });
   const [loading, setLoading] = useState(false);
   const { handleSubmit, register, formState: { errors } } = useForm();
   const dispatch = useDispatch();
   const invalidClassPasswordR = useRef('');
   const { isLoggedIn } = useSelector((state) => state.auth);

   const handleChangeAgreement = () => {
      setNewUser({ agreement: !newUser.agreement });
   }

   const onSubmit = ({ name, email, password, passwordRepeat }) => {
      invalidClassPasswordR.current = '';
      if (password !== passwordRepeat) return invalidClassPasswordR.current = ' sign-up-page__input--invalid';
      if (!newUser.agreement) return;

      setLoading(true);
      dispatch(signUp({ name, email, password }))
         .then(setLoading(false))
         .catch((error) => {
            message.error(`${error}`);
            setLoading(false);
         });
   };

   const invalidPasswordRepeat = invalidClassPasswordR.current === ''
      ? null
      : <p className='sign-up-page__input--invalid'>Passwords must match</p>;

   if (isLoggedIn)
      return <Redirect to="/articles/" />;

   if (!!loading)
      return <Spinner />;

   return (
      <SignSample
         title={'Create new account'}
         titleBtn={'Create'}
         handleSubmit={handleSubmit(onSubmit)}
         notAvaliable={newUser.agreement ? '' : ' sign-sample__button--grey'}
         body={<>
            <label className='sign-up-page__label'>
               Username
               <input className='sign-up-page__input'
                  {...register("name", {
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                     pattern: {
                        value: /^(?! )(?!.* $)[\s\S]{3,19}$/,
                        message: "Your name needs to be at least 3 characters. Space can't be the first or the last"
                     },
                  })}
                  style={{ borderColor: errors.name && "red" }}
                  type="text"
                  placeholder="Username"
                  autoFocus />
            </label>
            {errors.name
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errors.name.message}</p>}

            <label className='sign-up-page__label'>
               Email address
               <input className='sign-up-page__input'
                  {...register("email", {
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                  })}
                  type="email"
                  placeholder="Email address"
               />
            </label>
            {errors.email
               && <p style={{ marginTop: 5, color: 'red' }}>{errors.email.message}</p>}


            <label className='sign-up-page__label'>
               Password
               <input className={'sign-up-page__input' + invalidClassPasswordR.current}
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
               Repeat Password
               <input className={'sign-up-page__input' + invalidClassPasswordR.current}
                  {...register("passwordRepeat", {
                     required: {
                        value: true,
                        message: 'This field is required.'
                     },
                     pattern: {
                        value: /^(?! )(?!.* $)(?!(?:.* )).*[\s\S]{6,40}$/,
                        message: "Your password needs to be at least 6 characters.Your password can't contain spaces"
                     },
                  })}
                  style={{ borderColor: errors.passwordRepeat && "red" }}
                  type="password"
                  placeholder="Password" />
            </label>
            {errors.passwordRepeat
               && <p style={{ marginTop: 5, color: 'red', width: 350 }}>{errors.passwordRepeat.message}</p>}
            {invalidPasswordRepeat}

            <Divider />

            <div className='sign-up-page__container'>
               <input
                  id='sign-up-page-chekbox'
                  type='checkbox'
                  className='sign-up-page__checkbox'
                  onChange={handleChangeAgreement}
                  checked={newUser.agreement}
               />
               <label className='sign-up-page__label' htmlFor='sign-up-page-chekbox'>
                  <span>I agree to the processing of my personal
                     information</span>
               </label>
            </div>
         </>}

         footer={
            <div>
               <span className='sign-up-page__link sign-up-page__link--grey'>Already have an account? </span>
               <Link to='/signin' className='sign-up-page__link'>
                  Sign In.
               </Link>
            </ div>
         }
      />
   );
};

export default SignUpPage;
