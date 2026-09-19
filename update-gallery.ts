import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const defaultGallery = [
  {
    title: "MOTH TO A FLAME",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789711334/clove-valorant-splash-live-wallpaper.mp4",
  },
  {
    title: "INFINIT CHRONICLES",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/jett-valorant-hd-live-wallpaper-for-pc.mp4",
  },
  {
    title: "GRANITE WAVES",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712320/jett-x-jinx-live-wallpaper.mp4",
  },
  {
    title: "MIRROR PROTOCOL",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712317/valorant-lny-sage-night-market-live-wallpaper.mp4",
  },
  {
    title: "SONNENLIED VOW",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/valorant-hd-live-wallpaper-for-pc.mp4",
  },
  {
    title: "WANDERING ODYSSEY",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789711334/clove-valorant-splash-live-wallpaper.mp4",
  },
  {
    title: "NEON SANCTUARY",
    image: "https://images.unsplash.com/photo-1560508180-03f285f67eae?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/jett-valorant-hd-live-wallpaper-for-pc.mp4",
  },
  {
    title: "CYBER ARCADE",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712320/jett-x-jinx-live-wallpaper.mp4",
  },
  {
    title: "NIGHT MARKET ECHOES",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712317/valorant-lny-sage-night-market-live-wallpaper.mp4",
  },
  {
    title: "ASTRAL AWAKENING",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/valorant-hd-live-wallpaper-for-pc.mp4",
  }
];

async function run() {
  try {
    await updateDoc(doc(db, "wallpapers", "jett-hd"), { gallery: defaultGallery });
    console.log("Firestore gallery updated with 10 stories successfully");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}

run();
