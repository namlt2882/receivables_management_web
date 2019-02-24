import React, { Component } from 'react';

class NotFoundPage extends Component {
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
