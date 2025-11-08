import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Quiz from "../pages/Quiz";
import NotFound from "../pages/NotFound";
import Result from "../pages/Result";
import Tours from "../pages/Admin/Tour";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VRPage from "../pages/VRPage";
import WeatherWidget from "../pages/WeatherWidget";
import MapView from "../pages/MapView";
import Destinations from "../pages/Admin/Destinations";
import TourRecommendations from "../pages/TourRecommendations";

// Admin pages

export const router = createBrowserRouter([
	// ==== Public Layout ====
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "about", element: <About /> },
			{ path: "quiz", element: <Quiz /> },
			{ path: "result", element: <Result /> },
			{ path: "vr", element: <VRPage /> },
			{ path: "weather", element: <WeatherWidget /> },
			{ path: "map", element: <MapView /> },
			{ path: "tour-recommendations", element: <TourRecommendations /> },
		],
	},
	{
		path: "/login",
		children: [
			{ index: true, element: <Login /> },
		],
	},
	{
		path: "/register",
		children: [
			{ index: true, element: <Register /> },
		],
	},
	// ==== Admin Layout ====
	{	
		path: "/admin",
		element: <AdminLayout />,
		children: [
			{ index: true, element: <Navigate to="/admin/dashboard" replace /> },
			{ path: "dashboard", element: <Dashboard /> }, // ✅ thêm dòng này
			{ path: "tours", element: <Tours /> },
			{ path: "users", element: <Users /> },
			{ path: "destinations", element: <Destinations /> },
		],
	},

	// ==== Not Found ====
	{
		path: "*",
		element: <NotFound />,
	},
]);
