import app from '../config';
import "firebase/firestore";
import { getFirestore, collection, query, where, doc, addDoc, setDoc, getDoc, getDocs } from 'firebase/firestore/lite';
import settings from '../../TourSettings'

let db = getFirestore(app);
const coll = collection(db, 'users');

class FirebaseService {

  // --- GET ---

  async checkIfUserExists(name) {
    const user = await this.getUser(name);
    if (user) { return true; }
    else { return false; }
  }

  async getUser(name) {
    const q = query(coll, where("name", "==", name));
    const data = await getDocs(q);

    let item = null;
    data.forEach((doc) => {
      item = {
        id: doc.id,
        data: doc.data()
      }
    });
    return item;
  }

  async getUserScore(userId, scene) {
    const user = doc(coll, userId);
    const data = await getDoc(user);
    const field = "score" + scene;
    let score = 0;
    if (data.exists()) {
      Object.keys(data.data()).forEach(function (key) {
        if (key === field) {
          score = data.data()[key];
        }
      });
    }
    return score;
  }

  // --- CREATE ---

  async createUser(name) {
    const newUser = settings.getNewUser();
    newUser.name = name;
    await addDoc(collection(db, "users"), newUser);
  }

  // --- UPDATE ---

  async updateUserScore(userId, scene) {
    const user = doc(coll, userId);
    const data = await getDoc(user);
    let field = "score" + scene;
    field = field.replace(/ /g, '');
    let score = 0;
    if (data.exists()) {
      Object.keys(data.data()).forEach(function (key) {
        if (key === field) {
          score = data.data()[key];
        }
      });
    }
    score = score + 1;
    const newData = { [field]: score }
    setDoc(user, newData, { merge: true });
    return score;
  }

  updateUserUnlockedHotspots(userId, hotspot, status) {
    const user = doc(coll, userId);
    const data = { [hotspot]: status }
    setDoc(user, data, { merge: true });
  }

}

export default new FirebaseService();