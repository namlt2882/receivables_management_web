import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrashAlt, faUserFriends, faUserInjured, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import { AuthService } from '../../../services/auth-service';
import AddContact from './add-contact';
import EditContact from './edit-contact';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { NotificationContainer } from 'react-notifications';
library.add(faUserInjured, faUserFriends, faPen, faTrashAlt, faUserPlus);

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false
        }
        this.openModal = this.openModal.bind(this);
    }
    openModal(e) {
        e.preventDefault();
        this.setState({ openModal: true });
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
                    {this.props.isDebtor ? [
                        <FontAwesomeIcon icon={this.props.isDebtor ? 'user-injured' : 'user-friends'}
                            color='black' size='md' style={{ marginRight: '10px' }} />,
                        this.props.title,
                        (AuthService.isCollector() && !isFinished ? <div style={{ width: '30px', float: 'right', paddingRight: '20px' }}>
                            <EditContact contact={debtor} updateReceivable={updateReceivable} />
                        </div> : null)] : null}
                </Header>
                {addable && !isFinished ? <AddContact receivableId={receivableId} updateReceivable={updateReceivable} /> : null}
                {this.props.isDebtor ? this.props.contacts.map((contact) =>
                    (<div className='info-card'><table className='info-table'>
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
                                <td colSpan='2'>
                                    <a href='' onClick={this.openModal}>Contact list</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                        <Modal isOpen={this.state.openModal} className='big-modal'>
                            <NotificationContainer />
                            <ModalHeader className='bold-text'>
                                Contact list
                            </ModalHeader>
                            <ModalBody>
                                {this.props.children}
                            </ModalBody>
                            <ModalFooter>
                                <Button color='secondary' onClick={() => {
                                    this.setState({ openModal: false });
                                }}>Close</Button>
                            </ModalFooter>
                        </Modal>
                    </div>)) : <table className='table thin'>
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
                                    {!isFinished && AuthService.isCollector() ?
                                        [<EditContact contact={c} updateReceivable={updateReceivable} />]
                                        : <p>&nbsp;</p>}
                                </td>
                            </tr>))}
                            {this.props.contacts.length == 0 ? <tr>
                                <td colSpan='6' className='text-center'>No contact found!</td>
                            </tr> : null}
                        </tbody>
                    </table>}
            </Container>);
    }
}
export default Contact;