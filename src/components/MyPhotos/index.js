import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { auth, engagementPhotosDb } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css'; // Importing the CSS file
import Loading from '../Loading';
import NoPhotos from '../NoPhotos';

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
      const storage = getStorage();
      const photoRef = ref(storage, `engagementpartyphotos/${photoToDelete.id}.png`);
      await deleteObject(photoRef);

      const userRef = doc(engagementPhotosDb, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const updatedPhotos = userDoc.data().photos.filter((photo) => photo.id !== photoToDelete.id);
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
    return <Loading />;
  }

  return (
    <Box className="my-photos-container" style={{ marginTop: '64px' }}>
      {photos.length === 0 ? (
        <NoPhotos />
      ) : (
        <ImageList cols={2} gap={8} className="photo-grid">
          {photos.map((photo) => (
            <ImageListItem key={photo.id} className="photo-item">
              <img src={photo.url} alt="User" className="photo-img" />
              <Button
                onClick={() => openDeleteDialog(photo)}
                className="delete-button"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 1,
                  borderRadius: '50%',
                }}
              >
                <DeleteIcon style={{ color: '#f44336', fontSize: '35px' }} />
              </Button>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-photo-dialog-title"
        aria-describedby="delete-photo-dialog-description"
        variant="primary"
        sx={{
            color: '#EDDFE0'
        }}
      >
        <DialogTitle id="delete-photo-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-photo-dialog-description">
            Are you sure you want to delete this photo?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{color: '#705C53'}}>
            Cancel
          </Button>
          <Button onClick={handleDeletePhoto} sx={{color: 'red'}}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPhotos;
