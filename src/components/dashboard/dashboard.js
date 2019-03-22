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

            <div className="container-fluid">
                <div className="hungdtq-header">
                    <h1>Dashboard</h1>
                    <hr></hr>
                </div>
            </div>

        );
    }
}

export default Dashboard;
