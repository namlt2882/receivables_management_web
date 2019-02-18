import React, { Component } from 'react';
import Action from './Action'
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'

class Stage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameWarning: '',
            durationWarning: ''
        }
    }

    addAction = () => {
        this.props.addAction(this.props.stageId);
    }

    deleteStage = () => {
        this.props.deleteStage(this.props.stageId);
    }

    editName = (e) => {
        this.stage.name = e.target.value;
        this.props.editStage(this.stage);
        var warning = '';
        if (e.target.value.trim() === '') {
            warning = 'Stage name should not empty!'
        }
        this.setState({ nameWarning: warning });
    }

    editDuration = (e) => {
        if (e.target.value === '') {
            e.target.value = '0';
        }
        this.stage.duration = parseInt(e.target.value);
        this.props.editStage(this.stage);
        var warning = '';
        if (this.stage.duration <=0) {
            warning = 'Duration must longer than 0 day!'
        }
        this.setState({ durationWarning: warning });
    }

    render() {
        let stage = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
        })
        this.stage = stage;
        var readOnly = this.props.processStatus.readOnly;
        return (<div className='panel panel-default'>
            <div className="panel-heading">
                <div className='row'>
                    {readOnly ? <h3 className="panel-title col-sm-10">{stage.name}</h3> :
                        <div className='col-sm-10'>
                            <input className='form-control' value={stage.name} ref='inputName'
                                onChange={this.editName} onBlur={() => {
                                    if (this.state.nameWarning !== '') {
                                        this.refs.inputName.focus();
                                    }
                                }}/>
                            <span className='warning-text'>{this.state.nameWarning}</span>
                        </div>
                    }
                    <div className='col-sm-2 panel-process-action'>
                        {readOnly ? null :
                            <div>
                                <span><i class="fa fa-trash fa-2" aria-hidden="true" onClick={this.deleteStage}></i></span>
                                <span><i class="fas fa-arrow-down fa-2"></i></span>
                            </div>}
                    </div>
                </div>
            </div>
            <div className='panel-body'>
                <div className='row'>
                    <div className='stage-info col-sm-5'>
                        <div>
                            <div class="form-group">
                                <label>Duration:</label>
                                <input type='number' min='0' class="form-control" readOnly={readOnly}
                                    ref='inputDuration' value={stage.duration}
                                    onChange={this.editDuration} onBlur={() => {
                                        if (this.state.durationWarning !== '') {
                                            this.refs.inputDuration.focus();
                                        }
                                    }}/>
                                <span className='warning-text'>{this.state.durationWarning}</span>
                            </div>
                            <div className='note'>
                                Notes:<br />
                                2 SMS will be sent<br />
                                2 auto call will be sent<br />
                                10 visit will be done<br />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-7'>
                        <div class="form-group">
                            <label>Action:</label>
                            <div className='action-holder'>
                                {stage.actions.map((action, i) => <Action stageId={stage.id} actionId={action.id} key={i} />)}
                                {readOnly ? null :
                                    <button className='btn btn-info mb-15' onClick={this.addAction}>Add Action</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >);
    }
}
const mapStateToProps = state => {
    return {
        process: state.process,
        processStatus: state.processStatus
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        addAction: (stageId) => {
            dispatch(ProcessAction.addAction(stageId));
        },
        deleteStage: (stageId) => {
            dispatch(ProcessAction.deleteStage(stageId));
        },
        editStage: (stage) => {
            dispatch(ProcessAction.editStage(stage));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stage);