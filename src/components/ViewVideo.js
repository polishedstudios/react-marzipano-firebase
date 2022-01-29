import React from "react";
import Modal from 'react-bootstrap/Modal';
import '../style/App.css';

class ViewVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
    this.handleClose = this.handleClose.bind(this);
    this.sendResponse = this.sendResponse.bind(this);
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
    this.sendResponse();
    this.setState({ show: false });
  }

  sendResponse() {
    this.props.watchedVideo(this.props.id);
  }

  render() {
    return (
      <Modal
        centered
        size="lg"
        show={this.state.show}
        onHide={this.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
            <iframe src={this.props.video} height="432px" width="100%" title="Video"/>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ViewVideo;