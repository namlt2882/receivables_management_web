import React, { Component } from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { AuthService } from '../../../services/auth-service';
import { compareIntDate, numAsDate } from '../../../utils/time-converter';

class CurrentStage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let currentStage = this.props.currentStage;
        let remainDay = 0;
        let dayMark = '';
        if (currentStage) {
            remainDay = compareIntDate(this.props.currentDate, currentStage.endDate);
            if (remainDay > 0) {
                dayMark = ` (${remainDay} day left)`;
            }
            if (remainDay === 0) {
                dayMark = ' (will end Today)'
            }
        }

        return (<Container className='row current-stage' style={{
            margin: '0px 0px 15px 0px'
        }}>
            <Header>{currentStage ? 'Current stage' : <span>&nbsp;</span>}
                <span style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                    {dayMark}
                </span>
            </Header>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <Segment className='col-sm-12'>
                    <Grid columns='1'>
                        {currentStage ? <Grid.Column>
                            <table className='info-table'>
                                <tbody>
                                    <tr>
                                        <td>Stage:</td>
                                        <td>{currentStage.Name}</td>
                                    </tr>
                                    <tr>
                                        <td>Duration:</td>
                                        <td>{currentStage.Duration} day(s)</td>
                                    </tr>
                                    <tr>
                                        <td>Start at:</td>
                                        <td>{numAsDate(currentStage.startDate)}</td>
                                    </tr>
                                    <tr>
                                        <td>End at:</td>
                                        <td>{numAsDate(currentStage.endDate)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid.Column> : null}
                        {AuthService.isCollector() ? [<Grid.Column>
                            {currentStage ? <Divider /> : null}
                            {this.props.children}
                        </Grid.Column>] : null}
                    </Grid>
                </Segment>
            </div>
        </Container>);
    }
}

export default CurrentStage;