import React, { useEffect, useState, useCallback } from 'react';
import { Container, CircularProgress, Tabs, Tab, Box, Pagination, Modal, IconButton } from '@mui/material';
import { Masonry } from '@mui/lab';
import { Close as CloseIcon } from '@mui/icons-material';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import useWindowSize from './useWindowSize';
import { useLocation } from 'react-router-dom';
import './styles.css';

const PhotosPage = () => {
  const [photos, setPhotos] = useState({
    engagementDay: [],
    engagementParty: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { height } = useWindowSize();
  const [pageSize, setPageSize] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const location = useLocation();

  // Function to calculate page size dynamically based on screen height and width
  const calculatePageSize = useCallback(() => {
    const screenHeight = window.innerHeight;
    const approxPhotoHeight = 150; // Adjust based on typical photo height
    const columnCount = window.innerWidth <= 600 ? 2 : window.innerWidth <= 960 ? 3 : 4; // Match Masonry columns
  
    const rowsPerPage = Math.floor(screenHeight / (approxPhotoHeight + 16)); 
    setPageSize(rowsPerPage * columnCount);
  }, []);

  useEffect(() => {
    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);

    const fetchPhotos = async () => {
      try {
        const storage = getStorage();
        const engagementDayRef = ref(storage, 'engagementdayphotos/');
        const engagementPartyRef = ref(storage, 'engagementpartyphotos/');

        const [engagementDaySnapshot, engagementPartySnapshot] = await Promise.all([
          listAll(engagementDayRef),
          listAll(engagementPartyRef),
        ]);

        const engagementDayUrls = [];
        const engagementPartyUrls = [];

        await Promise.all(engagementDaySnapshot.items.map(async (item) => {
          const url = await getDownloadURL(item);
          engagementDayUrls.push(url);
        }));

        await Promise.all(engagementPartySnapshot.items.map(async (item) => {
          const url = await getDownloadURL(item);
          engagementPartyUrls.push(url);
        }));

        setPhotos({ engagementDay: engagementDayUrls, engagementParty: engagementPartyUrls });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos: ", error);
        setLoading(false);
      }
    };

    fetchPhotos();

    return () => window.removeEventListener('resize', calculatePageSize);
  }, [height, calculatePageSize]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to the first page when the tab changes
    window.history.pushState({}, '', `?page=${currentPage}&tab=${newValue}`);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.history.pushState({}, '', `?page=${value}&tab=${activeTab}`);
  };

  // Get the current photos based on the active tab and pagination
  const getPaginatedPhotos = (photos) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return photos.slice(startIndex, endIndex);
  };

  // Handle photo click to expand in modal
  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ paddingBottom: '100px' }}> {/* Add padding to prevent content overlap with pagination */}
      {/* Tabs Stacked Below Header */}
      <Box sx={{ width: '100%', position: 'sticky', top: 64, zIndex: 10, backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          centered
          aria-label="photo categories"
        >
          <Tab label="Engagement Day Photos" />
          <Tab label="Engagement Party Photos" />
        </Tabs>
      </Box>

      {/* Masonry Grid */}
      <div className="photo-grid">
        {getPaginatedPhotos(photos[activeTab === 0 ? 'engagementDay' : 'engagementParty']).map((photoUrl, index) => (
          <img
            key={index}
            src={photoUrl}
            alt={`Photo ${index}`}
            className="photo-img"
            onClick={() => handlePhotoClick(photoUrl)}
          />
        ))}
      </div>

      {/* Modal for Photo Enlargement */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-box">
          <IconButton onClick={handleCloseModal} className="modal-close-btn">
            <CloseIcon />
          </IconButton>
          <img src={selectedPhoto} alt="Expanded Photo" className="modal-photo" />
        </Box>
      </Modal>

      {/* Pagination fixed at the bottom */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 10,
        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
        padding: '10px 0',
      }}>
        <Pagination
          count={Math.ceil(
            photos[activeTab === 0 ? 'engagementDay' : 'engagementParty'].length / pageSize
          )}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default PhotosPage;
