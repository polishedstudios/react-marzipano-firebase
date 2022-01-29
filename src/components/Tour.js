import React from "react";
import ReactDOM from "react-dom";
import Marzipano from "marzipano";
import '../style/App.css';
import '../style/Tour.css';
import { fbScenes, fbHotspots, fbUsers } from '../firebase/service';
import settings from '../TourSettings';
import Question from './Question';
import Notification from './Notification';
import ViewImage from './ViewImage';
import ViewVideo from "./ViewVideo";

class Tour extends React.Component {
  ref = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      scene: null,
      previousHotspot: null
    };
  }

  componentDidMount() {
    this.loadUser(localStorage.getItem("user"));
  }

  async loadUser(user) {
    const userData = await fbUsers.getUser(user);
    this.setState({ user: userData }, () => {
      this.loadScene(settings.getDefaultScene());
    });
  }

  // ------ Marzipano ------

  async loadScene(nextScene) {
    this.closeNotification();
    this.resetHotspotContainer();

    const s = await fbScenes.getScene(nextScene);

    const instance = new Marzipano.Viewer(this.ref.current, {});
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180, 120 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({}, limiter);

    // Creates scene
    const image = settings.getSceneImage(nextScene);
    const source = Marzipano.ImageUrlSource.fromString(image);
    const scene = instance.createScene({
      source, geometry, view
    });
    // Sets initial view direction
    const initialViewParameters = {
      yaw: s.yaw, pitch: s.pitch, fov: s.fov
    }
    scene.view().setParameters(initialViewParameters);
    this.setState({ scene: scene });

    // load hotspots here.
    this.loadHotspots(scene, nextScene);

    // Loads the scene
    scene.switchTo();
  }

  async loadHotspots(s, scene) {
    const hotspots = await fbHotspots.getSceneHotspots(scene);
    hotspots.forEach((hotspot) => {
      if (this.checkIfHotspotUnlocked(hotspot)) {
        let divHotspot = this.createHotspotElement(hotspot);
        divHotspot = this.createHotspotEvent(divHotspot, hotspot);
        s.hotspotContainer()
          .createHotspot(divHotspot, {
            id: hotspot.id,
            yaw: hotspot.data.yaw,
            pitch: hotspot.data.pitch
          });
      }
    });
  }

  resetHotspotContainer() {
    if (this.state.scene) {
      this.state.scene.hotspotContainer().destroy();
    }
  }

  // ------ Elements ------

  createHotspotElement(hotspot) {
    const type = hotspot.data.type;

    let divHotspot = document.createElement("div");
    divHotspot.classList.add("hotspot");
    let divHotspotOut = document.createElement("div");
    divHotspotOut.classList.add("out");
    let divHotspotIn = document.createElement("div");
    divHotspotIn.classList.add("in");
    let imgHotspot = document.createElement("img");
    imgHotspot.classList.add("hotspot-icon");

    imgHotspot.src = settings.getHotspotImage(type);

    divHotspotIn.appendChild(imgHotspot);
    divHotspot.appendChild(divHotspotOut);
    divHotspot.appendChild(divHotspotIn);

    if (settings.getHotspotInfo(type)) {
      divHotspot = this.createInfoHotspotElement(divHotspot, hotspot);
    }
    
    if (hotspot.data.tooltip) {
      divHotspot.classList.add("hotspot-tooltip");
      let tooltip = document.createElement("span");
      tooltip.classList.add("hotspot-tooltiptext");
      tooltip.innerHTML = hotspot.data.tooltip;
      divHotspot.appendChild(tooltip);
    }

    return divHotspot;
  }

  createInfoHotspotElement(divHotspot, hotspot) {
    let divInfo = document.createElement("div");
    divInfo.classList.add("tip");
    let header = document.createElement("div");
    header.classList.add("tip-header");
    let title = document.createElement("h5");
    title.innerHTML = hotspot.data.title;
    let box = document.createElement("div");
    box.classList.add("tip-body");
    header.appendChild(title);
    divInfo.appendChild(header);

    if (hotspot.data.size) { divInfo.classList.add(hotspot.data.size); }

    if (hotspot.data.info && Array.isArray(hotspot.data.info)) {
      hotspot.data.info.forEach(el => {
        let infoBox = document.createElement("div");
        infoBox.className = "info-box";
        infoBox.innerHTML = el;
        if (el.includes('"centered"')) { infoBox.classList.add("centered"); }

        if (el.includes("<img")) {
          let image = infoBox.getElementsByTagName("img");
          if (image.length > 0) {
            for (let img of image) {
              const type = img.alt;
              const link = img.getAttribute("link");
              if (type) {
                if (img.className === "image") { img.src = link; }
                else { img.src = settings.getHotspotImage(type.toLowerCase()); }

                if (type === "Video") {
                  let callback = function () { this.openVideo(hotspot.id, link); }
                  callback = callback.bind(this);
                  infoBox.onclick = callback;
                  infoBox.classList.add("is-active");
                  infoBox.style.textAlign = "right";
                }
                else if (type === "Info") {
                  let callback = function () { this.openImage(link); }
                  callback = callback.bind(this);
                  infoBox.onclick = callback;
                  infoBox.classList.add("is-active");
                  infoBox.style.textAlign = "right";
                }
              }
            }
          }
        }

        box.appendChild(infoBox);
        divInfo.appendChild(box);
      });
    }

    divHotspot.appendChild(divInfo);
    divHotspot.style.zIndex = 1000;
    divHotspot.id = hotspot.id;
    return divHotspot;
  }
  // ------ Events ------

  createHotspotEvent(divHotspot, hotspot) {
    let callback = function () {
      const exception = this.state.previousHotspot;
      this.closeAllInfo(exception, hotspot.id);
      this.setState({ previousHotspot: hotspot.id });
      switch (hotspot.data.type) {
        case 'item':
          this.pickupItem(hotspot);
          break;
        case 'info': case 'video':
          this.toggleInfo(hotspot);
          break;
        case 'question':
          this.loadQuestion(hotspot);
          break;
        case 'link':
          this.loadScene(hotspot.data.target);
          break;
        default:
          break;
      }
    }
    callback = callback.bind(this);
    divHotspot.addEventListener("click", callback);
    return divHotspot;
  }

  // ------ Opening components (rendering) ------

  loadQuestion(hotspot) {
    const that = this;
    ReactDOM.render(
      <Question completedQuestion={this.questionCallback}
        userId={that.state.user.id}
        id={hotspot.id}
        scene={hotspot.data.scene}
        question={hotspot.data.question}
        answers={hotspot.data.answers}
        correctAnswer={hotspot.data.correctAnswer}
        hint={hotspot.data.hint}
      />,
      document.getElementById('dialog-window')
    );
  }

  openImage = (image) => {
    ReactDOM.render(
      <ViewImage image={image} />,
      document.getElementById('dialog-window')
    );
  }

  openVideo(id, video) {
    ReactDOM.render(
      <ViewVideo watchedVideo={this.videoCallback}
        id={id}
        video={video} />,
      document.getElementById('dialog-window')
    );
  }

  openNotification(unlocked, yaw, pitch) {
    // supports only one notification at a time for now.
    ReactDOM.render(
      <Notification changeView={this.notificationCallback} unlocked={unlocked} yaw={yaw} pitch={pitch} />,
      document.getElementById('notifications')
    );
  }

  // ------ Closing/handling components/elements ------

  toggleInfo(hotspot) {
    const infoHotspot = document.getElementById(hotspot.id);
    if (!infoHotspot.classList.contains('tip-active')) {
      infoHotspot.style.zIndex = 1001;
      infoHotspot.classList.add('tip-active');
    }
    else {
      infoHotspot.style.zIndex = 1000;
      infoHotspot.classList.remove('tip-active');
    }
  }

  closeAllInfo(exception, newHotspot) {
    const hotspots = this.state.scene.hotspotContainer().listHotspots();
    hotspots.forEach(h => {
      const className = h._domElement.className;
      if (className.includes("tip-active") && newHotspot !== exception) {
        const domHotspot = document.getElementById(h._coords.id);
        domHotspot.style.zIndex = 1000;
        domHotspot.classList.remove("tip-active");
      }
    });
  }

  closeNotification() {
    const buttons = document.getElementsByClassName("btn-close");
    if (buttons) {
      if (buttons[0]) { buttons[0].click(); }
    }
  }

  notificationCallback = (childData) => {
    this.state.scene.lookTo(childData[0], childData[1]);
  }

  // ------ Unlocking ------

  checkIfHotspotUnlocked(hotspot) {
    // if a hotspot is unlockable by something,
    // it will have a field called 'unlockedby'.
    if (hotspot.data.unlockedby) {
      let result = false;
      Object.entries(this.state.user.data).map(([key, value]) => {
        if (key === hotspot.data.unlockedby) {
          result = value;
        }
      });
      return result;
    }
    else { return true; }
  }

  unlockContent(unlocked, unlockedMsg, unlockedBool, getsHotspot) {
    this.setState(prevState => {
      let user = Object.assign({}, prevState.user);
      user.data[unlocked] = unlockedBool;
      return { user };
    });
    fbUsers.updateUserUnlockedHotspots(this.state.user.id, unlocked, unlockedBool);
    if (getsHotspot === true) { this.addNewlyUnlockedHotspot(unlockedMsg, unlocked); }
  }

  async addNewlyUnlockedHotspot(name, unlockedby) {
    const hotspots = await fbHotspots.getHotspotsByUnlockedBy(unlockedby);
    hotspots.forEach(hotspot => {
      let divHotspot = this.createHotspotElement(hotspot);
      divHotspot = this.createHotspotEvent(divHotspot, hotspot);
      this.state.scene.hotspotContainer()
        .createHotspot(divHotspot, {
          id: hotspot.id,
          yaw: hotspot.data.yaw,
          pitch: hotspot.data.pitch
        });
      this.openNotification(name, hotspot.data.yaw, hotspot.data.pitch);
    });
  }
  
  pickupItem(hotspot) {
    if (hotspot.id === "OS-ITEM-1") {
      this.unlockContent("key", "apartment", true, true);
      this.unlockContent("canPickupKey", null, false, false);
    }
    const hotspots = this.state.scene.hotspotContainer().listHotspots();
    hotspots.forEach(h => {
      if (h._coords.id === hotspot.id) {
        this.state.scene.hotspotContainer().destroyHotspot(h);
      }
    });
  }

  questionCallback = (childData) => {
    if (childData) {
      // const scene = childData[0];
      const hotspotId = childData[1];
      // const sceneScore = childData[2];
      let unlocked = null;
      let unlockedMsg = null;
      if (hotspotId === "LR-Q-1") {
        unlocked = "bathroom";
        unlockedMsg = "bathroom";
        this.unlockContent(unlocked, unlockedMsg, true, true);
      }
    }
  }

  videoCallback = (childData) => {
    if (childData) {
      if (childData === "LR-V-1") {
        const unlocked = "fridge";
        const unlockedMsg = "fridge";
        if (this.state.user.data[unlocked] !== true) {
          this.unlockContent(unlocked, unlockedMsg, true, true);
        }
      }
    }
  }

  render() {
    return (
      <div id="pano" ref={this.ref}>
        <div id="dialog-window"></div>
        <div id="notifications" className="notifications"></div>
      </div>
    );
  }
}

export default Tour;
