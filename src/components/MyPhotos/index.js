import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { auth, engagementPhotosDb } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import "./styles.css";

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

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

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      // Deleting photo from Firebase Storage
      const storage = getStorage();
      const photoRef = ref(storage, `engagementpartyphotos/${photoToDelete.id}.png`);
      await deleteObject(photoRef);

      // Deleting photo from Firestore photos array
      const userRef = doc(engagementPhotosDb, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const updatedPhotos = userDoc.data().photos.filter(photo => photo.id !== photoToDelete.id);
        await updateDoc(userRef, { photos: updatedPhotos });
        setPhotos(updatedPhotos);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
    }
  };

  const openDeleteDialog = (photo) => {
    setPhotoToDelete(photo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPhotoToDelete(null);
  };

  if (loading) {
    return <Typography>Loading photos...</Typography>;
  }

  return (
    <Box className="my-photos-container" style={{ marginTop: '64px' }}> {/* Added marginTop */}
      {photos.length === 0 ? (
        <Typography className="no-photos">No photos available</Typography>
      ) : (
        <Grid container className="photo-grid">
          {photos.map((photo) => (
            <Grid item xs={12} key={photo.id} className="photo-item">
              <div className="photo-container">
                <img src={photo.url} alt="User" className="photo-img" />
                <Button
                  onClick={() => openDeleteDialog(photo)}
                  className="delete-button"
                >
                  <DeleteIcon style={{ color: '#f44336', fontSize: '36px' }} />
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-photo-dialog-title"
        aria-describedby="delete-photo-dialog-description"
      >
        <DialogTitle id="delete-photo-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-photo-dialog-description">
            Are you sure you want to delete this photo? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePhoto} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPhotos;
