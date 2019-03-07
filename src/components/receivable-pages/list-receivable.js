import React from 'react';
import { connect } from 'react-redux';
import { ReceivableAction } from '../../actions/receivable-action'
import { Link } from 'react-router-dom';
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';
import { Button, Container, Header } from 'semantic-ui-react'
import { describeStatus } from './detail/receivable-detail';
import { compareIntDate } from '../../utils/time-converter'
import { MDBDataTable } from 'mdbreact'
import { AuthService } from '../../services/auth-service';

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            statusFilter: (rei) => {
                return 0
            }
        }
    }
    componentDidMount() {
        document.title = 'Receivables';
        available(resolve => setTimeout(resolve, 400));
        this.props.fetchReceivableList().then(res => {
            this.incrementLoading();
        });
    }
    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.props.receivableList.map(r => ({
            Id: r.Id,
            DebtorName: r.DebtorName,
            CustomerName: r.CustomerName,
            DebtAmount: r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
            PayableDay: numAsDate(r.PayableDay),
            Status: describeStatus(r.CollectionProgressStatus),
            action: <Link to={`/receivable/${r.Id}/view`}>View</Link>
        }));
        data1.rows = rows;
        return data1;
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        let data1 = this.pushDataToTable();
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <Container>
                <Header className='text-center'>
                    {AuthService.isManager() ? `Receivables` : 'Your assigned receivables'}
                </Header>
                {AuthService.isManager() ? <div>
                    <Button primary onClick={() => { this.props.history.push('/receivable/add') }}>Import</Button><br />
                    <Link to='/receivable/recent-add'>Recent added receivables</Link><br />
                </div> : null}
                <MDBDataTable
                    className='hide-last-row'
                    striped
                    bordered
                    data={data1} />
            </Container>
        </div>);
    }
}

const data = {
    columns: [
        {
            label: 'Id',
            field: 'Id',
            width: 150
        },
        {
            label: 'Debtor name',
            field: 'DebtorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Customer name',
            field: 'CustomerName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Debt amount',
            field: 'DebtAmount',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Payable day',
            field: 'PayableDay',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Status',
            field: 'Status',
            sort: 'asc',
            width: 100
        },
        {
            label: 'Action',
            field: 'action',
            width: 150
        }
    ],
    rows: []
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
                let list = res.data;
                if (AuthService.isCollector()) {
                    let id = localStorage.getItem('id');
                    list = list.filter(r => r.AssignedCollectorId === id);
                }
                list.sort((a, b) => compareIntDate(a.PayableDay, b.PayableDay));
                dispatch(ReceivableAction.setReceivableList(list));
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReceivableList);