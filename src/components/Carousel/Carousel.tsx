import React, { useState } from 'react';
import Slider from 'react-slick';
// css styling
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Carousel.module.css';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [isPaused, setIsPaused] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    lazyLoad: true,
    beforeChange: () => setIsPaused(false),
    afterChange: () => setIsPaused(false),
  };

  return (
    <div className={styles['carousel-container']}>
      <Slider {...settings} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Carousel Slide ${index + 1}`}
              className={styles.carouselImage}
              loading="lazy"
              style={{
                width: '100%',
                maxWidth: '1200px',
                objectFit: 'cover',
                aspectRatio: '5231 / 3487',
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
