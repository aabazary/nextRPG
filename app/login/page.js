"use client";
import { useState } from "react";
import LoginForm from "@/components/Login"; 
import SignupForm from "@/components/Signup";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => setShowModal(true)}
      >
        Login
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>
            {isLogin ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <LoginForm />
                <p className="mt-4 text-sm">
                  Don't have an account?{" "}
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={toggleForm}
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
                <SignupForm />
                <p className="mt-4 text-sm">
                  Already have an account?{" "}
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={toggleForm}
                  >
                    Log in here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
