/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions/user-action';
import { UserService } from '../../services/user-service';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import UserItem from './user-item';
import UserList from './user-list-component';
import './user.scss';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';


class ListUserWithReceivable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            filterVal: ""
        };
    }

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        document.title = 'Collector management';
        available1();
        UserService.getGroupByCollector().then(res => {
            this.setState({
                reportData: res.data
            })
            this.incrementLoading();
        });
    }

    renderTable() {
        let renderData = { ...collectorTable };
        let rows = this.state.reportData.map((collector, index) => {
            return {
                No: (index + 1),

                CollectorName: collector.CollectorName,
                NumberOfReceivableInCollectingProgress: collector.NumberOfReceivableInCollectingProgress + "/" + collector.NumberOfAssignedReceivable,
                FailureRate: collector.rate.FailRate > 0 ? collector.rate.FailRate + "%" : "N/A",
                SuccessRate: collector.rate.SuccessRate > 0 ? collector.rate.SuccessRate + "%" : "N/A",
                Action: <Link target='#' to={`collectors/${collector.CollectorId}/receivable`}>View</Link>
            }
        });

        renderData.rows = rows;
        let tableComponent = renderData.rows.length > 0 ? <MDBDataTable
            maxHeight="200px"
            small
            className='hide-last-row'
            striped
            bordered
            data={renderData} /> :
            <div style={{ fontSize: '2rem' }}>Nothing found!</div>

        return tableComponent;
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let renderData = this.renderTable();

        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>Collector management</h1>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    <div>
                        <div className="hungdtq-Container">
                            <div className="tableSearchBox">
                                {renderData}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

const mapStateToProps = state => {
    return {
        users: state.users,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: (users) => {
            dispatch(UserAction.setUsers(users));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUserWithReceivable);

const collectorTable = {
    columns: [
        {
            label: 'No',
            field: 'No',
            width: 150
        },
        {
            label: 'CollectorName',
            field: 'CollectorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'No. In Collecting Progress',
            field: 'NumberOfReceivableInCollectingProgress',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Failure rate',
            field: 'FailureRate',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Success rate',
            field: 'SuccessRate',
            sort: 'asc',
            width: 270
        },
        {
            label: '',
            field: 'action',
            width: 150
        }

    ],
    rows: []
}