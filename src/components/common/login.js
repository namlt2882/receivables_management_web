import { library } from '@fortawesome/fontawesome-svg-core';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import { AuthService, isLoggedIn } from '../../services/auth-service';
import Component from './component';
import { available1 } from './loading-page';
library.add(faKey, faUser);

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            isFail: false,
            formLoading: false
        }
        isLoggedIn(() => {
            this.setIsLoggedIn(true);
        }, () => { });
        this.login = this.login.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    }

    componentDidMount() {
        document.title = "Login"
        available1();
    }

    setIsLoggedIn = (val) => {
        this.setState({ isLoggedIn: val })
    }

    login() {
        this.setState({ formLoading: true });
        AuthService.login(this.state.username, this.state.password)
            .then(res => {
                window.location.href = '/'
            }).catch(err => {
                this.setState({ formLoading: false, isFail: true });
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
            return (<div style={{
                backgroundImage: 'url(/images/currency.jpg)',
                backgroundSize: '100% 100%',
                width: '100 %'
            }}>
                <div className='row justify-content-center align-self-center'>
                    <div className='col-sm-4' style={{
                        marginTop: '100px',
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '5px'
                    }}>
                        <div className='text-center'><h2>Receivable management system</h2></div>
                        <br />
                        <Form onSubmit={this.login} error={this.state.isFail} loading={this.state.formLoading}>
                            <Form.Input label='Username' required placeholder='Ex: namlt'
                                icon='users' iconPosition='left'
                                value={this.state.username} onChange={this.changeUsername} />
                            <Form.Input label='Password' type='password' required placeholder='Password'
                                icon='key' iconPosition='left'
                                value={this.state.password} onChange={this.changePassword} />
                            {/* Message */}
                            {this.state.isFail ? <Message error
                                header='Wrong username or password'
                                content='Please check your username and password again!' /> : null}
                            <Button color='primary'>Login</Button>
                        </Form>
                    </div>
                </div>
            </div>);
        }
    }
}

export default LoginPage;
