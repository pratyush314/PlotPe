import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import img from "../assets/react.svg";
const imageSlider = () => {
  return (
    <Swiper spaceBetween={50}>
      <SwiperSlide>
        <img src={img} alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={img} alt="" />
      </SwiperSlide>
    </Swiper>
  );
};

export default imageSlider;
