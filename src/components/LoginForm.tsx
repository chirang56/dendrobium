import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signup(email, password);
        if (error) {
          setError(
            error.message.includes("already exists")
              ? "An account with this email already exists. Please login instead."
              : error.message
          );
          return;
        }
        setError("Account created successfully! Please check your email for verification.");
      } else {
        const { error } = await login(email, password);
        if (error) {
          setError(
            error.message.includes("Invalid login credentials")
              ? "Invalid email or password. Please try again."
              : error.message
          );
          return;
        }
        navigate("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white">
          {isSignUp ? t("signup") : t("login")}
        </h2>

        {error && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium transition-all ${
              error.includes("successfully")
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t("email")}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t("password")}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isSignUp ? t("signup") : t("login")}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {isSignUp ? t("haveAccount") : t("needAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
