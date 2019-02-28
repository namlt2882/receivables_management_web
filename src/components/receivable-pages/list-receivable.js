import React from 'react';
import { connect } from 'react-redux';
import { ReceivableRequest, ReceivableAction } from '../../actions/receivable-action'
import { receivable } from '../../reducers/receivable-reducer';
import { Link } from 'react-router-dom';
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1
        }
    }
    componentDidMount() {
        available(resolve => setTimeout(resolve, 400));
        this.props.fetchReceivableList().then(res => {
            this.incrementLoading();
        });
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        var receivableList = this.props.receivableList;
        var index = 0;
        return (<div>
            <Link to="/receivable/add" className="btn btn-info">Import</Link>
            <div className='panel panel-primary'>
                <div className='panel-heading'>
                    <h3 className='panel-title text-center'>Receivable list</h3>
                </div>
                <div className='panel-body'>
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Profile</th>
                                <th>Prepaid amount</th>
                                <th>Debt amount</th>
                                <th>Payable day</th>
                                <th>Status</th>
                                <th>Customer</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivableList.map((receivable) => {
                                let status = '';
                                switch (receivable.CollectioProgressStatus) {
                                    case 0: status = 'Cancel';
                                        break;
                                    case 1: status = 'Collection';
                                        break;
                                    case 2: status = 'Done';
                                        break;
                                    case 3: status = 'Late';
                                        break;
                                }
                                return <tr>
                                    <td>{receivable.Id}</td>
                                    <td></td>
                                    <td>{receivable.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                    <td>{receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                    <td>{numAsDate(receivable.PayableDay)}</td>
                                    <td>{status}</td>
                                    <td></td>
                                    <td><Link to={`/receivable/${receivable.Id}/view`}>
                                        View</Link></td>
                                </tr>
                            })}
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
            return ReceivableService.getAll().then((res) => {
                dispatch(ReceivableAction.setReceivableList(res.data));
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReceivableList);