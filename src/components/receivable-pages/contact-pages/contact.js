import React, { Component } from 'react';
import {
    Card, CardBody, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    CardTitle
} from 'reactstrap';
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
                {addable ? <FontAwesomeIcon icon='user-plus' size='md' color='black' className='icon-btn'
                    onClick={this.add} /> : null}
                {this.props.isDebtor ? this.props.contacts.map((contact, i) => (<Table key={i} hover className='info-table'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Id:</Table.Cell>
                            <Table.Cell>{contact.IdNo}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Name:</Table.Cell>
                            <Table.Cell>{contact.Name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Phone:</Table.Cell>
                            <Table.Cell>{contact.Phone}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Address:</Table.Cell>
                            <Table.Cell>{contact.Address}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                {AuthService.isCollector() ?
                                    <a style={{ marginRight: '10px' }} href='' onClick={this.edit}>Edit</a> : null}
                                {this.props.isDebtor ? null : <Button color='red'>Delete</Button>}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>)) : <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Id</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Phone</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.props.contacts.map((c, i) => (<Table.Row>
                                <Table.Cell>{i + 1}</Table.Cell>
                                <Table.Cell>{c.IdNo}</Table.Cell>
                                <Table.Cell>{c.Name}</Table.Cell>
                                <Table.Cell>{c.Phone}</Table.Cell>
                                <Table.Cell>{c.Address}</Table.Cell>
                                <Table.Cell>
                                    <FontAwesomeIcon icon='pen' size='md' color='black' className='icon-btn' />
                                    <FontAwesomeIcon icon='trash-alt' size='md' color='black' className='icon-btn' />
                                </Table.Cell>
                            </Table.Row>))}
                        </Table.Body>
                    </Table>}
            </Container>);
    }
}
export default Contact;