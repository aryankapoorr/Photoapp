import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  CircularProgress,
  Box,
  Pagination,
  Modal,
  IconButton,
  Tabs,
  Tab,
  Fade,
  Typography,
  ImageListItemBar,
  ImageListItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { doc, getDocs, collection } from 'firebase/firestore';
import { Masonry } from '@mui/lab';
import { engagementPhotosDb, auth } from '../../firebase';  // Firebase config
import './styles.css';

const PhotosPage = () => {
  const [photos, setPhotos] = useState({
    engagementDay: [],
    engagementParty: [],
  });
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [nextPhotos, setNextPhotos] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photosPerPage = 15;

  useEffect(() => {
    console.log('users')
    console.log(users)
  }, [users])
  

  useEffect(() => {
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

        // Fetch user names and create mapping to photos
        const userDocs = await getDocs(collection(engagementPhotosDb, 'users'));
        const userNameMap = {};
        userDocs.forEach(doc => {
          const userData = doc.data();
          if (userData.photos) {
            userData.photos.forEach(photo => {
              userNameMap[photo.url] = userData.name
            });
          }
        });


        setUsers(userNameMap);
        setLoading(false);
        setCurrentPhotos(engagementDayUrls.slice(0, photosPerPage)); // Default to Engagement Day
      } catch (error) {
        console.error("Error fetching photos: ", error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleTabChange = (event, newValue) => {
    setIsTransitioning(true);
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page for the new tab
    const next = getPaginatedPhotos(1, newValue);

    // Delay state update until fade-out completes
    setTimeout(() => {
      setCurrentPhotos(next);
      setIsTransitioning(false);
    }, 300); // Match this with the fade-out duration
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const handlePageChange = (event, value) => {
    setIsTransitioning(true);
    const next = getPaginatedPhotos(value, activeTab);
    setNextPhotos(next);

    // Delay state update until fade-out completes
    setTimeout(() => {
      setCurrentPhotos(next);
      setCurrentPage(value);
      setIsTransitioning(false);
    }, 300); // Match this with the fade-out duration
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const getPaginatedPhotos = useCallback((page, tab) => {
    const startIndex = (page - 1) * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    const currentPhotoSet = photos[tab === 0 ? 'engagementDay' : 'engagementParty'];
    return currentPhotoSet.slice(startIndex, endIndex);
  }, [photos]);

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
      {/* Tabs for Switching Streams */}
      <Box>
        <Tabs value={activeTab} 
            onChange={handleTabChange} 
            allowScrollButtonsMobile
            centered 
            position="sticky"
            variant="fullWidth"
            scrollButtons="auto"
        >
          <Tab label="Engagement Day" />
          <Tab label="Engagement Party" />
        </Tabs>
      </Box>

      {/* Masonry Image List */}
      <Fade in={!isTransitioning}>
        <Masonry
          columns={{ xs: 3, sm: 3, md: 3 }}
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          {currentPhotos.map((photoUrl, index) => (
            <div key={index} onClick={() => handlePhotoClick(photoUrl)} className="photo-container">
                <ImageListItem>
              <img
                src={photoUrl}
                alt={`Photo ${index}`}
                className="photo-img"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                loading="lazy"
              />
              { activeTab === 1 && users[photoUrl] ? <ImageListItemBar
                subtitle={users[photoUrl]}
            /> : <span></span>}
            </ImageListItem>
            </div>
          ))}
        </Masonry>
      </Fade>

      {/* Pagination Fixed at Bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
          zIndex: 10,
          padding: 1,
          textAlign: 'center',
        }}
        className='pagination-box'
      >
        <Pagination
          shape='rounded'
          count={Math.ceil(
            photos[activeTab === 0 ? 'engagementDay' : 'engagementParty'].length / photosPerPage
          )}
          page={currentPage}
          onChange={handlePageChange}
          color="705C53"
          sx={{
            justifyContent: 'center',
            display: 'flex',
            color: '#705C53', // Custom color for the text
          }}
        />
      </Box>

      {/* Padding to Prevent Last Row Being Covered */}
      <Box sx={{ height: 80 }} />

      {/* Modal for Enlarged Photo */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-box">
          <img src={selectedPhoto} alt="Expanded Photo" className="modal-photo" />
          <IconButton onClick={handleCloseModal} className="modal-close-btn">
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </Container>
  );
};

export default PhotosPage;
