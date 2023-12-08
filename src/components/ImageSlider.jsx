import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imagen1 from "../img/ropa1.png";
import imagen2 from "../img/ropa2.png";
import imagen3 from "../img/ropa3.png";
import imagen4 from "../img/ropa4.png";

const images = [
  imagen1,
  imagen2,
  imagen3,
  imagen4,
  // Agrega más imágenes según sea necesario
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index} style={{ width: "500px", height: "300px" }}>
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
