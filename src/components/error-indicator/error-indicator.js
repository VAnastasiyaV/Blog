import React from 'react';
import { Alert, Space } from 'antd';

import './error-indicator.scss';
import icon from './error-icon.svg';

function ErrorIndicator() {
    return (
        <div className="error-indicator">
            <img className='error-indicator__icon' src={icon} alt="error icon" />
            <p className='error-indicator__oops'>OOPS!</p>
            <Space direction="vertical">
                <Alert message="somthing has gone wrong" type="error" />
            </Space>
        </div >
    )
};

export default ErrorIndicator;