import React, { Component } from 'react';
import { numAsDate, compareIntDate } from '../../../utils/time-converter';
import { describeActionType, describeGroupActionFrequency } from './receivable-detail';
import { Container, Header } from 'semantic-ui-react';

class CurrentStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        }
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }
    toggleCollapse(e) {
        e.preventDefault();
        let collapse = this.state.collapse;
        this.setState({ collapse: !collapse })
    }
    render() {
        let currentStage = this.props.currentStage;
        return (<Container className='row current-stage' style={{ margin: '0px 0px 15px 0px' }}>
            <Header className='text-center'>Current stage
            <span style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                    {` (${compareIntDate(this.props.currentDate, currentStage.endDate)} day left)`}
                </span>
                <a href='' onClick={this.toggleCollapse}
                    style={{ float: 'right', paddingRight: '20px', fontSize: '1rem' }}>
                    {this.state.collapse ? 'Expanse' : 'Collapse'}
                </a>
            </Header>
            <div className='col-sm-12 row justify-content-center align-self-center'
                style={{ display: this.state.collapse ? 'none' : 'flex' }}>
                <div className='col-sm-4'>
                    <table className='deco-table'>
                        <tbody>
                            <tr>
                                <td>Stage:</td>
                                <td>{currentStage.Name}</td>
                            </tr>
                            <tr>
                                <td>Duration:</td>
                                <td>{currentStage.Duration} days</td>
                            </tr>
                            <tr>
                                <td>Start day:</td>
                                <td>{numAsDate(currentStage.startDate)}</td>
                            </tr>
                            <tr>
                                <td>End day:</td>
                                <td>{numAsDate(currentStage.endDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-sm-6 row'>
                    <div className='col-sm-3'><b>Actions:</b></div>
                    <table className='col-sm-8'>
                        <tbody>
                            {currentStage.OriginalActions.map(oa => {
                                return <tr>
                                    <td>{describeActionType(oa.Name, oa.Type)}</td>
                                    <td>{describeGroupActionFrequency(oa.Frequency)}</td>
                                </tr>
                            })}
                            {/* <tr>
                                <td>SMS</td>
                                <td>3 days/time</td>
                            </tr>
                            <tr>
                                <td>Phone call</td>
                                <td>5 days/time</td>
                            </tr>
                            <tr>
                                <td>Visit</td>
                                <td>10 days/time</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>);
    }
}

export default CurrentStage;