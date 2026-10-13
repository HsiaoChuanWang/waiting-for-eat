import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseClient.js";

async function uploadImage(path, file) {
  const storageReference = ref(storage, path);

  await uploadBytes(storageReference, file);

  return getDownloadURL(storageReference);
}

export { uploadImage };
