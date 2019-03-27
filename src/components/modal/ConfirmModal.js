import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { Button, Icon } from 'semantic-ui-react';

class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.onYes = this.onYes.bind(this);
    }

    onYes() {
        if (this.props.callback) {
            this.props.callback(this.props.object);
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.show}>
                <ModalHeader>
                    <Icon name='question'/>
                    {this.props.header}
                </ModalHeader>
                <ModalBody>
                    {this.props.body}
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.onYes}>Yes</Button>
                    <Button color='secondary' onClick={this.props.onHide}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ConfirmModal;