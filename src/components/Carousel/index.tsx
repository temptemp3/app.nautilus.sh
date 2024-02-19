import React from "react";
import ImageCard from "../ImageCard";
import CarouselOptions from "../CarouselOptions";

const Carousel: React.FC = () => {
  const [keys, setKeys] = React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const images = [
    "https://prod.cdn.highforge.io/i/https%3A%2F%2Fprod.cdn.highforge.io%2Ft%2F28386188%2F25.json%23arc3?w=480",
    "https://prod.cdn.highforge.io/i/https%3A%2F%2Fprod.cdn.highforge.io%2Ft%2F29081505%2F8.json%23arc3",
    "https://prod.cdn.highforge.io/i/https%3A%2F%2Fprod.cdn.highforge.io%2Ft%2F28386188%2F22.json%23arc3",
    "https://prod.cdn.highforge.io/i/https%3A%2F%2Fprod.cdn.highforge.io%2Ft%2F28386188%2F4.json%23arc3",
  ];
  return (
    <div
      style={{
        marginTop: "64px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <CarouselOptions />
      <div
        style={{
          marginTop: "32px",
        }}
      >
        {keys.map((e) => (
          <ImageCard
            key={e}
            imageUrl={images[e % 4]}
            title={`Woof${e}`}
            subtitle="1VOI"
            onClick={() => {}}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "330px",
            right: "95px",
          }}
        >
          <a
            href="#"
            onClick={() => {
              setKeys([...keys.slice(1), keys[0]]);
            }}
          >
            <svg
              width="98"
              height="98"
              viewBox="0 0 98 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_494_13335)">
                <rect
                  x="25"
                  y="25"
                  width="48"
                  height="48"
                  rx="24"
                  fill="#99FF33"
                  shape-rendering="crispEdges"
                />
                <path
                  d="M39.6667 49H58.3334M58.3334 49L49 39.6667M58.3334 49L49 58.3334"
                  stroke="#161717"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_494_13335"
                  x="0"
                  y="0"
                  width="98"
                  height="98"
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
                  <feOffset />
                  <feGaussianBlur stdDeviation="12.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_494_13335"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_494_13335"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
