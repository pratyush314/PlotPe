import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { listingId } = useParams();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promiseArr = [];
      for (let i = 0; i < files.length; i++) {
        promiseArr.push(storeImage(files[i]));
      }
      const pr = Promise.all(promiseArr);
      pr.then((urls) => {
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...urls],
        });
        setUploading(false);
        setImageUploadError(false);
      }).catch((err) => {
        console.log(err);
        setUploading(false);
        setImageUploadError("Image upload failed !");
      });
    } else {
      setUploading(false);
      setImageUploadError("You can upload only upto 6 images.");
    }
  };
  const handleDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, idx) => idx != index),
    });
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  };
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (id === "rent" || id === "sale") {
      setFormData({
        ...formData,
        type: id,
      });
      return;
    }
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      setError("You must upload at least 1 image");
      return;
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discounted price must be less then regular price");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://plotpe-mern-project.onrender.com/api/listing/update/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data) {
        setError("No data found !");
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(
          `https://plotpe-mern-project.onrender.com/api/listing/get/${listingId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!data) {
          return;
        }
        setFormData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, []);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* First Section */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            minLength={5}
            maxLength={62}
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          />
          <textarea
            placeholder="Description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          ></textarea>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                checked={formData.type === "sale"}
                onChange={handleChange}
                className="w-5"
                type="checkbox"
                id="sale"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.type === "rent"}
                onChange={handleChange}
                className="w-5"
                type="checkbox"
                id="rent"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.parking}
                onChange={handleChange}
                className="w-5"
                type="checkbox"
                id="parking"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.furnished}
                onChange={handleChange}
                className="w-5"
                type="checkbox"
                id="furnished"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-white"
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-white"
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min={1}
                max={10}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-white"
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                min={0}
                max={1000000}
                required
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs">(₹/month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-white"
                type="number"
                id="discountPrice"
                min={0}
                value={formData.discountPrice}
                onChange={handleChange}
                max={1000000}
                required
              />
              <div>
                <p>Discounted Price</p>
                <span className="text-xs">(₹/month)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Second Section */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-semibold">
            Images :{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:cursor-pointer disabled:opacity-80"
            >
              {uploading ? "Uploading ..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((image, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={image}
                  alt="listing-image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="p-3 cursor-pointer text-red-700 rounded-lg uppercase hover:opacity-75"
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 cursor-pointer bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
            type="submit"
          >
            {loading ? "Updating ..." : "Update Listing"}
          </button>
          {error && <p>error</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
