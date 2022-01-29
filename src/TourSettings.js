import { 
  livingroom, bathroom, outside,
  circle, info, link, question, video,
} from './images/images';

class TourSettings {

  getDefaultScene() {
    return "Outside";
  }

  getNewUser() {
    const newUser = { name: null, canPickupKey: true };
    return newUser;
  }

  getSceneImage(sceneName) {
    switch (sceneName) {
      default:
        return livingroom;
      case 'Living Room':
        return livingroom;
      case 'Bathroom':
        return bathroom;
      case 'Outside':
        return outside;
    }
  }

  getHotspotImage(hotspotType) {
    switch (hotspotType) {
      default:
        return circle;
      case 'link':
        return link;
      case 'info':
        return info;
      case 'question':
        return question;
      case 'video':
        return video;
    }
  }

  getHotspotInfo(hotspotType) {
    switch (hotspotType) {
      default:
        return false;
      case 'info': case 'video':
        return true;
    }
  }

}

export default new TourSettings();