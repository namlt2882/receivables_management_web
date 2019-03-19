import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
    }

    onYes(){
        this.props.callback(this.props.object);
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {this.props.body}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.onYes.bind(this)}>Yes</Button>
                    <Button variant="warning" onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmModal;