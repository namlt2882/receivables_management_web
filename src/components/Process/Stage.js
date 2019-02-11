import React, { Component } from 'react';
import Action from './Action'
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'

class Stage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    addAction = () => {
        this.props.addAction(this.props.stageId);
    }

    deleteStage = () => {
        this.props.deleteStage(this.props.stageId);
    }

    render() {
        let stage = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
        })
        return (<div className='panel panel-default'>
            <div className="panel-heading">
                <div className='row'>
                    <h3 className="panel-title col-sm-10">{stage.name}</h3>
                    <div className='col-sm-2 panel-action'>
                        <span><i class="fa fa-trash fa-2" aria-hidden="true" onClick={this.deleteStage}></i></span>
                        <span><i class="fas fa-arrow-down fa-2"></i></span>
                    </div>
                </div>
            </div>
            <div className='panel-body'>
                <div className='row'>
                    <div className='stage-info col-sm-5'>
                        <div>
                            <div class="form-group">
                                <label>Long:</label>
                                <input class="form-control" />
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
                                <button className='btn btn-info mb-15' onClick={this.addAction}>Add Action</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
const mapStateToProps = state => {
    return {
        process: state.process
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        addAction: (stageId) => {
            dispatch(ProcessAction.addAction(stageId));
        },
        deleteStage: (stageId) => {
            dispatch(ProcessAction.deleteStage(stageId));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stage);