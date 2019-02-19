import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ReceivableAction, ReceivableRequest } from './../../actions/ReceivableAction'
import { receivableStatus } from '../../reducers/ReceivableReducer';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getReceivable(1);
    }

    render() {
        var readOnly = this.props.receivableStatus.readOnly;
        var receivable = this.props.receivable;
        var index = 0;
        return (<div className='panel panel-primary'>
            <div className='panel-heading'>
                <h3 className='panel-title text-center'>{readOnly ? 'Receivable detail' : 'Edit receivable'}</h3>
            </div>
            <div className='panel-body'>
                <div className='row'>
                    <div className='col-sm-6'>
                        <div className='form-group'>
                            <label>Name:</label>
                            <input className='form-control' value={receivable.name} />
                        </div>
                        <div className='form-group'>
                            <label>Customer:</label>
                            <select className='form-control'></select>
                        </div>
                        <div className='form-group'>
                            <label>Profile:</label>
                            <select className='form-control'></select>
                        </div>
                        <div className='form-group'>
                            <label>Location:</label>
                            <input className='form-control' />
                        </div>
                        <div className='form-group'>
                            <label>Amount:</label>
                            <input className='form-control' />
                        </div>
                        <div className='form-group'>
                            <label>Collectors:</label>
                            <span>
                                {receivable.collectors.length == 0 ? 'No body' : null}
                                {receivable.collectors.map((collector) => {
                                    if (index === 0) {
                                        return collector.name;
                                    } else {
                                        return ', ' + collector.name;
                                    }
                                    index++;
                                })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
const mapStateToProps = state => {
    return {
        receivable: state.receivable,
        receivableStatus: state.receivableStatus
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        enableEdit: () => {
            dispatch(ReceivableAction.setEditable());
        },
        cancelEdit: () => {
            dispatch(ReceivableAction.cancelEditable());
        },
        getReceivable: (id) => {
            dispatch(ReceivableRequest.getReceivable(id));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);