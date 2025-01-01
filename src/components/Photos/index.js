import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Tabs, Tab, Box, Pagination, Modal, IconButton } from '@mui/material';
import { Masonry } from '@mui/lab';
import { Close as CloseIcon } from '@mui/icons-material';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import useWindowSize from './useWindowSize';
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

  useEffect(() => {
    const calculatePageSize = () => {
        const screenHeight = window.innerHeight;
        const approxPhotoHeight = 150; // Adjust based on typical photo height
        const columnCount = window.innerWidth <= 600 ? 2 : window.innerWidth <= 960 ? 3 : 4; // Match Masonry columns
      
        const rowsPerPage = Math.floor(screenHeight / (approxPhotoHeight + 16)); 
      setPageSize(rowsPerPage * columnCount);
    };

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
  }, [height]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to the first page when the tab changes
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getPaginatedPhotos = (photos) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return photos.slice(startIndex, endIndex);
  };

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setOpenModal(true);
  };

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
    <Container>

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
      <Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={2}>
        {getPaginatedPhotos(photos[activeTab === 0 ? 'engagementDay' : 'engagementParty']).map((photoUrl, index) => (
          <img
            key={index}
            src={photoUrl}
            alt={`Photo ${index}`}
            className="photo-img"
            onClick={() => handlePhotoClick(photoUrl)}
          />
        ))}
      </Masonry>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Pagination
          count={Math.ceil(
            photos[activeTab === 0 ? 'engagementDay' : 'engagementParty'].length / pageSize
          )}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          className='pagination'
        />
      </Box>

      {/* Modal for Photo Enlargement */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-box">
          <IconButton onClick={handleCloseModal} className="modal-close-btn">
            <CloseIcon />
          </IconButton>
          <img src={selectedPhoto} alt="Expanded Photo" className="modal-photo" />
        </Box>
      </Modal>
    </Container>
  );
};

export default PhotosPage;
