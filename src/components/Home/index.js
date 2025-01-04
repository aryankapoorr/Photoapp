import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, engagementPhotosDb } from '../../firebase'; // Adjust imports as needed
import './styles.css';

const Home = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedPhotos(Array.from(files));
    setOpenDialog(true); // Automatically open dialog after selecting files
  };

  const handleUpload = async () => {
    if (!selectedPhotos.length) return;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('User not authenticated');
      return;
    }

    const userRef = doc(engagementPhotosDb, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      alert('User document not found');
      return;
    }

    const userData = userDoc.data();
    const updatedPhotos = [...(userData.photos || [])];

    const storage = getStorage();

    for (const photo of selectedPhotos) {
      const photoId = new Date().getTime().toString() + Math.random().toString(36).substring(2);
      const storageRef = ref(storage, `engagementpartyphotos/${photoId}.png`);

      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Monitor upload progress (optional)
        },
        (error) => {
          console.error('Upload failed: ', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedPhotos.push({ id: photoId, url: downloadURL });

            // Update Firestore once all photos are processed
            if (selectedPhotos.indexOf(photo) === selectedPhotos.length - 1) {
              await updateDoc(userRef, { photos: updatedPhotos });
              alert('Photos uploaded successfully!');
              setOpenDialog(false);
              setSelectedPhotos([]);
            }
          } catch (error) {
            console.error('Failed to get download URL', error);
          }
        }
      );
    }
  };

  return (
    <Box className="home-container">
      <Typography variant="h4" className="greeting-text">
        Welcome to Aarti and Kevin's Engagement Party Photos!
      </Typography>

      <Box className="image-container">
        <img src="roscoe.jpeg" alt="Event Placeholder" className="placeholder-img" />
      </Box>

      <Button variant="contained" component="label" className="upload-button">
        Upload Photos
        <input type="file" multiple hidden onChange={handleFileSelect} />
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Photo Upload</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to upload {selectedPhotos.length} photo(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="secondary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
