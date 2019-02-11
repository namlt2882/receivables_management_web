import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import Stage from './Stage'

class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        var process = this.props.process;
        var stages = process.stages;
        return (<div>
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title text-center">{process.name}</h3>
                </div>
                <div className="panel-body">
                    <div>
                        Description:
                        <div>
                            <input value={process.description} />
                        </div>
                        <div className="stage-list">
                            {
                                stages.map((stage, i) => <Stage stageId={stage.id} key={i} />)
                            }
                            <button className='btn btn-info mb-15' onClick={this.props.addStage}>Add stage</button>
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
        addStage: () => {
            dispatch(ProcessAction.addStage());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);