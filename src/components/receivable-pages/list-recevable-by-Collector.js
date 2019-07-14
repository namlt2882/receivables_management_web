import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faExclamationCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Button, Checkbox, Container, Divider, Icon, Label, Segment } from 'semantic-ui-react';
import { AuthService } from '../../services/auth-service';
import { ReceivableService } from '../../services/receivable-service';
import { UserService } from '../../services/user-service';
import { numAsDate } from '../../utils/time-converter';
import Component from '../common/component';
import { available, PrimaryLoadingPage } from '../common/loading-page';
import { describeStatus, getStatusColor } from './detail/receivable-detail';
library.add(faCheck, faExclamationCircle, faRedo);

class ReceivableListByCollector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: true,
            maxLoading: 2,
            receivableList: [],
            series: [
                { category: 'Collecting', value: 0, color: getStatusColor(1), checked: true, isConfirmed: false },
                { category: 'Pending', value: 0, color: getStatusColor(4), checked: true, isConfirmed: false },
                // { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: true },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: true },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: true }
            ],
            series2: [
                { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: false },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: false },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: false }
            ],
            sumConfirmed: 0,
            sumNotConfirmed: 0,
            getConfirmed: true,
            selectedCollector: [],
            selectedCustomer: [],
            isRefreshing: false,
            user: null
        }
        this.statusFilterComp = this.statusFilterComp.bind(this);

    }

    setSeriesState(series, getConfirmed = this.state.getConfirmed) {
        let state = {};
        state[this.currentSeriesName(getConfirmed)] = series;
        this.setState(state);
    }

    currentSeriesName(getConfirmed = this.state.getConfirmed) {
        return getConfirmed ? 'series' : 'series2';
    }

    currentSeries(getConfirmed = this.state.getConfirmed) {
        return getConfirmed ? this.state.series : this.state.series2;
    }

    toggleStatus(category, checked) {
        let series = this.currentSeries();
        let found = series.find(s => s.category === category);
        if (found) {
            found.checked = checked;
        }
        this.setSeriesState(series)
        this.filterReceivable(series.filter(s => s.checked))
    }

    statusFilterComp() {
        return <div className='col-sm-7' style={{ marginTop: '10px', float: 'left' }}>
            <div>
                {this.currentSeries().map(s => <div style={{
                    padding: '5px',
                    display: 'inline-block',
                    marginRight: '10px'
                }}>
                    <Checkbox checked={s.checked}
                        onChange={(e, data) => {
                            this.toggleStatus(s.category, data.checked);
                        }} />
                    <Label color={s.color} style={{ cursor: 'pointer' }} onClick={() => {
                        let checked = !s.checked;
                        this.toggleStatus(s.category, checked);
                    }}>{`${s.category} (${s.value})`}</Label>
                </div>)}
            </div>
        </div>
    }

    componentDidMount() {
        var { match } = this.props;
        available(resolve => setTimeout(resolve, 400));

        if (match) {
            let collectorId = match.params.collectorId;
            if (collectorId) {
                ReceivableService.getReceivablesByCollector(collectorId).then((res) => {
                    this.setState({
                        receivableList: res.data
                    });
                    this.incrementLoading()
                    this.filterReceivable()
                });
            }
            UserService.getCollectorDetail(match.params.collectorId).then(res => {
                let user = res.data;
                this.setState({
                    user: user
                })
                document.title = `Receivable of ${user.FirstName} ${user.LastName}`
                this.incrementLoading();
            })
        }

    }
    toggleConfirmed(val) {
        let origin = this.state.getConfirmed;
        if (origin != val) {
            this.setState({
                getConfirmed: val
            })
            this.filterReceivable(undefined, undefined, undefined, val);
        }
    }

    calculateSeries(list = this.state.receivableList, getConfirmed = this.state.getConfirmed) {
        let series = this.currentSeries(getConfirmed);
        series.forEach(s => { s.value = 0 })
        series = list.reduce((acc, r) => {
            let status = describeStatus(r.CollectionProgressStatus);
            let tmp = acc.find(obj => obj.category === status);
            if (tmp && r.IsConfirmed === tmp.isConfirmed) {
                tmp.value++;
            }
            return acc;
        }, series);
        this.setSeriesState(series, getConfirmed);
    }

    filterReceivable(selectedSeries,
        collectors = this.state.selectedCollector, customers = this.state.selectedCustomer,
        getConfirmed = this.state.getConfirmed) {
        if (!selectedSeries) {
            selectedSeries = this.currentSeries(getConfirmed).filter(s => s.checked);
        }
        let list = this.state.receivableList;
        let mapCollector = new Map();
        collectors.forEach(c => { mapCollector.set(c.Id, c); });
        let mapCustomer = new Map();
        customers.forEach(c => { mapCustomer.set(c.Name, c); });
        list = list.filter(r => {
            let status = describeStatus(r.CollectionProgressStatus);
            // Filter status
            let series = selectedSeries.find(s => s.category === status);
            if (series) {
                if (r.IsConfirmed !== series.isConfirmed) {
                    return false;
                }
                r.Display = true;
            } else {
                r.Display = false;
            }
            //Filter by selected collector
            let rs = true;
            if (mapCollector.size > 0) {
                rs = mapCollector.has(r.AssignedCollectorId);
            }
            //Filter by selected customer
            if (rs) {
                if (mapCustomer.size > 0) {
                    rs = mapCustomer.has(r.CustomerName);
                }
            }
            return rs;
        })
        this.calculateSeries(list, getConfirmed);
        this.setState({ receivableList: list });
    }



    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.state.receivableList.filter(r => r.Display).map((r, i) => {
            let status = describeStatus(r.CollectionProgressStatus);
            let statusColor = getStatusColor(r.CollectionProgressStatus);
            let confirmComponent = null;
            if ((r.CollectionProgressStatus == 0 || r.CollectionProgressStatus == 2 ||
                r.CollectionProgressStatus == 5) && !r.IsConfirmed) {
                confirmComponent = <span style={{
                    color: 'red',
                    display: 'block',
                    fontStyle: 'italic'
                }}>Not confirm</span>
            }
            return {
                No: (i + 1),
                CustomerName: r.CustomerName,
                DebtorName: r.DebtorName,
                DebtAmount: (r.DebtAmount - r.PrepaidAmount).toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                CurrentStage: `${r.Stage} (${r.ProgressPercent}%)`,
                Status: [<Label color={statusColor}>{status}</Label>,
                    confirmComponent],
                action: <Link target='_blank' to={`/receivable/${r.Id}/view`}>View</Link>
            }
        });
        data1.rows = rows;
        return data1;
    }

    render() {
        let data1 = this.pushDataToTable();
        let tableComponent = null;
        if (this.isLoading()) {
            tableComponent = <PrimaryLoadingPage />;
        } else {
            tableComponent = data1.rows.length > 0 ? <MDBDataTable
                className='hide-last-row'
                striped
                bordered
                data={data1} /> :
                <div style={{ fontSize: '2rem' }}>No receivable found!</div>
        }
        let isManager = AuthService.isManager();
        let user = this.state.user;
        if (!user) {
            user = {};
        }
        return (
            <Container className='col-sm-12 row justify-content-center'>
                <div className="hungdtq-header">
                    <div>
                        <div className="d-inline-block hungdtq-header-text">
                            <h1>{isManager ? `Receivables of ${user.FirstName} ${user.LastName}` : 'Your assigned receivables'}</h1>
                        </div>
                        {/* Add button */}
                    </div>
                    <Divider />
                </div>
                <div className='col-sm-12 row justify-content-center align-self-center'
                    style={{ display: this.state.showFilter ? 'flex' : 'none' }}>
                    <Nav tabs className='col-sm-10'>
                        <NavItem>
                            <NavLink className={classnames({ active: true })}>
                                <Icon name='filter' />
                                Filter
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab='1' style={{ paddingBottom: '20px', borderTop: 'none' }}
                        className='border-shadow col-sm-10 row justify-content-center'>
                        <TabPane tabId='1' className='col-sm-12 row justify-content-center align-self-center'>
                            <div style={{
                                position: 'absolute', top: '10px', right: 0
                            }}>
                                <Button icon='window minimize' color='primary' style={{ width: 'auto' }}
                                    onClick={() => {
                                        this.setState({ showFilter: false });
                                    }} />
                            </div>
                            <div className='col-sm-6' style={{ float: 'left' }}>
                                <Segment compact>
                                    <Checkbox toggle label='Show not confirmed receivable?'
                                        checked={!this.state.getConfirmed}
                                        onChange={(e, data) => {
                                            let value = !data.checked;
                                            this.toggleConfirmed(value);
                                        }} />
                                </Segment>
                            </div>
                            {this.statusFilterComp()}
                        </TabPane>
                    </TabContent>
                </div >
                <div className='col-sm-12 hungdtq-header'>
                    <div className='float-right'>
                        <div className='btn btn-rcm-primary rcm-btn'
                            style={{ zIndex: 10, position: 'relative' }}
                            onClick={() => {
                                this.setState(pre => ({ showFilter: !pre.showFilter }));
                            }}>
                            <a><i class="fas fa-filter"></i></a>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 middle-content-table'>
                    {tableComponent}
                </div>
            </Container>);
    }
}

const data = {
    columns: [
        {
            label: '#',
            field: 'No',
            width: 150
        },
        {
            label: 'Partner',
            field: 'CustomerName',
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
            label: 'Debt amount',
            field: 'DebtAmount',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Start day',
            field: 'PayableDay',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Progress',
            field: 'CurrentStage',
            width: 200
        },
        {
            label: 'Status',
            field: 'Status',
            sort: 'asc',
            width: 100
        },
        {
            label: '',
            field: 'action',
            width: 150
        }
    ],
    rows: []
}

export default (ReceivableListByCollector);
