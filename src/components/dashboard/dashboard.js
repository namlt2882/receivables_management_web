import React from 'react';
import Component from '../common/component'
import { available } from '../common/loading-page';
import OverallReport from './overall-report';
import RecentTable from './day-report';
import { MDBDataTable } from 'mdbreact';
import { PrimaryLoadingPage } from '../common/loading-page';
import { ReportService } from '../../services/report-service';
import { Link } from 'react-router-dom';
import { Label } from 'semantic-ui-react';
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem
} from '@progress/kendo-react-charts';

import "react-tabs/style/react-tabs.css";
import DetailReport from './detail-report';



const ROLE_MANAGER = 'Manager';
const ROLE_COLLECTOR = 'Collector';

class Dashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            role: localStorage.getItem('role'),
            reportData: []
        }
    }
    componentDidMount() {
        available(resolve => setTimeout(resolve, 400));
        document.title = 'Dashboard';

        if (this.state.role == ROLE_MANAGER) {
            ReportService.getOverallReport().then(res => {
                this.setState({
                    reportData: res.data
                })
                this.incrementLoading()
            }
            );
        } else if (this.state.role == ROLE_COLLECTOR) {

        }

    }

    renderReceivableTable() {
        let renderData = { ...receivableTable };
        let rows = this.state.reportData.RecentCanceledReceivable.map((receivable, index) => {
            let statusColor = this.getStatusColor(receivable.Status);
            let status = this.describeStatus(receivable.Status);
            return {
                No: (index + 1),
                
                PartnerName: receivable.PartnerName,
                DebtorName: receivable.DebtorName,
                CollectorName: receivable.CollectorName,
                Status: <Label color={statusColor}>{status}</Label>,
                Action: <Link target='#' to={`receivable/${receivable.Id}/view`}>View</Link>
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
            <div style={{ fontSize: '2rem' }}>No canceled or complete process receivable!</div>

        return tableComponent;
    }


    renderTaskTable() {
        let renderData = { ...taskTable };
        let rows = this.state.reportData.RecentUpdatedTaskByCollectorReport.map((task, index) => {
            let statusColor = this.getStatusColor(task.Status);
            let status = this.describeStatus(task.Status);
            return {
                No: (index + 1),
                CollectorName: task.CollectorName,
                TaskName: task.TaskName,
                Status: <Label color={statusColor}>{status}</Label>,
                Action: <Link target='#' to={`receivable/${task.ReceivableId}/view`}>View</Link>
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
            <div style={{ fontSize: '2rem' }}>No canceled or late task!</div>

        return tableComponent;
    }

    getStatusColor(status) {
        let statusColor = 'grey';
        switch (status) {
            case 0:
                // Cancel
                statusColor = 'red';
                break;
            case 1: statusColor = 'green';
                break;
            case 2:
                // Done
                statusColor = 'blue';
                break;
            case 4:
                // Pending
                statusColor = 'orange';
                break;
        }
        return statusColor;
    }

    describeStatus(status) {
        let rs = status;
        switch (status) {
            case 0:
                // Cancel
                rs = 'Cancel';
                break;
            case 1: rs = 'Collecting';
                break;
            case 2:
                // Done
                rs = 'Done';
                break;
            case 4:
                // Pending
                rs = 'Pending';
                break;
            case 5:
                // Closed
                rs = 'Closed';
                break;
        }
        return rs;
    }

    getData() {
        let role = this.state.role;
        if (role == ROLE_MANAGER) {

            let renderReceivableData = this.renderReceivableTable();
            let renderTaskData = this.renderTaskTable();
            return (
                <div>
                    <OverallReport
                        NumberOfCanceledReceivables={this.state.reportData.NumberOfCanceledReceivables}
                        NumberOfCollectingReceivables={this.state.reportData.NumberOfCollectingReceivables}
                        NumberOfDoneReceivables={this.state.reportData.NumberOfDoneReceivables}
                        NumberOfPendingReceivables={this.state.reportData.NumberOfPendingReceivables}
                        NumberOfRecoveredReceivables={this.state.reportData.NumberOfRecoveredReceivables}
                    />
                    <RecentTable
                        style={{ marginTop: '0px' }}
                        title="Canceled or complete process receivable(s)"
                        reportNumber={this.state.reportData.NumberOfRecentClosedOrCanceledReceivables}
                        tableData={renderReceivableData}
                    />
                    <RecentTable
                        style={{ marginTop: '00px' }}
                        title="Late or Canceled Task(s)"
                        reportNumber={this.state.reportData.NumberOfRecentChangedTask}
                        tableData={renderTaskData}
                    />
                </div>
            );
        } else if (role == ROLE_COLLECTOR) {

        }
    }

    render() {
        let renderComponent = null;
        if (this.isLoading()) {
            renderComponent = <PrimaryLoadingPage />;
        } else {
            renderComponent = this.getData();
        }
        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>Dash board</h1>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    {renderComponent}
                    <hr></hr>
                    <DetailReport/>
                </div>
            </div>

        );
    }
}

const receivableTable = {
    columns: [
        {
            label: 'No',
            field: 'No',
            width: 150
        },
        {
            label: 'Partner',
            field: 'PartnerName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Debtor',
            field: 'DebtorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Collector',
            field: 'CollectorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Status',
            field: 'Status',
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

const taskTable = {
    columns: [
        {
            label: 'No',
            field: 'No',
            width: 150
        },
        {
            label: 'Collector',
            field: 'CollectorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Task',
            field: 'TaskName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Status',
            field: 'Status',
            sort: 'asc',
            width: 270
        },
        {
            label: '',
            field: 'action',
            width: 150
        }
    ]
}

export default Dashboard;
