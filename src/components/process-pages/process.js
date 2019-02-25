import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/process-action'
import Stage from './stage'
import './process.scss'

class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionWarning: '',
            nameWarning: ''
        }
    }

    editDescription = (e) => {
        if (e.target.value.trim() === '') {
            e.target.value = '';
        }
        this.process.description = e.target.value;
        this.props.editProcess(this.process);
    }

    editName = (e) => {
        if (e.target.value.trim() === '') {
            e.target.value = '';
        }
        this.process.name = e.target.value;
        this.props.editProcess(this.process);
    }

    render() {
        var process = this.props.process;
        var stages = process.stages;
        this.process = process;
        this.state.descriptionWarning = process.description === '' ? 'Description should not be empty!' : '';
        this.state.nameWarning = process.name === '' ? 'Process name should not be empty!' : '';
        var readOnly = this.props.processStatus.readOnly;
        return (
            <div className="panel panel-primary">
                {/* Heading */}
                {readOnly ? <div className="panel-heading">
                    <h3 className="panel-title text-center">{process.name}</h3>
                </div> : null}
                <div className="panel-body">
                    <div>
                        <div className='process-info'>
                            {/* Input name */}
                            {readOnly ? null : <div className="form-group">
                                <label>Profile Name:</label>
                                <input value={process.name} className='form-control' ref='inputName'
                                    onChange={this.editName} onBlur={() => {
                                        if (this.state.nameWarning !== '') {
                                            this.refs.inputName.focus();
                                        }
                                    }} />
                                <span className='warning-text'>{this.state.nameWarning}</span>
                            </div>}
                            {/* Input description */}
                            <div className="form-group">
                                <label>Description:</label>
                                <input value={process.description} class="form-control"
                                    readOnly={readOnly} ref='inputDescription'
                                    onChange={this.editDescription} onBlur={() => {
                                        if (this.state.descriptionWarning !== '') {
                                            this.refs.inputDescription.focus();
                                        }
                                    }} />
                                <span className='warning-text'>{readOnly ? null : this.state.descriptionWarning}</span>
                            </div>
                            {/* Input customer */}
                            <div className='form-group'>
                                <label>Customer:</label>
                                <select className='form-control' disabled={readOnly}>
                                    <option>ACB</option>
                                    <option>Agribank</option>
                                    <option>TP Bank</option>
                                </select>
                            </div>
                        </div>
                        <div className="stage-list">
                            {
                                stages.map((stage, i) => <Stage stageId={stage.id} key={i} />)
                            }
                            {readOnly ? null :
                                (<button className='btn btn-info mb-15' onClick={this.props.addStage}>Add stage</button>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
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
        addStage: () => {
            dispatch(ProcessAction.addStage());
        },
        editProcess: (process) => {
            dispatch(ProcessAction.editProcess(process));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);