import app from '../config';
import "firebase/firestore";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore/lite';

let db = getFirestore(app);
const coll = collection(db, 'scenes');

class FirebaseService {

  // --- GET ---

  async getScene(name) {
    const q = query(coll, where("name", "==", name));
    const data = await getDocs(q);

    let item = null;
    data.forEach((doc) => {
      item = {
        id: doc.id,
        name: doc.data().name,
        yaw: doc.data().initialViewParameters[0],
        pitch: doc.data().initialViewParameters[1],
        fov: doc.data().initialViewParameters[2]
      }
    });
    return item;
  }

}

export default new FirebaseService();