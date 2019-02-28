import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { numAsDate } from '../../utils/time-converter';

class ReceivableProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverStatuses: this.props.progress.Stages.map((s) => false)
        }
        this.onMouseIn = this.onMouseIn.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseIn(i) {
        let popoverStatuses = this.props.progress.Stages.map((s) => false);
        popoverStatuses[i] = true;
        this.setState({
            popoverStatuses: popoverStatuses
        });
    }
    onMouseOut(i) {
        let popoverStatuses = this.props.progress.Stages.map((s) => false);
        popoverStatuses[i] = false;
        this.setState({
            popoverStatuses: popoverStatuses
        });
    }
    render() {
        let progress = this.props.progress;
        let size = progress.Stages.length;
        size = Math.floor(10 / size);
        if (size < 1) {
            size = 1;
        }
        try {
            return (<div className='col-sm-12 row justify-content-center align-self-center'>
                {progress.Stages.map((stage, i) => {
                    let className = `col-sm-${size} r-stage `;
                    let status = '';
                    let percent = stage.percent;
                    if (stage.isCurrentStage) {
                        //in stage
                        className += 'progress-current-stage';
                        status = 'Collection';
                        if (percent < 5) {
                            percent = 5;
                        }
                    } else if (stage.isIncommingStage) {
                        //incomming stage
                        className += 'r-low-stage';
                        status = 'Incomming';
                    } else {
                        //finished stage
                        status = 'Finished';
                    }

                    return (<div className={className} id={'rps-' + i} onMouseEnter={() => { this.onMouseIn(i - 1) }}
                        onMouseLeave={() => { this.onMouseOut(i - 1) }}>
                        <div className='text-center'>{stage.Name}</div>
                        <Progress value={percent}>{stage.Duration} days</Progress>
                        {/* Popover */}
                        <Popover placement="bottom" isOpen={this.state.popoverStatuses[i - 1]} target={'rps-' + i}>
                            <PopoverBody>
                                <table className='deco-table'>
                                    <tbody>
                                        <tr>
                                            <td>Start date:</td>
                                            <td>{numAsDate(stage.startDate)}</td>
                                        </tr>
                                        <tr>
                                            <td>End date:</td>
                                            <td>{numAsDate(stage.endDate)}</td>
                                        </tr>
                                        <tr>
                                            <td>Status:</td>
                                            <td>{status}</td>
                                        </tr>
                                        <tr>
                                            <td>SMS:</td>
                                            <td>3 days/time</td>
                                        </tr>
                                        <tr>
                                            <td>Phone call:</td>
                                            <td>5 days/time</td>
                                        </tr>
                                        <tr>
                                            <td>Visit:</td>
                                            <td>10 days/time</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </PopoverBody>
                        </Popover>
                    </div>)
                })}
                {/* <div className='col-sm-3 r-stage'>
                <div className='text-center'>Stage 1</div>
                <Progress value={100}>30 days</Progress>
            </div>
            <div className='col-sm-3 r-stage progress-current-stage'>
                <div className='text-center'>Stage 2</div>
                <Progress value={50} >30 days</Progress>
            </div>
            <div className='col-sm-3 r-stage r-low-stage'>
                <div className='text-center'>Stage 1</div>
                <Progress value={0}>30 days</Progress>
            </div> */}
            </div>);
        } catch (e) {
            return null;
        }
    }
}

export default ReceivableProgress;