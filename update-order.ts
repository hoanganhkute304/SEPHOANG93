import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    await updateDoc(doc(db, "wallpapers", "jett-jinx"), { order: 1 });
    await updateDoc(doc(db, "wallpapers", "sage-lny"), { order: 2 });
    console.log("Database updated successfully");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}

run();
