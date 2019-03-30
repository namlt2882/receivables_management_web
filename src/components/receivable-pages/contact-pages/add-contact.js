import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Form } from 'semantic-ui-react';
import { ContactService } from '../../../services/contact-service';
import { successAlert, errorAlert } from '../../common/my-menu';
import MyToolTip from '../../common/my-tooltip';
library.add(faUserPlus);

class AddContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            formLoading: false,
            id: null,
            name: null,
            phone: null,
            address: null
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addContact = this.addContact.bind(this);
    }
    addContact() {
        this.setState({ formLoading: true });
        let data = {
            Type: 1,
            IdNo: this.state.id,
            Name: this.state.name,
            Phone: this.state.phone,
            Address: this.state.address,
            ReceivableId: this.props.receivableId
        }
        ContactService.create(data).then(res => {
            let newContact = res.data;
            this.props.updateReceivable(undefined, (receivable) => {
                let contacts = receivable.Contacts;
                if (!contacts) {
                    contacts = [];
                }
                contacts.unshift(newContact);
                receivable.Contacts = contacts;
            });
            this.setState({ formLoading: false, openModal: false });
            successAlert(`${newContact.Name} has been added to contact list of this receivable!`);
        }).catch(err => {
            errorAlert('Fail to add new contact, please try again!');
            console.error(err);
        })
    }
    openModal() {
        this.setState({
            openModal: true,
            formLoading: false,
            id: null,
            name: null,
            phone: null,
            address: null
        })
    }
    closeModal() {
        this.setState({
            openModal: false
        })
    }
    render() {
        return (<div style={{ display: 'inline-block' }}>
            <FontAwesomeIcon icon='user-plus' size='md' color='black' id='add-contact'
                className='icon-btn' onClick={this.openModal} />
            <MyToolTip target='add-contact' message='Add contact' />
            <Modal isOpen={this.state.openModal}>
                <ModalHeader className='text-center'>
                    New relatives contact
                </ModalHeader>
                <ModalBody>
                    <Form loading={this.state.formLoading} onSubmit={this.addContact}>
                        {/* Id number */}
                        <Form.Input label='Id Number' type='text'
                            placeholder='Ex: 273 559 671' value={this.state.id}
                            pattern="[0-9]{9,12}" title='9 or 12 digit' maxLength='12'
                            onChange={(e) => { this.setState({ id: e.target.value }) }} />
                        {/* Name */}
                        <Form.Input label='Name' required type='text'
                            maxLength='100' placeholder='John Adam' value={this.state.name}
                            onChange={(e) => { this.setState({ name: e.target.value }) }} />
                        {/* Phone */}
                        <Form.Input label='Phone' required type='tel'
                            pattern="[0-9]{10,12}" maxLength="12" title='10 or 12 digit phone number'
                            placeholder='Ex: 888 888 8888' value={this.state.phone}
                            onChange={(e) => { this.setState({ phone: e.target.value }) }} />
                        {/* Address */}
                        <Form.Input label='Address' type='text'
                            maxLength='100' placeholder='191 Hai Ba Trung Street, District 11, Ho Chi Minh City' value={this.state.address}
                            onChange={(e) => { this.setState({ address: e.target.value }) }} />

                        <button style={{ display: 'none' }} ref='btn'></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => {
                        this.refs.btn.click();
                    }}>Add</Button>
                    <Button color='secondary' onClick={this.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default AddContact;