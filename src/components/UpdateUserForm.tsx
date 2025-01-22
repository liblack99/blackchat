import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUserData} from "../slices/authSlice";
import {AppDispatch, RootState} from "../store/store";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import storage from "../firebase";
import Compressor from "compressorjs";

interface PropForm {
  handleFormClick: () => void;
}

const UpdateUserForm: React.FC<PropForm> = ({handleFormClick}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user, loading, error} = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
    currentPassword: "",
    newPassword: "",
  });
  const [uploading, setUploading] = useState(false);
  const [errorUploading, setErrorUploading] = useState<string>("");

  const [previewImage, setPreviewImage] = useState(user?.profileImage || "");
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        new Compressor(selectedFile, {
          quality: 0.6,
          maxWidth: 800,
          maxHeight: 800,
          success(result) {
            const fileResult = new File([result], selectedFile.name, {
              type: result.type,
              lastModified: Date.now(),
            });

            setFile(fileResult);
            setPreviewImage(URL.createObjectURL(fileResult));
          },
          error(err) {
            console.error(err);
          },
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (file) {
      setUploading(true);
      try {
        const storageRef = ref(
          storage,
          `profileImages/${Date.now()}-${file.name}`
        );
        await uploadBytes(storageRef, file);
        profileImageUrl = await getDownloadURL(storageRef);
        setUploading(false);
      } catch (error) {
        setUploading(false);
        console.error("Error uploading file:", error);
        setErrorUploading("Failed to upload image. Please try again.");
        return;
      }

      try {
        const updatedData = {
          ...formData,
          profileImage: profileImageUrl,
        };

        await dispatch(updateUserData(updatedData));
        handleFormClick();
      } catch (err) {
        console.error("Error updating information:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 space-y-4 rounded">
      <h2 className="text-xl font-bold text-center">Update Information</h2>
      <button
        className="absolute top-6 right-4"
        onClick={() => handleFormClick()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          width={16}>
          <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
        </svg>
      </button>
      <div className="place-self-center relative">
        <label className="cursor-pointer ">
          <div className="flex items-center space-x-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Imagen de perfil"
                className="w-28 h-28 rounded-full object-cover"
              />
            )}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="absolute -right-6 bottom-0"
            width={20}>
            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {errorUploading && <p className="text-red-500">{error}</p>}

      {/* Campo para el nombre */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="fullName">
          Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Campo para el correo */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Imagen de perfil */}

      {/* Campo para la contraseña actual */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="currentPassword">
          Current password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Campo para la nueva contraseña */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="newPassword">
          New password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full p-2 bg-black text-white rounded-md mt-4"
        disabled={loading && uploading}>
        {loading ? "Uploading..." : "Update"}
      </button>
    </form>
  );
};

export default UpdateUserForm;
