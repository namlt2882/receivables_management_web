import React, { Component } from 'react';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';

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
        return (<Card className='row current-stage' style={{ margin: '0px 0px 15px 0px' }}>
            <CardTitle>Current stage
                <a href='' onClick={this.toggleCollapse}
                    style={{ float: 'right', paddingRight: '20px', fontSize: '1rem' }}>
                    {this.state.collapse ? 'Expanse' : 'Collapse'}
                </a>
            </CardTitle>
            <CardBody className='col-sm-12 row justify-content-center align-self-center'
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
                        </tbody>
                    </table>
                </div>
                <div className='col-sm-4 row'>
                    <div className='col-sm-4'>Actions:</div>
                    <table className='col-sm-8'>
                        <tbody>
                            <tr>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>);
    }
}

export default CurrentStage;