import React from "react";
import Marzipano from "marzipano";
import '../style/App.css';
import '../style/Login.css';
import { fbScenes, fbUsers } from '../firebase/service';
import settings from '../TourSettings';

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { assistant } from '../images/images';

const popover = (
  <Popover id="popover-basic" style={{ marginLeft: "-10px" }}>
    <Popover.Body>
      Welcome to an example <strong>virtual tour</strong> made by Polished Studios!
    </Popover.Body>
  </Popover>
);
const popover2 = (
  <Popover id="popover-basic" style={{ marginLeft: "-10px" }}>
    <Popover.Body>
      What may we call you?
    </Popover.Body>
  </Popover>
);


class Login extends React.Component {
  ref = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      formInvalid: false,
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.loadInitialScene();
    // activate chat boxes popups
    document.getElementById("image").click();
    document.getElementById("image2").click();
    document.getElementById("image3").click();
  }

  async loadInitialScene() {
    const defaultScene = settings.getDefaultScene();
    const s = await fbScenes.getScene(defaultScene);

    const instance = new Marzipano.Viewer(this.ref.current, {});
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180, 120 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({}, limiter);

    // Creates scene
    const image = settings.getSceneImage(defaultScene);
    const source = Marzipano.ImageUrlSource.fromString(image);
    const scene = instance.createScene({
      source, geometry, view
    });
    // Sets initial view direction
    const initialViewParameters = {
      yaw: s.yaw, pitch: s.pitch, fov: s.fov }
    scene.view().setParameters(initialViewParameters);
    
    // Rotates the camera to look around the room
    let autorotate = Marzipano.autorotate({
      yawSpeed: 0.04, // horizontal rotation speed
      targetPitch: null,
      targetFov: Math.PI / 2.4 // higher number = more zoom
    });
    instance.startMovement(autorotate);
    instance.setIdleMovement(200, autorotate);

    // Loads the scene
    scene.switchTo();
  }

  async submit() {
    const form = document.getElementById("name");
    if (form) {
      const name = form.value;
      if (name === "" || name === null) {
        this.setState({ formInvalid: true })
      }
      else {
        const userExists = await fbUsers.checkIfUserExists(name);
        if (userExists) {
          this.setState({ formInvalid: true })
        }
        else {
          this.setState({ formInvalid: false })
          await fbUsers.createUser(name);
          localStorage.setItem("user", name);
          window.location.href = "/tour";
        }
      }
    }
  }

  render() {
    return (
      <div id="pano" ref={this.ref}>
        <div className="grid">
          <div className="robot">
            <img id="robot" width="108%" src={assistant} alt="Robot"></img>
          </div>
          <div className="robot-chatbox1">
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
              <img id="image" width="10px" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Transparant.png" alt="."></img>
            </OverlayTrigger>
          </div>
          <div className="robot-chatbox2">
            <OverlayTrigger trigger="click" placement="right" overlay={popover2}>
              <img id="image2" width="10px" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Transparant.png" alt="."></img>
            </OverlayTrigger>
          </div>
          <div className="self-chatbox1">
            <OverlayTrigger trigger="click" placement="left" overlay={
              <Popover id="popover-basic" className="self" style={{ marginRight: "5px" }}>
                <Popover.Body>
                  <div style={{display: 'inline-block'}}>My name is</div>
                  <div style={{display: 'inline-table'}}>
                    <Form.Control
                      id="name"
                      style={{ backgroundColor: '#f7f7f7', display: 'inline', width: '103px', marginLeft: '6px' }}
                      size="sm"
                      type="text"
                      placeholder="John Doe"
                      isInvalid={this.state.formInvalid}
                    /> .
                    <Form.Control.Feedback type="invalid"
                      style={{margin: '0 0 -5px 6px'}}>This name is taken!</Form.Control.Feedback>
                  </div>
                </Popover.Body>
              </Popover>
            }>
              <img id="image3" width="10px" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Transparant.png" alt="."></img>
            </OverlayTrigger>
            <Button onClick={this.submit} variant="primary" style={{ border: '1px solid rgba(0, 0, 0, 0.1)', height: '37px' }}>
              <p>Start!</p>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;