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
                    <button className="btn btn-rcm-primary" onClick={this.onYes.bind(this)}>Yes</button>
                    <button className="btn btn-rcm-secondary" onClick={this.props.onHide}>Cancel</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmModal;