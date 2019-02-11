import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'

class Action extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        var action = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (stage) => {
            doWithFirstOne(stage.actions, this.props.actionId, (act) => {
                action = act;
          })  
        })
        return (<div>
            <h4>{action.name}</h4>
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
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Action);