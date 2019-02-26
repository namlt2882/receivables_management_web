import React from 'react';
import { Jumbotron, Button } from 'reactstrap';
// import { isLoggedIn, AuthService } from '../../services/auth-service';
import { Redirect } from 'react-router-dom';
import Component from './component';
import { FormGroup, Label, Input } from 'reactstrap';
import { isLoggedIn, AuthService } from '../../services/auth-service'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faKey, faUser);

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        }
        isLoggedIn(() => {
            this.setIsLoggedIn(true);
        }, () => { });
        this.login = this.login.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    }

    setIsLoggedIn = (val) => {
        this.setState({ isLoggedIn: val })
    }

    login() {
        AuthService.login(this.state.username, this.state.password)
            .then(res => {
                window.location.href = '/'
            }).catch(err => {
                alert('Wrong username or password!')
            })
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
                            <h3 style={{ color: 'blue' }}>Receivable management system</h3>
                            <FormGroup>
                                <Label>
                                    <FontAwesomeIcon icon='user' size='lg' color='black' style={{ marginRight: '10px' }} />
                                    Username</Label>
                                <Input type="text" required={true} placeholder="Username" value={this.state.username}
                                    onChange={this.changeUsername} />
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    <FontAwesomeIcon icon='key' size='lg' color='black' style={{ marginRight: '10px' }} />
                                    Password</Label>
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
