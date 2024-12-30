import React, { useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';  // Camera icon for "Add Photo"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { engagementPhotosDb, auth } from '../../firebase';  // Firebase config
import './styles.css';

const LandingPage = () => {
  const [photo, setPhoto] = useState(null); // State to hold the captured photo
  const [openDialog, setOpenDialog] = useState(false); // Dialog for retake/upload prompt
  const [userId, setUserId] = useState(''); // Assume the user's ID is available
  const fileInputRef = React.createRef(); // Reference to the hidden file input

  const handleAddPhotoClick = () => {
    // Trigger the file input to open the native camera
    fileInputRef.current.click();
  };

  const handleNativeFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a URL for the image to preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      setOpenDialog(true); // Show dialog with options
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setPhoto(null); // Reset photo state
    setOpenDialog(false); // Close the dialog
  };

  const handleUpload = async () => {
    if (!photo) return;
  
    // Generate a unique photo ID
    const photoId = new Date().getTime().toString();
    const storage = getStorage();
    const storageRef = ref(storage, `engagementpartyphotos/${photoId}.png`);
  
    // Convert the photo to a Blob for upload
    const photoBlob = dataURLToBlob(photo);
  
    // Upload photo to Firebase Cloud Storage
    const uploadTask = uploadBytesResumable(storageRef, photoBlob);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Monitor upload progress (optional)
      },
      (error) => {
        console.error('Upload failed: ', error);
      },
      async () => {
        // Correct way to access the download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
  
          // Get the current user's ID
          const userId = auth.currentUser?.uid;
          if (!userId) {
            console.error('User not authenticated');
            return;
          }
  
          // Reference to the user's document in Firestore
          const userRef = doc(engagementPhotosDb, 'users', userId);
  
          // Fetch the current user document
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            console.error('User document not found');
            return;
          }
  
          // Update Firestore with the new photo URL and photo ID
          const userData = userDoc.data();
          const updatedPhotos = [...userData.photos || [], { id: photoId, url: downloadURL }];
  
          // Update the user's document with the new photos array
          await updateDoc(userRef, {
            photos: updatedPhotos,
          });
  
          setOpenDialog(false); // Close the dialog
          alert('Photo uploaded successfully!');
        } catch (error) {
          console.error('Failed to get download URL', error);
        }
      }
    );
  };
  
  

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: mimeString });
  };

  return (
    <div className="landing-page">
      {/* Floating Camera Icon for "Add Photo" */}
      <IconButton
        color="primary"
        onClick={handleAddPhotoClick}
        className="floating-camera-icon"
      >
        <PhotoCameraIcon />
      </IconButton>

      {/* Hidden file input to trigger native camera */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input
      />

      {/* Dialog for retake/upload prompt */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Photo Options</DialogTitle>
        <DialogContent>
          <img src={photo} alt="Captured" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRetake} color="primary">
            Retake
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LandingPage;
