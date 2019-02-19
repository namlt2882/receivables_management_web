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
        if (e.target.value.trim() === '') {
            e.target.value = '';
        }
        this.stage.name = e.target.value;
        this.props.editStage(this.stage);
    }

    editDuration = (e) => {
        if (e.target.value === '') {
            e.target.value = '0';
        }
        this.stage.duration = parseInt(e.target.value);
        this.props.editStage(this.stage);
    }

    displayOrCollapse = () => {
        var displayBody = !this.stage.displayBody;
        this.stage.displayBody = displayBody;
        this.props.editStage(this.stage);
    }

    incrementStage = () => {
        this.props.incrementStage(this.props.stageId);
    }

    decrementStage = () => {
        this.props.decrementStage(this.props.stageId);
    }

    render() {
        let process = this.props.process;
        let stage = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
        })
        this.stage = stage;
        this.state.nameWarning = stage.name === '' ? 'Stage name should not empty!' : '';
        this.state.durationWarning = stage.duration <= 0 ? 'Duration must longer than 0 day!' : '';
        var readOnly = this.props.processStatus.readOnly;
        return (<div className='panel panel-default'>
            <div className="panel-heading">
                <div className='row'>
                    {readOnly ? <h3 className="panel-title col-sm-6">{stage.name}</h3> :
                        <div className='col-sm-6'>
                            <input className='form-control' value={stage.name} ref='inputName'
                                onChange={this.editName} onBlur={() => {
                                    console.log(this.state.nameWarning);
                                    if (this.state.nameWarning !== '') {
                                        this.refs.inputName.focus();
                                    }
                                }} />
                            <span className='warning-text'>{readOnly ? null : this.state.nameWarning}</span>
                        </div>
                    }
                    <div className='col-sm-6 panel-process-action'>
                        <div>
                            {readOnly ? null :
                                <div>
                                    {stage.order !== 1 ? <span onClick={this.incrementStage}><i class="fas fa-arrow-up fa-2"></i></span> : null}
                                    {stage.order < process.stages.length ? <span onClick={this.decrementStage}><i class="fas fa-arrow-down fa-2"></i></span> : null}
                                    <span><i class="fa fa-trash fa-2" aria-hidden="true" onClick={this.deleteStage}></i></span>
                                </div>}
                            {stage.displayBody ?
                                <span onClick={this.displayOrCollapse}><a>Collapse</a></span> :
                                <span onClick={this.displayOrCollapse}><a>Expanse</a></span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className='panel-body' ref='body' style={{ display: stage.displayBody ? 'block' : 'none' }}>
                <div className='row'>
                    <div className='stage-info col-sm-3'>
                        <div>
                            <div class="form-group">
                                <label>Duration:</label>
                                <input type='number' min='0' class="form-control" readOnly={readOnly}
                                    ref='inputDuration' value={stage.duration}
                                    onChange={this.editDuration} onBlur={() => {
                                        if (this.state.durationWarning !== '') {
                                            this.refs.inputDuration.focus();
                                        }
                                    }} />
                                <span className='warning-text'>{readOnly ? null : this.state.durationWarning}</span>
                            </div>
                            <div className='note'>
                                Notes:<br />
                                2 SMS will be sent<br />
                                2 auto call will be sent<br />
                                10 visit will be done<br />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-9'>
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
        },
        incrementStage: (stageId) => {
            dispatch(ProcessAction.incrementStage(stageId));
        },
        decrementStage: (stageId) => {
            dispatch(ProcessAction.decrementStage(stageId));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stage);