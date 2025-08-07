import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaShare } from "react-icons/fa";
const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { listingId } = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://plotpe-mern-project.onrender.com/api/listing/get/${listingId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!data) {
          setError(true);
          return;
        }
        setListing(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  console.log(listing);
  return (
    <div>
      {listing && !loading && !error && (
        <Swiper navigation={true} modules={[Navigation]}>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[550px]"
                style={{
                  backgroundImage: `url("${url}")`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
          className="text-slate-500"
        />
        {copied && (
          <p className="fixed top-[23%] right-[5%] border rounded bg-slate-100 p-2 z-10">
            Linked Copied
          </p>
        )}
      </div>
      {listing && (
        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
          <p className="font-semibold">
            {listing.name} - ₹{" "}
            {listing.offer ? listing.discountPrice : listing.regularPrice}
            {listing.type === "rent" ? "/ Month" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Listing;
