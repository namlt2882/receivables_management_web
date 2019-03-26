import React, { Component } from 'react';
import { Button, Container, Header, Table } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserInjured, faUserFriends, faPen, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../../services/auth-service';
library.add(faUserInjured, faUserFriends, faPen, faTrashAlt, faUserPlus);

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            mouseIn: false
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    edit(e) {
        e.preventDefault();
    }
    add(e) {
        e.preventDefault();
    }
    render() {
        let addable = true;
        let isFinished = this.props.isFinished;
        if (this.props.isDebtor) {
            // will add if debtor not existed
            if (this.props.contacts == 0) {
                addable = true;
            } else {
                addable = false;
            }
        }
        return (
            <Container style={this.props.style}>
                <Header>
                    <FontAwesomeIcon icon={this.props.isDebtor ? 'user-injured' : 'user-friends'}
                        color='black' size='md' style={{ marginRight: '10px' }} />
                    {this.props.title}
                </Header>
                {addable && !isFinished ? <FontAwesomeIcon icon='user-plus' size='md' color='black' className='icon-btn'
                    onClick={this.add} /> : null}
                {this.props.isDebtor ? this.props.contacts.map((contact, i) =>
                    (<table key={i} hover className='info-table'>
                        <tbody>
                            <tr>
                                <td>Id:</td>
                                <td>{contact.IdNo}</td>
                            </tr>
                            <tr>
                                <td>Name:</td>
                                <td>{contact.Name}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>{contact.Phone}</td>
                            </tr>
                            <tr>
                                <td>Address:</td>
                                <td>{contact.Address}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    {AuthService.isCollector() && !isFinished ?
                                        <a style={{ marginRight: '10px' }} href='' onClick={this.edit}>Edit</a> : null}
                                </td>
                            </tr>
                        </tbody>
                    </table>)) : <table className='table thin'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.contacts.map((c, i) => (<tr>
                                <td>{i + 1}</td>
                                <td>{c.IdNo}</td>
                                <td>{c.Name}</td>
                                <td>{c.Phone}</td>
                                <td>{c.Address}</td>
                                <td>
                                    {!isFinished ? <FontAwesomeIcon icon='pen' size='md' color='black' className='icon-btn' /> : null}
                                    {!isFinished ? <FontAwesomeIcon icon='trash-alt' size='md' color='black' className='icon-btn' /> : null}
                                </td>
                            </tr>))}
                        </tbody>
                    </table>}
            </Container>);
    }
}
export default Contact;