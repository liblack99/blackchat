import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {registerUser} from "../slices/authSlice";
import {useNavigate} from "react-router-dom";
import storage from "../firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import capitalizeWords from "../utils/capitalizeWords";
import Compressor from "compressorjs";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState<File | null>(null); // Nuevo estado para el archivo
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
          },
          error(err) {
            console.error(err);
            setError("Error compressing the image. Try again.");
          },
        });
      }

      setError("");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

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
        setError("Failed to upload image. Please try again.");
        return;
      }
    }

    // Dispatch the registerUser action with the image URL included
    const fullName = `${username} ${lastName}`;
    dispatch(
      registerUser({
        fullName,
        email,
        password,
        profileImage: profileImageUrl,
      })
    );
    navigate("/login");
  };

  return (
    <div className="w-[94%] sm:W-[94%] md:w-[400px] lg:w-[400px] mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 my-2 w-full"
          value={username}
          onChange={(e) => setUsername(capitalizeWords(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-2 my-2 w-full"
          value={lastName}
          onChange={(e) => setLastName(capitalizeWords(e.target.value))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 my-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 my-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border border-gray-300 p-2 my-2 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label className="block text-sm text-gray-600 my-2">
          Profile Image (optional)
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 p-2 my-2 w-full"
            onChange={handleFileChange}
          />
        </label>
        <button
          className="w-full p-2 bg-black text-white rounded-md mt-4"
          type="submit"
          disabled={uploading}>
          {uploading ? "Uploading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
