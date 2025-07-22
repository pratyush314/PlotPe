const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col md:flex-row gap-6">
        {/* First Section */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Name"
            minLength={10}
            maxLength={62}
            required
          />
          <textarea placeholder="Description" required></textarea>
          <input type="text" placeholder="Address" required />
          <div>
            <input type="checkbox" id="sale" />
            Sell
            <input type="checkbox" id="rent" />
            Rent
            <input type="checkbox" id="parking" />
            Parking
            <input type="checkbox" id="furnished" />
            Furnished
            <input type="checkbox" id="offer" />
            Offer
          </div>
          <div>
            <input type="number" id="bedrooms" min={1} max={10} required />
            Beds
            <input type="number" id="bathrooms" min={1} max={10} required />
            Baths
            <input
              type="number"
              id="regularPrice"
              min={0}
              max={1000000}
              required
            />
            <span>Regular Price</span>
            <span>(₹/month)</span>
            <input
              type="number"
              id="discountedPrice"
              min={0}
              max={1000000}
              required
            />
            <span>Discounted Price</span>
            <span>(₹/month)</span>
          </div>
        </div>
        {/* Second Section */}
        <div className="flex-1">
          <p>
            Images : <span>The first image will be cover (max 6)</span>
          </p>
          <input type="file" accept="image/*" multiple />
          <button type="button">Upload</button>
          <div>
            <img src="#" alt="listing-image" />
            <button type="button">Delete</button>
          </div>
          <button type="submit">Create Listing</button>
          <p>Error Message Here</p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
