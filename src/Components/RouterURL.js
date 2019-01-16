import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import TaskList from './TaskList';
import CreateNewUser from './CreateNewUser';
class RouterURL extends Component {
	render() {
		return (
			<div>
				<Switch>
					<Route exact path="/" component={TaskList} />
					<Route path="/create-new-user" component={CreateNewUser} />
					<Router component={TaskList} />
				</Switch>
			</div>
		);
	}
}

export default RouterURL;
