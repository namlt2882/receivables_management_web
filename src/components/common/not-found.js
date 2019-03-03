import React, { Component } from 'react';
import { available1 } from './loading-page';

class NotFoundPage extends Component {
    componentDidMount() {
        document.title = 'Not found!'
        available1();
    }
    render() {
        return (

            <div className="container">
                <div className="alert alert-danger">
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <strong>404!</strong> Not found...
               </div>
            </div>

        );
    }
}

export default NotFoundPage;
