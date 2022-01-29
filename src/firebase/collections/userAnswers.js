import app from '../config';
import "firebase/firestore";
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore/lite';

let db = getFirestore(app);
const coll = collection(db, 'userAnswers');

class FirebaseService {

  // --- GET ---

  async getUserQuestion(userId, questionId) {
    const user = doc(coll, userId);
    const data = await getDoc(user);
    let arr = [];
    if (data.exists()) {
      Object.keys(data.data()).forEach(function (key) {
        if (key === questionId) {
          arr = data.data()[key];
        }
      });
    }
    return arr;
  }

  async getAllUserQuestions(userId) {
    const user = doc(coll, userId);
    const data = await getDoc(user);
    let arr = [];
    if (data.exists()) {
      arr = data.data();
    }
    return arr;
  }

  // --- UPDATE ---

  async updateUserQuestion(userId, questionId, arr) {
    const user = doc(coll, userId);
    const data = { [questionId]: arr }
    setDoc(user, data, { merge: true });
  }

}

export default new FirebaseService();