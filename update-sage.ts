import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const defaultGameFrames = [
  {
    id: "val",
    name: "VALORANT",
    shortName: "VALORANT",
    rank: "IMMORTAL 3",
    detail: "Peak Immortal • Top 1% Player",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/valorant-hd-live-wallpaper-for-pc.mp4",
    color: "#FF4655",
    glow: "rgba(255, 70, 85, 0.35)"
  },
  {
    id: "tft",
    name: "TEAMFIGHT TACTICS",
    shortName: "TFT",
    rank: "MASTER",
    detail: "Master 250 LP • Set Tactician",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789711334/clove-valorant-splash-live-wallpaper.mp4",
    color: "#E4AA24",
    glow: "rgba(228, 170, 36, 0.35)"
  },
  {
    id: "lol",
    name: "LEAGUE OF LEGENDS",
    shortName: "LOL",
    rank: "DIAMOND I",
    detail: "Diamond I 80 LP • Mid / ADC",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712320/jett-x-jinx-live-wallpaper.mp4",
    color: "#0AC8B9",
    glow: "rgba(10, 200, 185, 0.35)"
  },
  {
    id: "cs2",
    name: "COUNTER-STRIKE 2",
    shortName: "CS2",
    rank: "GLOBAL / 22K",
    detail: "Premier 22,500 • Faceit Level 10",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712317/valorant-lny-sage-night-market-live-wallpaper.mp4",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.35)"
  }
];

async function run() {
  try {
    const docRef = doc(db, "wallpapers", "sage-lny");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, { gameFrames: defaultGameFrames });
      console.log("Updated sage-lny with gameFrames in Firestore");
    } else {
      console.log("sage-lny document does not exist yet");
    }
  } catch(e) {
    console.error("Error updating Firestore:", e);
  }
  process.exit(0);
}

run();
