/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../features/user/userSlice";
import { Link } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [userListings, setUserListings] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `https://plotpe-mern-project.onrender.com/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleFileUpload = (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercentage(Math.round(progress));
        },
        () => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFormData({ ...formData, avatar: url });
            setFilePercentage(0);
            setFileUploadError(false);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://plotpe-mern-project.onrender.com/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        `https://plotpe-mern-project.onrender.com/api/user/signout`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `https://plotpe-mern-project.onrender.com/api/user/listings/${currentUser._id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setUserListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await fetch(
        `https://plotpe-mern-project.onrender.com/api/listing/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setUserListings((prevListings) =>
        prevListings.filter(({ _id }) => _id !== id)
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="images/*"
          ref={fileRef}
          hidden
        />
        <img
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
          src={currentUser.avatar || formData.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error in image uplaod</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uplading ${filePercentage}%`}</span>
          ) : (
            filePercentage === 100 && (
              <span className="text-green-700">
                Image Uploaded Successfully
              </span>
            )
          )}
        </p>
        <input
          className="border border-slate-200 bg-white p-3 rounded-lg"
          type="text"
          name="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className="border border-slate-200 bg-white p-3 rounded-lg"
          type="text"
          name="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className="border border-slate-200 bg-white p-3 rounded-lg"
          type="password"
          name="password"
          placeholder="password"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white p-3  rounded-lg uppercase hover:cursor-pointer"
        >
          {loading ? "Loading ..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User Updated Successfully" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full hover:cursor-pointer"
      >
        Show Listings
      </button>
      <p className="text-red-700">{showListingsError}</p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex border rounded-lg p-3 justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
