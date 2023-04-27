import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Offline, Online } from "react-detect-offline";
import { message } from 'antd';
import { getArticles, } from "../../redux/reduser/article";
import { getUser } from "../../redux/reduser/auth";
import { clearMessage } from "../../redux/reduser/message";

import ErrorIndicator from '../error-indicator';
import Spinner from '../spinner';
import Header from '../header';
import Footer from '../footer';
import ArticleList from '../articles-list';
import ArticlePage from '../article-page';
import SignUpPage from '../sign-up-page';
import ProfilePage from '../profile-page';
import SignInPage from '../sign-in-page';
import NewArticlePage from '../new-article-page';
import EditPage from '../edit-page';

import './app.scss';

function App() {
  const dispatch = useDispatch();
  const { message1 } = useSelector((state) => state.message);
  const { currentPage, error, loading } = useSelector((state) => state.articles);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    const offset = (currentPage - 1) * 5;
    dispatch(getArticles(offset));
  }, [dispatch, currentPage]
  );

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUser(user.token));
    }
  }, [dispatch, user, isLoggedIn]
  );

  if (error) {
    return <ErrorIndicator />
  }

  if (!!message1) {
    message.error(`Can't get user: ${message1}`);
  }

  const load = !!loading ? <Spinner /> : null;

  return (
    <Router>
      <Switch>
        <Online>
          <div className="app">
            <Header />
            {load}
            <Route path="/articles/" component={ArticleList} exact />
            <Route path="/articles/:id/"
              render={({ match }) => {
                return < ArticlePage articleId={match.params} />
              }} exact
            />
            <Route path="/articles/:id/edit"
              render={({ match }) => {
                return < EditPage articleId={match.params} />
              }}
            />
            <Route path="/signin" component={SignInPage} exact />
            <Route path="/signup" component={SignUpPage} exact />
            <Route path="/profile" component={ProfilePage} exact />
            <Route path="/new-article" component={NewArticlePage} exact />
            <Route path="/articles/" component={Footer} exact />
            <Redirect to='/articles/' />
          </div>
        </Online>

        <Offline>
          <p className='app__offline'>You are offline right now. Check your connection.</p>
        </Offline>
      </Switch>
    </Router>
  );
};

export default App;
