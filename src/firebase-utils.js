import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";


// Ambil data asset secara real-time
const fetchAssets = (setAssets) => {
    const assetsCollection = collection(db, "assets");
    onSnapshot(assetsCollection, (snapshot) => {
        const assetsList = [];
        snapshot.forEach((doc) => {
            assetsList.push(doc.data().assetName);  // Menyesuaikan dengan field assetName
        });
        setAssets(assetsList);  // Update state dengan data terbaru
    });
};

// Fungsi untuk menambah asset baru
const addAsset = async (newAsset) => {
    try {
        await addDoc(collection(db, "assets"), {
            assetName: newAsset,  // Nama asset baru yang ditambahkan
        });
    } catch (error) {
        console.error("Error adding asset: ", error);
    }
};

export { fetchAssets, addAsset };
