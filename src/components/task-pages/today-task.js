import React from 'react';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { TaskService } from '../../services/task-service';
import { numAsTime } from '../../utils/time-converter';

import "./task.scss";
import { Divider } from 'semantic-ui-react';

class TodayTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            todayTask: []
        }
    }

    handleClick = (receivableId) => {
        if (receivableId) {
            this.props.history.push(`/receivable/${receivableId}/view`);
        }
    }

    componentDidMount() {
        document.title = 'Today task'
        available1();
        TaskService.getCollectorTodayTask(localStorage.getItem('id')).then(res => {
            this.setState({ todayTask: res.data });
            this.incrementLoading();
        })
    }
    render() {
        var index = 1;
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let hasTask = this.state.todayTask && this.state.todayTask.length > 0;
        return (
            <div className='col-sm-12 row justify-content-center'>
                <div className="hungdtq-header">
                    <h1>Today task</h1>
                    <Divider />
                </div>
                <div className="hungdtq-Wrapper">
                    <div className="hungdtq-Container">
                        <div style={{ fontSize: '2rem' }}>{!hasTask ? 'You have no task today!' : null}</div>
                        <table fixed style={{ display: hasTask ? 'table' : 'none' }} className="table table-hover task-table">
                            <thead className="thead-blue">
                                <tr>
                                    <th>No.</th>
                                    <th>Task Name</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.todayTask.map(t =>
                                    <tr onClick={this.handleClick.bind(this, t.ReceivableId)}>
                                        <td>{index++}</td>
                                        <td>{t.Name}</td>
                                        <td>{numAsTime(t.StartTime)}</td>
                                        <td>
                                            <p style={{ display: t.Status === 3 ? 'block' : 'none' }} className="btn btn-warning">
                                                {t.Status === 3 ? 'Late' : ""}
                                            </p>
                                            <p style={{ display: t.Status === 1 ? 'block' : 'none' }} className="btn btn-primary">
                                                {t.Status === 1 ? 'Doing' : ""}
                                            </p>
                                            <p style={{ backgroundColor: 'red', color: 'white', display: t.Status === 0 ? 'block' : 'none' }} className="btn">
                                                {t.Status === 0 ? 'Cancel' : ""}
                                            </p>
                                            <p style={{ display: t.Status === 2 ? 'block' : 'none' }} className="btn btn-success">
                                                {t.Status === 2 ? 'Done' : ""}
                                            </p>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>);
    }
}

export default TodayTask;