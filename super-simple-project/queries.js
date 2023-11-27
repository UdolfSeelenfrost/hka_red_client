import {collection, doc, setDoc, query, where, getDocs} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {app} from "./firebaseConfig.js";
const db = getFirestore(app);

const citiesRef = collection(db, "cities");

await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
await setDoc(doc(citiesRef, "LA"), {
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
await setDoc(doc(citiesRef, "DC"), {
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
await setDoc(doc(citiesRef, "TOK"), {
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
await setDoc(doc(citiesRef, "BJ"), {
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });

// Create a query against the collection.
const q = query(citiesRef, where("state", "==", "CA"));


const q1 = query(citiesRef, where("state", "==", "CO"), where("name", "==", "Denver"));
const q2 = query(citiesRef, where("state", "==", "CA"), where("population", "<", 1000000));

const querySnapshot = await getDocs(q2);
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
});

