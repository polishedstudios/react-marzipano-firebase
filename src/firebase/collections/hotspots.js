import app from '../config';
import "firebase/firestore";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite';

let db = getFirestore(app);
const coll = collection(db, 'hotspots');

class FirebaseService {

  // --- GET ---

  async getSceneHotspots(scene) {
    const q = query(coll, where("scene", "==", scene));
    const data = await getDocs(q);

    let items = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data()
      };
    });
    return items;
  }

  async getHotspotsByUnlockedBy(unlockedby) {
    const q = query(coll, where("unlockedby", "==", unlockedby));
    const data = await getDocs(q);

    let items = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data()
      };
    });
    return items;
  }

}

export default new FirebaseService();