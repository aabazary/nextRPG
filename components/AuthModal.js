"use client";

import React from "react";
import LoginForm from "@/components/Login";
import SignupForm from "@/components/Signup";

export default function AuthModal({ isLogin, closeModal, toggleForm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-container relative">
        <button
          className="modal-close text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          ✕
        </button>
        {isLogin ? (
          <div>
            <h2 className="modal-header">Login</h2>
            <LoginForm />
            <p className="mt-4 text-sm">
              Don’t have an account?{" "}
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
            <h2 className="modal-header">Sign Up</h2>
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
  );
}
