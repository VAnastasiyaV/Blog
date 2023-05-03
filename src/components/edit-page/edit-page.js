import React from 'react';
import { useSelector } from 'react-redux';
import { edit } from "../../redux/reduser/article";
import NewArticle from '../new-article';

import '../header/header.scss';
import '../sign-sample/sign-sample.scss';
import '../new-article/new-article.scss';

const EditPage = () => {
   const { currentArticle } = useSelector((state) => state.articles);

   const { title, description, body, tagList } = currentArticle;

   return (
      <NewArticle
         pageTitle='Edit article'
         title1={title}
         description1={description}
         body1={body}
         tagList1={tagList}
         action={edit} />
   );
};

export default EditPage;
