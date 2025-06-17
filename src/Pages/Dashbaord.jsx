import { useState, useEffect } from "react";
import {
  FiHome,
  FiCompass,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiBookmark,
  FiDollarSign,
  FiBarChart2,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiSearch,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Tour from "../Components/Tour";
import DashboardMain from "../Components/DashboardMain";
import AddTours from "../Components/AddTours";


const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items data
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiHome className="text-lg" />,
      section: "dashboard",
      mobilePriority: true,
    },
    {
      name: "Tours",
      icon: <FiCompass className="text-lg" />,
      section: "tours",
      mobilePriority: true,
      subItems: [
        { name: "Add Catagories", section: "catagories" },
        { name: "Add Tours", section: "add-tours" },
        { name: "Adventure", section: "adventure-tours" },
        { name: "Cultural", section: "cultural-tours" },
      ],
    },
    {
      name: "Bookings",
      icon: <FiCalendar className="text-lg" />,
      section: "bookings",
      mobilePriority: true,
      subItems: [
        { name: "New Bookings", section: "new-bookings" },
        { name: "Confirmed", section: "confirmed-bookings" },
        { name: "Cancelled", section: "cancelled-bookings" },
      ],
    },
    {
      name: "Customers",
      icon: <FiUsers className="text-lg" />,
      section: "customers",
      mobilePriority: false,
    },
    {
      name: "Saved",
      icon: <FiBookmark className="text-lg" />,
      section: "saved",
      mobilePriority: false,
    },
    {
      name: "Payments",
      icon: <FiDollarSign className="text-lg" />,
      section: "payments",
      mobilePriority: false,
    },
    {
      name: "Reports",
      icon: <FiBarChart2 className="text-lg" />,
      section: "reports",
      mobilePriority: false,
    },
    {
      name: "Settings",
      icon: <FiSettings className="text-lg" />,
      section: "settings",
      mobilePriority: true,
    },
  ];

  const toggleSubmenu = (name) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain />;
      case "catagories":
        return <Tour />;
      case "add-tours":
        return <AddTours />
      case "adventure-tours":
      case "cultural-tours":
      case "bookings":
      case "new-bookings":
      case "confirmed-bookings":
      case "cancelled-bookings":
      case "customers":
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-800 text-white border-r border-blue-700">
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="text-xl font-bold flex items-center">
            <span className="bg-blue-600 p-2 rounded-lg mr-2">
              <FiCompass className="text-white" />
            </span>
            Zaroo
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                        activeSection.startsWith(item.section.split("-")[0])
                          ? "bg-blue-700"
                          : "hover:bg-blue-700"
                      }`}
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      {activeSubmenu === item.name ? (
                        <FiChevronUp className="text-sm" />
                      ) : (
                        <FiChevronDown className="text-sm" />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeSubmenu === item.name && (
                        <motion.ul
                          className="pl-4 mt-1 space-y-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <button
                                onClick={() =>
                                  setActiveSection(subItem.section)
                                }
                                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                  activeSection === subItem.section
                                    ? "bg-blue-600"
                                    : "hover:bg-blue-600"
                                }`}
                              >
                                <span className="ml-2">{subItem.name}</span>
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSection(item.section)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      activeSection === item.section
                        ? "bg-blue-700"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile in sidebar (desktop only) */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-blue-200">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
        initial={{ x: -320 }}
        animate={{ x: isMobileMenuOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="text-xl font-bold flex items-center">
            <span className="bg-blue-600 p-2 rounded-lg mr-2">
              <FiCompass className="text-white" />
            </span>
            Zaroo
          </div>
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100vh-64px)]">
          <ul className="space-y-1">
            {menuItems
              .filter((item) => item.mobilePriority)
              .map((item) => (
                <li key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                          activeSection.startsWith(item.section.split("-")[0])
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        {activeSubmenu === item.name ? (
                          <FiChevronUp className="text-sm" />
                        ) : (
                          <FiChevronDown className="text-sm" />
                        )}
                      </button>

                      <AnimatePresence>
                        {activeSubmenu === item.name && (
                          <motion.ul
                            className="pl-4 mt-1 space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <button
                                  onClick={() => {
                                    setActiveSection(subItem.section);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                    activeSection === subItem.section
                                      ? "bg-blue-600"
                                      : "hover:bg-blue-600"
                                  }`}
                                >
                                  <span className="ml-2">{subItem.name}</span>
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSection(item.section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                        activeSection === item.section
                          ? "bg-blue-700"
                          : "hover:bg-blue-700"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FiMenu className="text-xl" />
              </button>

              {/* Search bar - hidden on mobile */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none w-full text-gray-700"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile search button */}
              <button className="md:hidden p-2 text-gray-600">
                <FiSearch className="text-xl" />
              </button>

              <button className="p-2 relative text-gray-600 hover:text-blue-600">
                <FiBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden md:block border-l border-gray-200 h-6 mx-2"></div>

              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile page title */}
          <div className="lg:hidden px-4 pb-3">
            <h1 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) =>
                activeSection.startsWith(item.section.split("-")[0])
              )?.name || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around">
            {menuItems
              .filter((item) => item.mobilePriority)
              .slice(0, 4)
              .map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`flex flex-col items-center justify-center p-3 ${
                    activeSection === item.section
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs mt-1">{item.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
