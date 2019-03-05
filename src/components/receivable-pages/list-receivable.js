import React from 'react';
import { connect } from 'react-redux';
import { ReceivableRequest, ReceivableAction } from '../../actions/receivable-action'
import { Link } from 'react-router-dom';
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';
import { Button, Container, Header, Table } from 'semantic-ui-react'
import { describeStatus } from './detail/receivable-detail';

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1
        }
    }
    componentDidMount() {
        document.title = 'Receivables';
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
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <Container>
                <Header className='text-center'>Receivables</Header>
                <Button primary onClick={() => { this.props.history.push('/receivable/add') }}>Import</Button>
                <Table class="table-hover">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Prepaid amount</Table.HeaderCell>
                            <Table.HeaderCell>Debt amount</Table.HeaderCell>
                            <Table.HeaderCell>Payable day</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {receivableList.map((receivable) => {
                            let status = describeStatus(receivable.CollectionProgressStatus);
                            return <Table.Row>
                                <Table.Cell>{receivable.Id}</Table.Cell>
                                <Table.Cell>{receivable.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                <Table.Cell>{receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                <Table.Cell>{numAsDate(receivable.PayableDay)}</Table.Cell>
                                <Table.Cell>{status}</Table.Cell>
                                <Table.Cell><Link to={`/receivable/${receivable.Id}/view`}>
                                    View</Link></Table.Cell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
            </Container>
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