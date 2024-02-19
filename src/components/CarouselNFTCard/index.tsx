import React from "react";
import styled from "styled-components";
import CartIcon from "static/icon-cart.svg";

interface CarouselNFTCardProps {
  title: string;
  description: string;
  images: string[];
  buttonText: string;
  onClick: () => void;
}

const CardContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const CarouselContainer = styled.div`
  width: 368px;
  height: 368px;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
`;

const CarouselImages = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CarouselNFTCard: React.FC<CarouselNFTCardProps> = ({
  title,
  description,
  images,
  buttonText,
  onClick,
}) => {
  return (
    <CardContainer>
      <CardContent>
        <h2>{title}</h2>
        <p>{description}</p>
      </CardContent>
      <CarouselContainer>
        <CarouselImages>
          {images.map((image, index) => (
            <Image key={index} src={image} alt={`Image ${index}`} />
          ))}
        </CarouselImages>
      </CarouselContainer>
      <ButtonContainer>
        <svg
          width="153"
          height="52"
          viewBox="0 0 153 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_494_13304)">
            <rect x="107" y="6" width="40" height="40" rx="20" fill="#9933FF" />
            <path
              d="M117 16H118.306C118.552 16 118.675 16 118.774 16.0452C118.861 16.0851 118.935 16.1492 118.987 16.2299C119.046 16.3215 119.063 16.4433 119.098 16.6869L119.571 20M119.571 20L120.623 27.7314C120.757 28.7125 120.824 29.2031 121.058 29.5723C121.265 29.8977 121.561 30.1564 121.911 30.3174C122.309 30.5 122.804 30.5 123.794 30.5H132.352C133.295 30.5 133.766 30.5 134.151 30.3304C134.491 30.1809 134.782 29.9398 134.992 29.6342C135.231 29.2876 135.319 28.8247 135.495 27.8988L136.819 20.9497C136.881 20.6238 136.912 20.4609 136.867 20.3335C136.828 20.2218 136.75 20.1277 136.648 20.068C136.531 20 136.365 20 136.033 20H119.571ZM125 35C125 35.5523 124.552 36 124 36C123.448 36 123 35.5523 123 35C123 34.4477 123.448 34 124 34C124.552 34 125 34.4477 125 35ZM133 35C133 35.5523 132.552 36 132 36C131.448 36 131 35.5523 131 35C131 34.4477 131.448 34 132 34C132.552 34 133 34.4477 133 35Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_494_13304"
              x="-2"
              y="-1"
              width="157"
              height="56"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.04 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_494_13304"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_494_13304"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </ButtonContainer>
    </CardContainer>
  );
};

export default CarouselNFTCard;
