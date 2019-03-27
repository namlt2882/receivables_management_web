import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Form } from 'semantic-ui-react';
import { ContactService } from '../../../services/contact-service';
import { successAlert, errorAlert } from '../../common/my-menu';
import MyToolTip from '../../common/my-tooltip';
library.add(faPen);

class EditContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            formLoading: false,
            id: null,
            name: null,
            phone: null,
            address: null,
            isDebtor: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateContact = this.updateContact.bind(this);
    }
    updateContact() {
        this.setState({ formLoading: true });
        let contact = this.props.contact;
        let data = {
            Id: contact.Id,
            Type: contact.Type,
            IdNo: this.state.id,
            Name: this.state.name,
            Phone: this.state.phone,
            Address: this.state.address
        }
        ContactService.update(data).then(res => {
            contact.IdNo = data.IdNo;
            contact.Name = data.Name;
            contact.Phone = data.Phone;
            contact.Address = data.Address;
            this.props.updateReceivable()
            successAlert('Contact has been updated!');
            this.closeModal();
        }).catch(err => {
            errorAlert('Fail to update this contact! Please try again later.');
            console.error(err)
        })
    }
    openModal() {
        let contact = this.props.contact;
        this.setState({
            openModal: true,
            formLoading: false,
            id: contact.IdNo,
            name: contact.Name,
            phone: contact.Phone,
            address: contact.Address,
            isDebtor: contact.Type === 0
        })
    }
    closeModal() {
        this.setState({
            openModal: false
        })
    }
    render() {
        let contact = this.props.contact;
        let isDebtor = this.state.isDebtor;
        return (<div style={{ display: 'inline-block' }}>
            <FontAwesomeIcon icon='pen' size='sm' color='black' id={`edit-contact-${contact.Id}`}
                className='icon-btn' onClick={this.openModal} />
            <MyToolTip target={`edit-contact-${contact.Id}`} message='Edit contact'/>
            <Modal isOpen={this.state.openModal}>
                <ModalHeader className='text-center'>
                    Update contact
                </ModalHeader>
                <ModalBody>
                    <Form loading={this.state.formLoading} onSubmit={this.updateContact}>
                        {/* Id number */}
                        <Form.Input label='Id Number' required={isDebtor} type='text'
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
                        <Form.Input label='Address' required={isDebtor} type='text'
                            maxLength='100' placeholder='191 Hai Ba Trung Street, District 11, Ho Chi Minh City' value={this.state.address}
                            onChange={(e) => { this.setState({ address: e.target.value }) }} />

                        <button style={{ display: 'none' }} ref='btn'></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => {
                        this.refs.btn.click();
                    }}>Update</Button>
                    <Button color='secondary' onClick={this.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default EditContact;