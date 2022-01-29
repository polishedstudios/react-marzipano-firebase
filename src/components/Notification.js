import React from "react";
import Button from 'react-bootstrap/Button';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import '../style/App.css';
import '../style/Question.css';

class Notification extends React.Component {
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
    this.setState({ show: false });
  }

  sendResponse() {
    const newpitch = this.props.pitch + 0.07;
    const params = { yaw: this.props.yaw, pitch: newpitch };
    const opts = { transitionDuration: 1200 };
    this.props.changeView([params, opts]);
  }

  render() {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        className="bg-dark"
        style={{ width: '100%', height: '100%' }}
      >
        <ToastContainer className="p-3">
          <Toast show={this.state.show} onClose={this.handleClose} style={{width: '260px'}}>
            <Toast.Header>
              <strong className="me-auto">New unlocked content</strong>
            </Toast.Header>
            <Toast.Body>You unlocked the <p style={{ color: '#792491', display: 'inline',margin: 0}}>
              {this.props.unlocked}</p>!
              <div><Button style={{marginTop: '3px', padding: '0.08rem 0.5rem'}} id="button" variant="primary" onClick={this.sendResponse}>View</Button></div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
  }
}

export default Notification;