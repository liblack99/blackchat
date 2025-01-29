import React, {useState, useEffect, useMemo} from "react";
import Login from "../components/Login";

const LoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState<"es" | "en">("en");

  // Detectar el idioma del navegador
  useEffect(() => {
    const userLang = navigator.language.startsWith("es") ? "es" : "en";
    setLanguage(userLang);
  }, []);

  // Traducciones
  const translations = useMemo(
    () => ({
      es: {
        title: "Cómo usar la app",
        description:
          "Para probar la aplicación, inicia sesión con uno de los siguientes usuarios en navegadores distintos para simular una conversación real:",
        users: [
          {
            label: "User 1",
            email: "test1@example.com",
            password: "123456",
          },
          {
            label: "User 2",
            email: "test2@example.com",
            password: "123456",
          },
        ],
        note: "Cada usuario debe estar en un navegador diferente para que puedas chatear entre ellos.",
        close: "Cerrar",
        buttonText: "¿Cómo usar la app?",
      },
      en: {
        title: "How to use the app",
        description:
          "To test the application, log in with one of the following users in different browsers to simulate a real conversation:",
        users: [
          {
            label: "User 1",
            email: "test1@example.com",
            password: "123456",
          },
          {
            label: "User 2",
            email: "test2@example.com",
            password: "123456",
          },
        ],
        note: "Each user must be in a different browser so you can chat between them.",
        close: "Close",
        buttonText: "How to use the app?",
      },
    }),
    []
  );

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <div className="grid place-content-center gap-4">
        <Login />
        {/* Botón para abrir el modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 text-black underline">
          {translations[language].buttonText}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90%]">
            <h2 className="text-xl font-bold mb-4">
              {translations[language].title}
            </h2>
            <p className="text-gray-700">
              {translations[language].description}
            </p>
            <ul className="mt-3 text-gray-900">
              {translations[language].users.map((user, index) => (
                <li key={index}>
                  <strong>{user.label}:</strong> {user.email} / {user.password}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 mt-3">{translations[language].note}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-black text-white rounded-md">
                {translations[language].close}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;
