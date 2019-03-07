import React from 'react';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { TaskService } from '../../services/task-service';
import { Container, Header, Table } from 'semantic-ui-react';
import { numAsTime } from '../../utils/time-converter';
import { Link } from 'react-router-dom';

class TodayTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            todayTask: []
        }
    }
    componentDidMount() {
        available1();
        TaskService.getCollectorTodayTask(localStorage.getItem('id')).then(res => {
            this.setState({ todayTask: res.data });
            this.incrementLoading();
        })
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let hasTask = this.state.todayTask && this.state.todayTask.length > 0;
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <Container>
                <Header className='text-center'>Today task</Header>
            </Container>
            <div>{!hasTask ? 'You have no task today!' : null}</div>
            <Table fixed style={{ display: hasTask ? 'block' : 'none' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Task</Table.HeaderCell>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.todayTask.map(t => <Table.Row>
                        <Table.Cell>{t.Name}</Table.Cell>
                        <Table.Cell>{numAsTime(t.StartTime)}</Table.Cell>
                        <Table.Cell>
                            <Link to={`/receivable/${t.ReceivableId}/view`} >View receivable</Link>
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
        </div>);
    }
}

export default TodayTask;