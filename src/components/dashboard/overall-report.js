import React from 'react';
import Component from '../common/component'
import { available1 } from '../common/loading-page';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'

import './report.scss';

class OverallReport extends Component {
    componentDidMount() {
        available1();
        document.title = 'Dashboard';
    }
    render() {
        return (
            <div className="hungdtq-Wrapper">
                <div style={{ display: "inline", float: "left" }}>

                    <CardDeck className="deck">
                        <Card
                            className="report-card"
                            bg="danger"
                        >
                            <Card.Body>
                                <Card.Text>
                                    {this.props.NumberOfCanceledReceivables}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                Canceled
                            </Card.Footer>
                        </Card>
                        <div>

                            <Card
                                className="report-card"
                                bg="warning"
                            >
                                <Card.Body>
                                    <Card.Text>
                                        {this.props.NumberOfPendingReceivables}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    Pending
                            </Card.Footer>
                            </Card>
                            <Card
                                className="report-card"
                                bg="info"
                            >
                                <Card.Body>
                                    <Card.Text>
                                        {this.props.NumberOfDoneReceivables}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    Complete the process
                            </Card.Footer>
                            </Card>
                        </div>


                        <div>
                            <Card
                                className="report-card"
                                bg="primary"
                            >
                                <Card.Body>
                                    <Card.Text>
                                        {this.props.NumberOfCollectingReceivables}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    In collecting progress
                            </Card.Footer>
                            </Card>
                            <Card
                                className="report-card"
                                bg="success"
                            >
                                <Card.Body>
                                    <Card.Text>
                                        {this.props.NumberOfRecoveredReceivables}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    Closed
                            </Card.Footer>
                            </Card>
                        </div>

                    </CardDeck>
                </div>

                <div style={{ display: "inline", float: "left" }}>
                    {this.props.renderReportData}

                </div>
            </div >

        );
    }
}

export default OverallReport;
