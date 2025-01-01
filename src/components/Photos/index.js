import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false); // Track loading state for spinner
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { height } = useWindowSize();
  const [pageSize, setPageSize] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const location = useLocation();

  // Calculate page size dynamically based on screen height and width
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

    // Fetch photos from Firebase storage
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setLoading(true); // Show the loading spinner when switching tabs
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to the first page when the tab changes

    // Update the URL with the current page number and tab
    window.history.pushState({}, '', `?page=1&tab=${newValue}`);
    
    // Force the loading screen to show for 0.5 seconds
    setTimeout(() => {
      setLoading(false); // Hide loading spinner after 0.5 seconds
    }, 250);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setLoading(true); // Show the loading spinner when switching pages
    setCurrentPage(value);

    // Update the URL with the current page number
    window.history.pushState({}, '', `?page=${value}&tab=${activeTab}`);
    
    // Force the loading screen to show for 0.5 seconds
    setTimeout(() => {
      setLoading(false); // Hide loading spinner after 0.5 seconds
    }, 500);
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

  // Show loading screen if we are in the process of fetching new page/tab or photos are not loaded
  if (loading) {
    return (
      <Container>
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
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
