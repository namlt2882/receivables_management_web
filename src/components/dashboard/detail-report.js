import React from 'react';
import Component from '../common/component'
import { available1 } from '../common/loading-page';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'

import './report.scss';

class DetailReport extends Component {
    componentDidMount() {
        available1();
        document.title = 'Dashboard';
    }
    render() {
        return (
            <div className="hungdtq-Wrapper">
                <div className="hungdtq-Container">
                </div>
            </div>
        );
    }
}

export default DetailReport;
