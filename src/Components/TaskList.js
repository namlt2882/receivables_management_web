import React, { Component } from 'react';
import TaskItem from './TaskItem';
class TaskList extends Component {
    render() {
        var { tasks } = this.props; // var tasks = this.props.tasks
        var elementTasks = tasks.map((task, index) => {
            return <TaskItem
                key={task.id}
                index={index}
                task={task}
                onUpdateStatus={this.props.onUpdateStatus}
                onDelete={this.props.onDelete}
                onUpdate={this.props.onUpdate}
            />
        });
        return (
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Username</th>
                        <th className="text-center">Password</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                name="filterName"
                            />
                        </td>
                        <td></td>
                        <td>
                            <select
                                className="form-control"
                                name="filterStatus"
                            >
                                <option value={-1}>All</option>
                                <option value={0}>InActive</option>
                                <option value={1}>Active</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                    {elementTasks}
                </tbody>
            </table>
        );
    }
}

export default TaskList;
