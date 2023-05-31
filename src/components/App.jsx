import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import CustomLoader from './Loader/Loader';
import apiFetchImages from '../Services/Api';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!searchQuery) return;
  
      setIsLoading(true);
  
      try {
        const newImages = await apiFetchImages(searchQuery, page);
  
        setImages(prevImages => [...prevImages, ...newImages]);
        setShowLoadMoreButton(newImages.length === 12);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchImages();
  }, [searchQuery, page]);
  

  const handleSubmit = query => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
    setShowLoadMoreButton(true);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <CustomLoader />}
      {!isLoading && images.length > 0 && showLoadMoreButton && (
        <Button onClick={handleLoadMore} />
      )}
      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
