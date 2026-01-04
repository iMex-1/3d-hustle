import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  useNavigate,
  useLocation,
  useRouteError,
  Outlet,
  Link,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ModelsProvider } from "./context/ModelsContext";
import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import Homepage from "./components/Homepage";
import Gallery from "./components/Gallery";
import Categories from "./components/Categories";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import About from "./components/About";
import { useAuth } from "./hooks/useAuth";
import * as authService from "./services/authService";
import * as databaseService from "./services/databaseService";

// Models loader - pre-fetch models data
async function modelsLoader() {
  try {
    const models = await databaseService.getAllModels();
    return { models };
  } catch (error) {
    console.error("Error loading models:", error);
    throw new Response("Failed to load models", { status: 500 });
  }
}

// Gallery loader - handles category filtering
async function galleryLoader({ params, request }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search");

  try {
    const models = await databaseService.getAllModels();

    let filteredModels = models;

    // Filter by category if provided
    if (params.category) {
      filteredModels = models.filter(
        (model) =>
          model.category?.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredModels = filteredModels.filter(
        (model) =>
          model.name?.toLowerCase().includes(query) ||
          model.description?.toLowerCase().includes(query) ||
          model.category?.toLowerCase().includes(query)
      );
    }

    return {
      models: filteredModels,
      category: params.category,
      searchQuery,
    };
  } catch (error) {
    console.error("Error loading gallery data:", error);
    throw new Response("Failed to load gallery", { status: 500 });
  }
}

// Admin loader - checks admin permissions
async function adminLoader() {
  return new Promise((resolve, reject) => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      unsubscribe();

      if (!user) {
        throw new Response("Authentication required", { status: 401 });
      }

      try {
        const userRecord = await databaseService.getUserData(user.uid);

        if (!userRecord?.isAdmin) {
          throw new Response("Admin access required", { status: 403 });
        }

        const models = await databaseService.getAllModels();
        resolve({ user, userRecord, models });
      } catch (error) {
        if (error instanceof Response) throw error;
        console.error("Error in admin loader:", error);
        throw new Response("Failed to load admin data", { status: 500 });
      }
    });
  });
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: "gallery",
        loader: modelsLoader,
        Component: Categories,
      },
      {
        path: "gallery/category/:category",
        loader: galleryLoader,
        Component: Gallery,
      },
      {
        path: "gallery/product/:productId",
        loader: galleryLoader,
        Component: Gallery,
      },
      {
        path: "categories",
        loader: modelsLoader,
        Component: Categories,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "admin",
        loader: adminLoader,
        Component: AdminDashboard,
      },
    ],
  },
]);

// Root layout component
function RootLayout() {
  const { user, userRecord, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Always use dark theme
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      setNotification({
        message: "Erreur lors de la déconnexion",
        type: "error",
      });
    }
  };

  const handleSearch = (query) => {
    navigate(`/gallery?search=${encodeURIComponent(query)}`);
  };

  // Show loading state during auth initialization
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div style={{ position: "relative", width: "48px", height: "48px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "3px solid rgba(200, 170, 110, 0.2)",
              borderRadius: "50%",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "3px solid transparent",
              borderTopColor: "#c8aa6e",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <ModelsProvider>
      <div className="app">
        <Navigation
          user={user}
          userRecord={userRecord}
          onLogout={handleLogout}
          onSearch={handleSearch}
        />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </ModelsProvider>
  );
}

// Error boundary component
function ErrorBoundary() {
  const error = useRouteError();

  if (error?.status === 401) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access this page.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (error?.status === 403) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
