import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Grid, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { auth, engagementPhotosDb } from '../../firebase';

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!userId) {
        console.error('User not authenticated');
        return;
      }

      try {
        const userRef = doc(engagementPhotosDb, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setPhotos(userDoc.data().photos || []);
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  const handleDeletePhoto = async (photoId, photoUrl) => {
    try {
      // Deleting photo from Firebase Storage
      const storage = getStorage();
      const photoRef = ref(storage, `engagementpartyphotos/${photoId}.png`);
      await deleteObject(photoRef);

      // Deleting photo from Firestore photos array
      const userRef = doc(engagementPhotosDb, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const updatedPhotos = userDoc.data().photos.filter(photo => photo.id !== photoId);
        await updateDoc(userRef, { photos: updatedPhotos });
        setPhotos(updatedPhotos);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (loading) {
    return <Typography>Loading photos...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">My Photos</Typography>
      {photos.length === 0 ? (
        <Typography>No photos available</Typography>
      ) : (
        <Grid container spacing={2}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Box position="relative">
                <img src={photo.url} alt="User Photo" style={{ width: '100%', height: 'auto' }} />
                <IconButton
                  color="secondary"
                  onClick={() => handleDeletePhoto(photo.id, photo.url)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyPhotos;
