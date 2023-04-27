import React from 'react';
import { create } from '../../redux/reduser/article';
import NewArticle from '../new-article';

import '../header/header.scss';
import '../sign-sample/sign-sample.scss';

const NewArticlePage = () => {

   return (
      <NewArticle
         pageTitle='Create new article'
         title1=''
         description1=''
         body=''
         tagList1={['']}
         action={create} />
   );
}

export default NewArticlePage;
