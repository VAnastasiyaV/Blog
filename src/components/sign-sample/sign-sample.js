import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from "../../redux/reduser/message";

import './sign-sample.scss';

function SignSample({ title, body, footer,
   handleSubmit, titleBtn, notAvaliable = '' }) {
   const { message1 } = useSelector((state) => state.message);

   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(clearMessage());
   }, [dispatch]);

   return (
      <div className='sign-sample'>
         <h1 className='sign-sample__h1'>{title}</h1>
         <form className='sign-sample__form' id={title}
            onSubmit={handleSubmit}
            method="POST">
            {body}

            {!!message1 && (
               <div className="">
                  <div className="alert alert-danger" role="alert">
                     {message1}
                  </div>
               </div>
            )}

            <input type="submit" className={'sign-sample__button' + notAvaliable} value={titleBtn} />
         </form>

         {footer}
      </div >
   );
};

export default SignSample;