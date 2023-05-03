import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePage } from "../../redux/reduser/article";
import { Pagination } from 'antd';

import './footer.scss';

function Footer() {
    const { currentPage } = useSelector((state) => state.articles);
    const dispatch = useDispatch();

    return (
        <footer className='footer'>
            <Pagination
                defaultCurrent={currentPage}
                current={currentPage}
                pageSize={1}
                total={50}
                showSizeChanger={false}
                onChange={(page) => dispatch(changePage(page))} />
        </footer>
    );
};

export default Footer;



