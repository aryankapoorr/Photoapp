import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// Function to fetch URLs for photos in a given folder
export const getPhotoUrls = async (folderName) => {
  const storage = getStorage(); // Get Firebase Storage instance
  const folderRef = ref(storage, folderName); // Reference to the folder in Firebase Storage
  
  try {
    const folderSnapshot = await listAll(folderRef); // List all items in the folder

    // Map over items to fetch their download URLs
    const urls = await Promise.all(
      folderSnapshot.items.map((itemRef) => getDownloadURL(itemRef))
    );

    return urls; // Return the list of URLs
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error; // Rethrow error if something goes wrong
  }
};
