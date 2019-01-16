import React, { Component } from 'react';
import './App.css';
import LeftSlideBar from './Components/LeftSlideBar';
import Control from './Components/Control';
import TaskList from './Components/TaskList';
import HeaderArea from './Components/HeaderArea';
import CreateNewUser from './Components/CreateNewUser';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
class ListUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [], //id: unique, username, password, status
      isDisplayForm: false,
      taskEditing: null
    }
  }

  componentWillMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var tasks = JSON.parse(localStorage.getItem('tasks'));
      this.setState({
        tasks: tasks
      });
    }
  }

  onToggleForm = () => {
    this.setState({
      isDisplayForm: !this.state.isDisplayForm,
      taskEditing: null
    });
  }


  onSubmit = (data) => {
    var { tasks } = this.state;
    if (data.id === '') {
      data.id = this.generateID();
      tasks.push(data);
    } else {
      //edit
      var index = this.findIndex(data.id);
      tasks[index] = data;
    }
    
    this.setState({
      tasks: tasks,
      taskEditing: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false
    });
  }

  onShowForm = () => {
    this.setState({
      isDisplayForm: true
    });
  }

  onUpdateStatus = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  findIndex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  }

  onDelete = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  onUpdate = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    var taskEditing = tasks[index];
    this.setState({
      taskEditing: taskEditing
    });
    this.onShowForm();
  }

  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4();
  }
  render() {
    var { tasks, isDisplayForm, taskEditing } = this.state; // var tasks = this.state.tasks
    var eleLeftBar = isDisplayForm ? <LeftSlideBar /> : '';
    var elemCreateNew = <CreateNewUser
      onSubmit={this.onSubmit}
      onCloseForm={this.onCloseForm}
      task={taskEditing}
    />;
    return (
      <Router>
        <div className="container">
          <HeaderArea />
          <div className="row">
            <div className="text-center col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1>User Management</h1>
            </div>
            <div className={isDisplayForm ? 'col-xs-2 col-sm-2 col-md-2 col-lg-2' : ''}>
              {/* form */}
              {eleLeftBar}
            </div>
            <div className={isDisplayForm ? 'col-xs-10 col-sm-10 col-md-10 col-lg-10'
              : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onToggleForm}
              >
                <span className="fas fa-columns mr-5"></span>DashBoard
                        </button>
              {/* Search - Sort */}
              <Control />
              {/* List */}
              <div className="row mt-15">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <TaskList
                    tasks={tasks}
                    onUpdateStatus={this.onUpdateStatus}
                    onDelete={this.onDelete}
                    onUpdate={this.onUpdate}
                  />
                  {elemCreateNew}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default ListUser;
