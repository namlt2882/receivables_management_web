import React from 'react';
import { Jumbotron, Button } from 'reactstrap';
// import { isLoggedIn, AuthService } from '../../services/auth-service';
import { Redirect } from 'react-router-dom';
import Component from './component';
import { FormGroup, Label, Input } from 'reactstrap';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        }
        // isLoggedIn(() => {
        //     this.setIsLoggedIn(true);
        // }, () => { });
        this.login = this.login.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    }

    setIsLoggedIn = (val) => {
        this.setState({ isLoggedIn: val })
    }

    login() {
        // AuthService.login(this.state.username, this.state.password)
        //     .then(res => {
        //         let token = res.data.token;
        //         let role = res.data.user.Role;
        //         localStorage.setItem('access_token', token);
        //         localStorage.setItem('role', role);
        //         window.location.href = '/'
        //     }).catch(err => {
        //         alert('Wrong username or password!')
        //     })
    }

    changeUsername(e) {
        this.setState({ username: e.target.value })
    }

    changePassword(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to={{ pathname: '/' }} />
        } else {
            return (<div className='container'>
                <div className='row justify-content-center align-self-center'>
                    <div className='col-sm-6' style={{ 'margin-top': '100px' }}>
                        <Jumbotron>
                            <h3>Receivable management system</h3>
                            <FormGroup>
                                <Label>Username</Label>
                                <Input type="text" required={true} placeholder="Username" value={this.state.username}
                                    onChange={this.changeUsername} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <Input type="password" required={true} placeholder="Password" value={this.state.password}
                                    onChange={this.changePassword} />
                            </FormGroup>
                            <Button onClick={this.login}>Login</Button>
                        </Jumbotron>
                    </div></div>
            </div>);
        }
    }
}

export default LoginPage;
