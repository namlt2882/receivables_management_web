import React, { Component } from 'react';
import { numAsDate, compareIntDate } from '../../../utils/time-converter';
import { describeActionType, describeGroupActionFrequency } from './receivable-detail';
import { Container, Header, Segment, Grid, Divider } from 'semantic-ui-react';
import { AuthService } from '../../../services/auth-service';

class CurrentStage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let currentStage = this.props.currentStage;
        let remainDay = compareIntDate(this.props.currentDate, currentStage.endDate);
        let dayMark = ` (${remainDay} day left)`;
        if (remainDay === 0) {
            dayMark = ' (will end Today)'
        }


        return (<Container className='row current-stage' style={{ margin: '0px 0px 15px 0px' }}>
            <Header>Current stage
            <span style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                    {dayMark}
                </span>
            </Header>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <Segment className='col-sm-12'>
                    <Grid columns={AuthService.isManager() ? 1 : 2} relaxed='very'>
                        <Grid.Column>
                            <table className='deco-table' style={{ marginLeft: '20px' }}>
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
                        </Grid.Column>
                        {AuthService.isManager() ? null : <Grid.Column>
                            {this.props.children}
                        </Grid.Column>}
                    </Grid>
                    {AuthService.isManager() ? null : <Divider vertical />}
                </Segment>
                {/* <div className='col-sm-3'><b>Actions:</b></div>
                    <table className='col-sm-8'>
                        <tbody>
                            {currentStage.OriginalActions.map(oa => {
                                return <tr>
                                    <td>{describeActionType(oa.Name, oa.Type)}</td>
                                    <td>{describeGroupActionFrequency(oa.Frequency)}</td>
                                </tr>
                            })}
                        </tbody>
                    </table> */}
            </div>
        </Container>);
    }
}

export default CurrentStage;