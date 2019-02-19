import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ReceivableAction, ReceivableRequest } from './../../actions/ReceivableAction'
import { receivable } from '../../reducers/ReceivableReducer';
import { Link } from 'react-router-dom';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.fetchReceivableList();
    }

    render() {
        var receivableList = this.props.receivableList;
        var index = 0;
        return (<div>
            <Link to="/receivable/add" className="btn btn-info mb-15">Add Receivable</Link>
            <div className='panel panel-primary'>
                <div className='panel-heading'>
                    <h3 className='panel-title text-center'>Receivable list</h3>
                </div>
                <div className='panel-body'>
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Profile</th>
                                <th>Location</th>
                                <th>End day</th>
                                <th>Status</th>
                                <th>Collector</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivableList.map((receivable) => <tr>
                                <td>{receivable.id}</td>
                                <td>{receivable.name}</td>
                                <td>{receivable.profile.name}</td>
                                <td></td>
                                <td>{receivable.closedDay}</td>
                                <td></td>
                                <td>{receivable.collectors.map((collector) => {
                                    if (index === 0) {
                                        return collector.name;
                                    } else {
                                        return ', ' + collector.name;
                                    }
                                    index++;
                                })}</td>
                                <td><Link to={`/receivable/${receivable.id}`}>
                                    View</Link></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
    }
}
const mapStateToProps = state => {
    return {
        receivableList: state.receivableList
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchReceivableList: () => {
            dispatch(ReceivableRequest.fetchReceivableList());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);