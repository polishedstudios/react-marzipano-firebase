import React from "react";
import Modal from 'react-bootstrap/Modal';
import '../style/App.css';

class ViewImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate(prevProps, prevState) { // do not remove prevProps!
    if (prevState) {
      if (prevState.show === false && this.state.show === false) {
        this.setState({ show: true });
      }
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <Modal
        centered
        size="lg"
        show={this.state.show}
        onHide={this.handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
            <img src={this.props.image} width="100%" alt="[Image enlarged]"/>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ViewImage;