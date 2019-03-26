import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import appReducers from './reducers/index';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import 'hammerjs'
import 'react-notifications/lib/notifications.css';
import './index.scss';

const store = createStore(
    appReducers,
    // Connect với extension redux-devtools trên chrome để kiểm tra dữ liệu có lưu trên store không?
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),

    // Redux-thunk giải quyết vấn đề async acion (bất đồng bộ về thời gian giữa fetch data từ api và dispatch action trong redux)
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
