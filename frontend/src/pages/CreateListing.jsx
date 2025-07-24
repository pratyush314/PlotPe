import { useState } from "react";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      for (const file in files) {
        storeImage(file);
      }
    }
  };

  const storeImage = (file) => {};
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col md:flex-row gap-6">
        {/* First Section */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            minLength={10}
            maxLength={62}
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          />
          <textarea
            placeholder="Description"
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            required
            className="border border-slate-200 p-3 rounded-lg w-full bg-white"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-white"
                type="number"
                id="bedrooms"
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
                id="discountedPrice"
                min={0}
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
          <div className="flex justify-between p-3 border items-center">
            <img
              src="#"
              alt="listing-image"
              className="w-20 h-20 object-contain rounded-lg"
            />
            <button
              className="p-3 cursor-pointer text-red-700 rounded-lg uppercase hover:opacity-75"
              type="button"
            >
              Delete
            </button>
          </div>
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
            type="submit"
          >
            Create Listing
          </button>
          <p>Error Message Here</p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
