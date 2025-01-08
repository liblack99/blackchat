import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {registerUser} from "../slices/authSlice";
import {useNavigate} from "react-router-dom";
import storage from "../../firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import capitalizeWords from "../utils/capitalizeWords";

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

  const MAX_FILE_SIZE = 100 * 1024; // 100 KB en bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validar el tamaño del archivo
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("El tamaño del archivo no debe exceder los 100 KB.");
        setFile(null); // Limpiar el archivo si excede el tamaño
        return;
      }

      setFile(selectedFile);
      setError(""); // Limpiar cualquier error anterior
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
    <div className="w-[400px] mx-auto mt-10 p-6 border rounded-lg shadow-md">
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
        <input
          type="file"
          accept="image/*"
          className="border border-gray-300 p-2 my-2 w-full"
          onChange={handleFileChange}
          required
        />
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
