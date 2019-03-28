import React, { Component } from 'react';
import { Button, Container, Header, Table } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserInjured, faUserFriends, faPen, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../../services/auth-service';
import EditContact from './edit-contact';
import MyToolTip from '../../common/my-tooltip';
import AddContact from './add-contact';
library.add(faUserInjured, faUserFriends, faPen, faTrashAlt, faUserPlus);

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        let contacts = this.props.contacts;
        let addable = true;
        let isFinished = this.props.isFinished;
        let debtor = null;
        let receivableId = this.props.receivableId;
        if (this.props.isDebtor) {
            // will add if debtor not existed
            if (contacts == 0) {
                addable = true;
            } else {
                addable = false;
            }
            debtor = contacts.length > 0 ? contacts[0] : null;
        }
        let updateReceivable = this.props.updateReceivable;
        return (
            <Container style={this.props.style}>
                <Header>
                    <FontAwesomeIcon icon={this.props.isDebtor ? 'user-injured' : 'user-friends'}
                        color='black' size='md' style={{ marginRight: '10px' }} />
                    {this.props.title}
                    {AuthService.isCollector() && !isFinished && this.props.isDebtor ? <div style={{ width: '30px', float: 'right', paddingRight: '20px' }}>
                        <EditContact contact={debtor} updateReceivable={updateReceivable} />
                    </div> : null}
                </Header>
                {addable && !isFinished ? <AddContact receivableId={receivableId} updateReceivable={updateReceivable} /> : null}
                {this.props.isDebtor ? this.props.contacts.map((contact) =>
                    (<table hover className='info-table'>
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
                            {this.props.contacts.map((c, i) => (<tr key={i}>
                                <td>{i + 1}</td>
                                <td>{c.IdNo}</td>
                                <td>{c.Name}</td>
                                <td>{c.Phone}</td>
                                <td>{c.Address}</td>
                                <td>
                                    {!isFinished ?
                                        [<EditContact contact={c} updateReceivable={updateReceivable} />]
                                        : null}
                                </td>
                            </tr>))}
                        </tbody>
                    </table>}
            </Container>);
    }
}
export default Contact;