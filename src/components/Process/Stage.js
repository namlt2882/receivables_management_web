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

    render() {
        let stage = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
        })
        return (<div>
            <h3>{stage.name}</h3>
            <div>
                {stage.actions.map((action, i) => <Action stageId={stage.id} actionId={action.id} key={i} />)}
                <button className='btn btn-info mb-15' onClick={this.addAction}>Add Action</button>
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stage);