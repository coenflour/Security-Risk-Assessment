import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const fetchAssets = (setAssets) => {
    const assetsCollection = collection(db, "assets");
    onSnapshot(assetsCollection, (snapshot) => {
        const assetsList = [];
        snapshot.forEach((doc) => {
            assetsList.push(doc.data().assetName);  
        });
        setAssets(assetsList);  
    });
};

const addAsset = async (newAsset) => {
    try {
        await addDoc(collection(db, "assets"), {
            assetName: newAsset,
        });
    } catch (error) {
        console.error("Error adding asset: ", error);
    }
};

export { fetchAssets, addAsset };
