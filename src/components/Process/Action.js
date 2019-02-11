import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'

class Action extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    deleteAction = () => {
        this.props.deleteAction(this.props.stageId, this.props.actionId);
    }

    render() {
        var action = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (stage) => {
            doWithFirstOne(stage.actions, this.props.actionId, (act) => {
                action = act;
            })
        })
        return (<div className='panel panel-default'>
            <div className="panel-body action-body">
                <div className='row'>
                    <h5 className="panel-title col-sm-9">{action.name}</h5>
                    <div className='col-sm-3 panel-action'>
                        <span><i class="fa fa-trash fa-2" aria-hidden="true" onClick={this.deleteAction}></i></span>
                        <span><i class="fas fa-arrow-down fa-2"></i></span>
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
        deleteAction: (stageId, actionId) => {
            dispatch(ProcessAction.deleteAction(stageId, actionId));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Action);