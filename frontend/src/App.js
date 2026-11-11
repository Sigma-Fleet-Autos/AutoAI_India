import { lazy, Suspense } from "react";
import "@/App.css";
import "./styles/premium-experience.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatDrawer from "./components/ChatDrawerFixed";
import Home from "./pages/Home";
const Compare = lazy(() => import("./pages/Compare"));
const Recommend = lazy(() => import("./pages/Recommend"));
const Cars = lazy(() => import("./pages/Cars"));
const EMI = lazy(() => import("./pages/EMI"));
const News = lazy(() => import("./pages/News"));
const BookCar = lazy(() => import("./pages/BookCar"));
const Showroom = lazy(() => import("./pages/Showroom"));
const ConfiguratorExperience = lazy(
  () => import("./pages/ConfiguratorExperience"),
);
const ConfiguratorHistory = lazy(() => import("./pages/ConfiguratorHistory"));
const ConfiguratorConversion = lazy(
  () => import("./pages/ConfiguratorConversion"),
);
const ConfiguratorAssetManager = lazy(
  () => import("./pages/ConfiguratorAssetManager"),
);
const ConfiguratorAssetUpload = lazy(
  () => import("./pages/ConfiguratorAssetUpload"),
);
const Premium = lazy(() => import("./pages/Premium"));
const Dealer = lazy(() => import("./pages/Dealer"));
const DealerApply = lazy(() => import("./pages/DealerApply"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
import InstallPWA from "./components/InstallPWA";
import { Toaster } from "./components/ui/sonner";
import { I18nProvider } from "./lib/i18n";
import AppErrorBoundary from "./components/AppErrorBoundary";

function PageSurface({ children }) {
  const { pathname } = useLocation();
  const modern =
    pathname === "/" ||
    pathname === "/cars" ||
    pathname.startsWith("/showroom/") ||
    pathname.startsWith("/configurator/");
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={modern ? "" : "aai-legacy"}
    >
      {children}
    </main>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <div className="App bg-[#050505] text-white">
        <I18nProvider>
          <BrowserRouter>
            <Navbar />
            <PageSurface>
              <Suspense
                fallback={
                  <div className="aai-state" role="status">
                    Preparing your experience…
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/recommend" element={<Recommend />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/emi" element={<EMI />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/book/:carId" element={<BookCar />} />
                  <Route path="/showroom/:carId" element={<Showroom />} />
                  <Route
                    path="/configurator/:variantId"
                    element={<ConfiguratorExperience />}
                  />
                  <Route
                    path="/configurator/history"
                    element={<ConfiguratorHistory />}
                  />
                  <Route
                    path="/configurator/conversion"
                    element={<ConfiguratorConversion />}
                  />
                  <Route
                    path="/admin/configurator-assets"
                    element={<ConfiguratorAssetManager />}
                  />
                  <Route
                    path="/admin/configurator-assets/upload"
                    element={<ConfiguratorAssetUpload />}
                  />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/dealer" element={<Dealer />} />
                  <Route path="/dealers/apply" element={<DealerApply />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                </Routes>
              </Suspense>
            </PageSurface>
            <Footer />
            <ChatDrawer />
            <InstallPWA />
            <Toaster />
          </BrowserRouter>
        </I18nProvider>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
