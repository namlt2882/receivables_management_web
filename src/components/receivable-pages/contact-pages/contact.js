import React, { Component } from 'react';
import {
    Card, Table, CardBody, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    CardTitle, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserInjured, faUserFriends } from '@fortawesome/free-solid-svg-icons'
library.add(faUserInjured, faUserFriends);

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
            <Card className='contact'>
                <CardTitle>
                    <FontAwesomeIcon icon={this.props.isDebtor ? 'user-injured' : 'user-friends'}
                        color='black' size='md' style={{ marginRight: '10px' }} />
                    {this.props.title}
                </CardTitle>
                <CardBody>
                    {addable ? <a href='' onClick={this.add}>Add</a> : null}
                    {this.props.contacts.map((contact, i) => (<Table key={i} hover className='info-table'>
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
                                    <a style={{ marginRight: '10px' }} href='' onClick={this.edit}>Edit</a>
                                    {this.props.isDebtor ? null : <Button color='danger'>Delete</Button>}
                                </td>
                            </tr>
                        </tbody>
                    </Table>))}
                </CardBody>
            </Card>);
    }
}
export default Contact;