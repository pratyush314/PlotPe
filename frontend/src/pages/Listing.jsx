import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
        if (!data.success) {
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
  return <div>Listing</div>;
};

export default Listing;
