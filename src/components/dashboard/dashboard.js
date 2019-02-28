import React from 'react';
import Component from '../common/component'
import { available1 } from '../common/loading-page';

class Dashboard extends Component {
    componentDidMount() {
        available1();
        document.title = 'Dashboard';
    }
    render() {
        return (
            
            <div className="container">
                <h1>Nội dung trang chủ</h1>
            </div>
            
        );
    }
}

export default Dashboard;
