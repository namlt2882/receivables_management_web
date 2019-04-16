import React from 'react';
import Component from '../common/component'
import { available1 } from '../common/loading-page';
import Card from 'react-bootstrap/Card';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

import './report.scss';
import { CardGroup } from 'semantic-ui-react';

class RecentTable extends Component {
    componentDidMount() {
        available1();
        document.title = 'Dashboard';
    }

    render() {
        let num = this.props.reportNumber;

        return (
            <div className="hungdtq-Wrapper">
                <div className="hungdtq-Container">
                    <CardGroup className='deck recent-deck'>
                        <Card
                            style={{ width: "20%", maxHeight:'21em' }}
                            bg="light"
                        >
                            <Card.Title className="report-card-day-title">New today</Card.Title>
                            <Card.Body className='report-card-body'>
                                <Card.Text className="report-card-day-number" style={{ color: num == 0 ? '#3778c2' : 'red' }}>
                                    {num}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card
                            style={{ width: "78%" }}
                            bg="light"
                        >
                            <Card.Title className="report-card-day-title">
                                <strong>{this.props.title}</strong>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    {this.props.tableData}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                </div>
            </div>
        );
    }
}

export default RecentTable;