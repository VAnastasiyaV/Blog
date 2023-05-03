import React, { } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from "../../redux/reduser/auth";
import { changePage } from "../../redux/reduser/article";
import avatar from './avatar.png';

import './header.scss';

function Header() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let rightSection;

    if (!!isLoggedIn && !!currentUser) {
        rightSection =
            <>
                <Link to='/new-article' className='header__link header__link--small header__link--green'>
                    Create article
                </Link>
                <Link to='/profile' className='header__btn header__btn--margin'>
                    {currentUser.username}
                    <img src={currentUser.image || avatar} alt="Aватарка" className='header__avatar'></img>
                </Link>
                <button className='header__btn' onClick={() => dispatch(logout())}>
                    <Link to='/articles' className='header__link header__link--padding header__link--border'>
                        Log Out
                    </Link>
                </button>
            </>;
    } else {
        rightSection = <> <Link to='/signin' className='header__link header__link--padding'>
            Sign in
        </Link>
            <Link to='/signup' className='header__link header__link--padding'>
                Sign up
            </Link>
        </>
    }

    return (
        <header className='header'>
            <button className='header__btn' onClick={() => dispatch(changePage(1))}>
                <Link to='/articles/' className='header__link header__link--no-margin'>
                    Realword Blog
                </Link>
            </button>
            <div className='header__menu'>
                {rightSection}
            </div >
        </header>
    )
};

export default Header;