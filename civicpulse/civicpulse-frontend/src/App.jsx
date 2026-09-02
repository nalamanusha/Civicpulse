import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, FileText, Award, BarChart3, Shield, User, CheckCircle, LogOut, Search, Filter, Mail, Lock, ArrowRight, ExternalLink, MapPin, Navigation, Clock, Upload, FileCheck, Eye, EyeOff, Check, AlertCircle, PhoneCall, UserCheck, X, Edit3 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState('CITIZEN');
  const [activeTab, setActiveTab] = useState('feed');

  // State for Top-Right Profile Modal & Edit Mode
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inline Validation Error States
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('civicpulse_grievances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 101, category: 'Water Supply', title: 'No water supply for 5 days', description: 'Pipeline leakage near main junction', location: 'Sector 5', image: null, status: 'In Progress', createdAt: '2026-08-31' },
      { id: 102, category: 'Sanitation', title: 'Garbage Clearance', description: 'Overflowing bins near market area', location: 'Collectorate Junction', image: null, status: 'Resolved', createdAt: '2026-08-31' }
    ];
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('civicpulse_certificates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 'APP-2024-5421', type: 'birth', applicant: 'Nalam Sri Lakshmi Gayathri Anusha', child: 'Nanaji', mobile: '9876543210', aadhar: '[Aadhaar Redacted]', status: 'Approved', issuedDate: '2026-08-31' },
      { id: 'APP-2024-1247', type: 'Birth Certificate', applicant: 'Priya Sharma', child: 'Aarav', mobile: '9123456789', aadhar: '[Aadhaar Redacted]', status: 'Approved', issuedDate: '2026-06-15' },
      { id: 'APP-2024-1248', type: 'Income Certificate', applicant: 'Rajesh Kumar', child: 'Self', mobile: '9988776655', aadhar: '[Aadhaar Redacted]', status: 'Pending Verification', issuedDate: '-' }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Electrical',
    title: '',
    description: '',
    location: '',
    image: null
  });

  const [trackingId, setTrackingId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);

  const [authData, setAuthData] = useState({
    email: 'nalamanusha43@gmail.com',
    password: '',
    confirmPassword: '',
    name: 'Nalam Sri Lakshmi Gayathri Anusha',
    mobile: '9573195661'
  });

  const [assignData, setAssignData] = useState({ grievanceId: '', workerName: '', deadline: '' });

  useEffect(() => {
    localStorage.setItem('civicpulse_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('civicpulse_certificates', JSON.stringify(certificates));
  }, [certificates]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      showToast("Fetching GPS location...");
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);
            setFormData(prev => ({ ...prev, location: `Lat: ${lat}, Lng: ${lng} (GPS Detected)` }));
            showToast("GPS location captured successfully!");
          },
          () => {
            showToast("Unable to retrieve your location. Please enter manually.");
          }
      );
    } else {
      showToast("Geolocation is not supported by your browser");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        showToast("Photo attached successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!isLogin) {
      let hasError = false;

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(authData.mobile)) {
        setPhoneError("Phone number must be exactly 10 digits.");
        hasError = true;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
      if (!passwordRegex.test(authData.password)) {
        setPasswordError("Min 8 chars, 1 uppercase & 1 special character required.");
        hasError = true;
      }

      if (authData.password !== authData.confirmPassword) {
        setConfirmPasswordError("Passwords do not match!");
        hasError = true;
      }

      if (hasError) return;
    }

    setIsAuthenticated(true);
    showToast(isLogin ? "Welcome back!" : "Account created successfully!");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Math.floor(1000 + Math.random() * 9000),
      category: formData.category,
      title: formData.title,
      description: formData.description,
      location: formData.location || 'Not Specified',
      image: formData.image || null,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGrievances([newEntry, ...grievances]);
    setFormData({ category: 'Electrical', title: '', description: '', location: '', image: null });
    setActiveTab('feed');
    showToast(`Grievance filed! ID: ${newEntry.id}`);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const found = grievances.find(item => item.id.toString() === trackingId.trim());
    if (found) {
      setTrackedResult(found);
    } else {
      setTrackedResult('NOT_FOUND');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setGrievances(grievances.map(item => item.id === id ? { ...item, status: newStatus } : item));
    showToast(`Grievance status updated to ${newStatus}!`);
    if (trackedResult && trackedResult.id === id) {
      setTrackedResult(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleAssignWorkSubmit = (e) => {
    e.preventDefault();
    if (!assignData.grievanceId || !assignData.workerName) {
      showToast("Please select grievance and worker name!");
      return;
    }
    setGrievances(grievances.map(item => item.id.toString() === assignData.grievanceId.toString() ? { ...item, assignedTo: assignData.workerName, deadline: assignData.deadline || 'No Deadline', status: item.status === 'Pending' ? 'In Progress' : item.status } : item));
    showToast(`Work successfully assigned to ${assignData.workerName}!`);
    setAssignData({ grievanceId: '', workerName: '', deadline: '' });
  };

  const handleApproveCert = (id) => {
    const currentDate = new Date().toISOString().split('T')[0];
    setCertificates(certificates.map(c => c.id === id ? { ...c, status: 'Approved', issuedDate: currentDate } : c));
    showToast(`Certificate ${id} approved successfully!`);
  };

  const handleDownloadCert = (cert) => {
    showToast(`Downloading certificate ${cert.id}...`);
    const element = document.createElement("a");
    const file = new Blob([
      `=== SMART GOVERNANCE PORTAL ===\n` +
      `OFFICIAL DIGITAL CERTIFICATE\n\n` +
      `Application ID: ${cert.id}\n` +
      `Certificate Type: ${cert.type}\n` +
      `Applicant Name: ${cert.applicant}\n` +
      `Beneficiary Name: ${cert.child}\n` +
      `Mobile Number: ${cert.mobile || 'N/A'}\n` +
      `Aadhar Number: [Aadhaar Redacted]\n` +
      `Status: APPROVED\n` +
      `Issued Date: ${cert.issuedDate}\n\n` +
      `[Digitally Signed and Verified by Smart Governance Portal]`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${cert.id}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredGrievances = grievances.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const pendingCount = grievances.filter(g => g.status === 'Pending' || g.status === 'Open' || !g.status).length;
  const resolutionPercentage = grievances.length > 0 ? Math.round((resolvedCount / grievances.length) * 100) : 0;

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
          {toastMessage && (
              <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
                {toastMessage}
              </div>
          )}
          <div className="bg-white/15 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-full shadow-lg mb-2">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-wide text-center">Smart Governance Platform</h1>
              <p className="text-xs text-blue-200 mt-1 text-center">Administrative Operations & Citizen Services</p>
            </div>

            <div className="flex bg-black/20 p-1 rounded-xl mb-6">
              <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
              >
                Login
              </button>
              <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={authData.name}
                            onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Phone Number</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="tel"
                            maxLength="10"
                            required
                            placeholder="10-digit mobile number"
                            value={authData.mobile}
                            onChange={(e) => {
                              setAuthData({ ...authData, mobile: e.target.value });
                              setPhoneError('');
                            }}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
                    </div>
                  </>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={authData.email}
                      onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Password Field with Eye Icon */}
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min 8 chars (1 Upper, 1 Special)"
                      value={authData.password}
                      onChange={(e) => {
                        setAuthData({ ...authData, password: e.target.value });
                        setPasswordError('');
                      }}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-10 pr-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
              </div>

              {/* Confirm Password Field with Eye Icon */}
              {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={authData.confirmPassword}
                          onChange={(e) => {
                            setAuthData({ ...authData, confirmPassword: e.target.value });
                            setConfirmPasswordError('');
                          }}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-10 pr-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-400 text-xs mt-1">{confirmPasswordError}</p>}
                  </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Select Role</label>
                <select
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value)}
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="CITIZEN" className="bg-slate-900">Citizen</option>
                  <option value="ADMIN" className="bg-slate-900">Administrator</option>
                </select>
              </div>
              <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </button>
            </form>
          </div>
        </div>
    );
  }

  return (
      <div className="flex h-screen bg-gray-100 relative">
        {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
              {toastMessage}
            </div>
        )}

        {/* Professional Royal Blue Sidebar Theme */}
        <aside className="w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 border-r border-blue-800/40 flex flex-col justify-between text-slate-100 shadow-2xl">
          <div>
            <div className="p-4 font-bold text-sm border-b border-blue-800/50 flex items-center gap-2 text-white leading-tight bg-blue-950/80 backdrop-blur">
              <Shield className="h-6 w-6 shrink-0 text-cyan-400" /> Smart Governance Portal
            </div>
            <nav className="p-4 space-y-2">
              <button onClick={() => setActiveTab('feed')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'feed' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <Home size={18} /> Live Feed
              </button>
              <button onClick={() => setActiveTab('file')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'file' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <FileText size={18} /> File Grievance
              </button>
              <button onClick={() => setActiveTab('certificates')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'certificates' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <FileCheck size={18} /> Certs & Permits
              </button>
              <button onClick={() => setActiveTab('track')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'track' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <Navigation size={18} /> Track Grievance
              </button>
              <button onClick={() => setActiveTab('schemes')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'schemes' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <Award size={18} /> Welfare Schemes
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                <BarChart3 size={18} /> Governance Analytics
              </button>
              {authRole === 'ADMIN' && (
                  <button onClick={() => setActiveTab('admin_dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition ${activeTab === 'admin_dashboard' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
                    <Shield size={18} /> Admin Control Center
                  </button>
              )}
            </nav>
          </div>

          <div className="p-4 border-t border-blue-800/50 bg-blue-950/90">
            <button
                onClick={() => setIsAuthenticated(false)}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* TOP HEADER WITH PROFILE BUTTON ONLY */}
          <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-end items-center shadow-sm shrink-0">
            <button
                onClick={() => {
                  setShowProfileModal(true);
                  setIsEditingProfile(false);
                }}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 transition cursor-pointer shadow-sm"
            >
              <User size={15} className="text-blue-600" /> Profile & Settings
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'feed' && (
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Administrative Operations & Live Feed</h1>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                          type="text"
                          placeholder="Search grievances..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter size={18} className="text-gray-500" />
                      <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Water Supply">Water Supply</option>
                      </select>
                    </div>
                  </div>

                  {filteredGrievances.map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span className="font-semibold text-blue-600">ID: #{item.id} | {item.category}</span>
                          <span>Reported on: {item.createdAt}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin size={12} className="text-red-500" /> Location: {item.location}
                        </p>

                        {item.image && (
                            <div className="mt-3">
                              <img src={item.image} alt="Grievance Attachment" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t pt-3 border-gray-100">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status || 'Pending'}
                    </span>

                          {authRole === 'ADMIN' && (
                              <div className="flex gap-2">
                                {item.status !== 'In Progress' && item.status !== 'Resolved' && (
                                    <button
                                        onClick={() => handleStatusChange(item.id, 'In Progress')}
                                        className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                                    >
                                      <Clock size={14} /> Set In Progress
                                    </button>
                                )}
                                {item.status !== 'Resolved' && (
                                    <button
                                        onClick={() => handleStatusChange(item.id, 'Resolved')}
                                        className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-1 cursor-pointer"
                                    >
                                      <CheckCircle size={14} /> Mark Resolved
                                    </button>
                                )}
                              </div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
            )}

            {/* ADMIN CONTROL CENTER */}
            {activeTab === 'admin_dashboard' && authRole === 'ADMIN' && (
                <div className="p-8 max-w-5xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-indigo-600" /> Admin Control & Task Assignment Center
                      </h1>
                      <p className="text-sm text-gray-500">Manage citizen grievances, allocate field officers, and approve certificates.</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold uppercase">Restricted Admin Panel</span>
                  </div>

                  {/* Admin Quick Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-600">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Total Grievances</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{grievances.length}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Pending Review</p>
                      <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                      <p className="text-xs text-gray-500 uppercase font-semibold">In Progress</p>
                      <h3 className="text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-600">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Resolved Cases</p>
                      <h3 className="text-2xl font-bold text-green-600 mt-1">{resolvedCount}</h3>
                    </div>
                  </div>

                  {/* ASSIGN WORK / TASK FORCE SECTION */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <UserCheck className="text-indigo-600" size={18} /> Allocate Task / Assign Work to Field Officer
                    </h3>
                    <form onSubmit={handleAssignWorkSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Select Grievance</label>
                        <select
                            value={assignData.grievanceId}
                            onChange={(e) => setAssignData({ ...assignData, grievanceId: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
                            required
                        >
                          <option value="">-- Choose Grievance ID --</option>
                          {grievances.filter(g => g.status !== 'Resolved').map(g => (
                              <option key={g.id} value={g.id}>#{g.id} - {g.title} ({g.category})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Field Worker / Department Officer</label>
                        <select
                            value={assignData.workerName}
                            onChange={(e) => setAssignData({ ...assignData, workerName: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
                            required
                        >
                          <option value="">-- Select Officer Name --</option>
                          <option value="Ramesh (Electrical Lead)">Ramesh (Electrical Lead)</option>
                          <option value="Suresh (Sanitation Incharge)">Suresh (Sanitation Incharge)</option>
                          <option value="Venkat (Water Works Engineer)">Venkat (Water Works Engineer)</option>
                          <option value="Anitha (Infrastructure Inspector)">Anitha (Infrastructure Inspector)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Completion Deadline</label>
                        <div className="flex gap-2">
                          <input
                              type="date"
                              value={assignData.deadline}
                              onChange={(e) => setAssignData({ ...assignData, deadline: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
                              required
                          />
                          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition shadow-sm">
                            Assign Task
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Quick Management Section for Grievances */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center justify-between">
                      <span>Grievance Status & Assigned Task Tracking</span>
                      <span className="text-xs text-gray-500">Admin Dispatch</span>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {grievances.map(item => (
                          <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-600">#{item.id}</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{item.category}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {item.status || 'Pending'}
                          </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mt-1">{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Location: {item.location} • Reported: {item.createdAt}</p>
                              <p className="text-xs font-medium text-indigo-600 mt-1">
                                Assigned To: <span className="underline">{item.assignedTo || 'Unassigned'}</span> | Deadline: {item.deadline || '-'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {item.status !== 'In Progress' && item.status !== 'Resolved' && (
                                  <button
                                      onClick={() => handleStatusChange(item.id, 'In Progress')}
                                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                                  >
                                    Set In Progress
                                  </button>
                              )}
                              {item.status !== 'Resolved' && (
                                  <button
                                      onClick={() => handleStatusChange(item.id, 'Resolved')}
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
                                  >
                                    Mark Resolved
                                  </button>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificate Approvals Management */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center justify-between">
                      <span>Pending Certificate & Permit Approvals</span>
                      <span className="text-xs text-gray-500">Total Applications: {certificates.length}</span>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {certificates.map(cert => (
                          <div key={cert.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-600">{cert.id}</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{cert.type}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cert.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {cert.status}
                          </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mt-1">Applicant: {cert.applicant} (Beneficiary: {cert.child})</h4>
                              <p className="text-xs text-gray-500">Mobile: {cert.mobile} • Issued: {cert.issuedDate}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {cert.status !== 'Approved' && (
                                  <button
                                      onClick={() => handleApproveCert(cert.id)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer flex items-center gap-1"
                                  >
                                    <CheckCircle size={14} /> Approve & Sign
                                  </button>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                </div>
            )}

            {activeTab === 'file' && (
                <div className="p-8 max-w-xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Citizen Service Assistance - File Grievance</h1>
                  <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                      >
                        <option value="Electrical">Electrical</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Water Supply">Water Supply</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g. Broken Streetlight"
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location (Address or GPS)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                          <input
                              type="text"
                              required
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="Enter address or use GPS button"
                              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm"
                          />
                        </div>
                        <button
                            type="button"
                            onClick={handleGetLocation}
                            title="Auto-detect GPS Location"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition shrink-0"
                        >
                          <Navigation size={14} /> Auto GPS
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attach Photo (Optional)</label>
                      <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                        <Upload size={16} className="text-blue-600" />
                        <span>{formData.image ? "Photo Attached ✓" : "Upload Image Proof"}</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                          required
                          rows="4"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Provide brief details..."
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
                    >
                      Submit Grievance
                    </button>
                  </form>
                </div>
            )}

            {activeTab === 'certificates' && (
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Certificate & Permit Management</h1>
                      <p className="text-sm text-gray-500">Smart Governance & Citizen Services Platform</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full uppercase">Total: {certificates.length} Applications</span>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-md font-bold text-gray-800 mb-3">Apply for New Certificate</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const newCert = {
                        id: `APP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                        type: e.target.certType.value,
                        applicant: e.target.applicantName.value,
                        child: e.target.childName.value,
                        mobile: e.target.mobileNumber.value,
                        aadhar: '[Aadhaar Redacted]',
                        status: 'Pending Verification',
                        issuedDate: '-'
                      };
                      setCertificates([newCert, ...certificates]);
                      showToast("Certificate application submitted successfully!");
                      e.target.reset();
                    }} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input name="certType" type="text" required placeholder="Certificate Type (e.g. Birth/Income)" className="border p-2.5 rounded-lg text-sm bg-gray-50" />
                        <input name="applicantName" type="text" required placeholder="Applicant Full Name" className="border p-2.5 rounded-lg text-sm bg-gray-50" />
                        <input name="childName" type="text" required placeholder="Beneficiary / Child Name" className="border p-2.5 rounded-lg text-sm bg-gray-50" />
                        <input name="mobileNumber" type="tel" maxLength="10" required placeholder="Mobile Number (10 digits)" className="border p-2.5 rounded-lg text-sm bg-gray-50" />
                        <input name="aadharNumber" type="text" maxLength="14" required placeholder="Aadhar Number (XXXX XXXX XXXX)" className="border p-2.5 rounded-lg text-sm bg-gray-50 md:col-span-2 lg:col-span-2" />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer text-sm">
                        Submit Application
                      </button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-bold text-blue-600 uppercase">Application ID: {cert.id}</span>
                              <h3 className="text-lg font-bold text-gray-900 mt-0.5">{cert.type}</h3>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cert.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {cert.status}
                      </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Applicant: <span className="font-medium text-gray-800">{cert.applicant}</span> | Beneficiary: <span className="font-medium text-gray-800">{cert.child}</span></p>
                          <p className="text-xs text-gray-500 mt-1">Mobile: <span className="font-medium text-gray-700">{cert.mobile || 'N/A'}</span> | Aadhar: <span className="font-medium text-gray-700">{cert.aadhar || 'N/A'}</span></p>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Issued Date: {cert.issuedDate}</span>
                            {authRole === 'ADMIN' && cert.status !== 'Approved' && (
                                <button
                                    onClick={() => handleApproveCert(cert.id)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle size={14} /> Approve & Sign
                                </button>
                            )}
                            {cert.status === 'Approved' && (
                                <button
                                    onClick={() => handleDownloadCert(cert)}
                                    className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                                >
                                  <CheckCircle size={14} /> Download Certificate
                                </button>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {activeTab === 'track' && (
                <div className="p-8 max-w-xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Grievance Status</h1>
                  <p className="text-sm text-gray-500 mb-6">Enter your complaint ID to check live progress.</p>

                  <form onSubmit={handleTrackSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complaint ID</label>
                      <div className="flex gap-2">
                        <input
                            type="number"
                            required
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="e.g. 101"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          <Search size={16} /> Track
                        </button>
                      </div>
                    </div>
                  </form>

                  {trackedResult === 'NOT_FOUND' && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                        No complaint found with ID #{trackingId}. Please check the ID and try again.
                      </div>
                  )}

                  {trackedResult && trackedResult !== 'NOT_FOUND' && (
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                          <span className="text-xs font-bold text-blue-600 uppercase">Complaint ID: #{trackedResult.id}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${trackedResult.status === 'Resolved' ? 'bg-green-100 text-green-800' : trackedResult.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {trackedResult.status || 'Pending'}
                    </span>
                        </div>

                        {/* Visual Status Progress Bar */}
                        <div className="py-2">
                          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Live Progress Workflow</div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className={`p-2 rounded-lg text-xs font-medium border ${trackedResult.status === 'Pending' || trackedResult.status === 'Open' || !trackedResult.status ? 'bg-amber-500 text-white border-amber-600 shadow' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                              1. Open / Pending
                            </div>
                            <div className={`p-2 rounded-lg text-xs font-medium border ${trackedResult.status === 'In Progress' ? 'bg-blue-600 text-white border-blue-700 shadow' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                              2. In Progress
                            </div>
                            <div className={`p-2 rounded-lg text-xs font-medium border ${trackedResult.status === 'Resolved' ? 'bg-green-600 text-white border-green-700 shadow' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                              3. Resolved
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{trackedResult.title}</h3>
                        <p className="text-gray-600 text-sm">{trackedResult.description}</p>
                        {trackedResult.assignedTo && trackedResult.assignedTo !== 'Unassigned' && (
                            <p className="text-xs text-indigo-600 font-medium">Assigned Officer: {trackedResult.assignedTo} (Deadline: {trackedResult.deadline})</p>
                        )}
                        {trackedResult.image && (
                            <div className="mt-2">
                              <img src={trackedResult.image} alt="Attachment" className="w-28 h-28 object-cover rounded-lg border" />
                            </div>
                        )}
                        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                          <p className="flex items-center gap-1"><MapPin size={12} className="text-red-500" /> Location: {trackedResult.location}</p>
                          <p className="flex items-center gap-1"><Clock size={12} className="text-blue-500" /> Reported on: {trackedResult.createdAt}</p>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {activeTab === 'schemes' && (
                <div className="p-8 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <Award className="text-blue-600" /> Active Government Welfare Schemes
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { id: 1, name: 'Rythu Bharosa / Farmer Support', description: 'Financial investment support of ₹13,500 per year to farmers.', eligibility: 'All landowning farmers', link: 'https://www.ap.gov.in/' },
                      { id: 2, name: 'Arogyasri Health Coverage', description: 'Free medical treatment up to ₹10 Lakhs for eligible families in network hospitals.', eligibility: 'Low-income households', link: 'https://www.ap.gov.in/' },
                      { id: 3, name: 'Vidya Deevena (Fee Reimbursement)', description: 'Full fee reimbursement for students pursuing higher education and professional courses.', eligibility: 'Students with parental income below 2L', link: 'https://www.ap.gov.in/' },
                      { id: 4, name: 'Palle Pragathi Sanitation Scheme', description: 'Rural infrastructure development, green cover expansion, and regular waste management.', eligibility: 'All rural civic zones', link: 'https://www.ap.gov.in/' },
                      { id: 5, name: 'PM Awas Yojana (Housing for All)', description: 'Financial assistance and subsidized loans for constructing pucca houses for the homeless.', eligibility: 'Economically Weaker Sections (EWS)', link: 'https://www.ap.gov.in/' },
                      { id: 6, name: 'Cheyutha Women Empowerment', description: 'Financial support of ₹18,750 per year for women aged 45-60 belonging to minority and backward communities.', eligibility: 'Women aged 45-60', link: 'https://www.ap.gov.in/' }
                    ].map((scheme) => (
                        <div key={scheme.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
                            <p className="text-gray-600 text-sm mt-2">{scheme.description}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                        {scheme.eligibility}
                      </span>
                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              Visit Portal <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="p-8 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <BarChart3 className="text-blue-600" /> Governance Analytics & Reports
                  </h2>
                  <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-500 font-medium">Total Grievances</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">{grievances.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-500 font-medium">Resolved Cases</p>
                      <h3 className="text-3xl font-bold text-green-600 mt-2">{resolvedCount} ({resolutionPercentage}%)</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-500 font-medium">Active Certificate Applications</p>
                      <h3 className="text-3xl font-bold text-blue-600 mt-2">{certificates.length}</h3>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </main>

        {/* PROFILE & SETTINGS MODAL WITH EDIT OPTION */}
        {showProfileModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setIsEditingProfile(false);
                    }}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                  <div className="bg-blue-600 text-white p-3 rounded-full shadow-md">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{authData.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold uppercase">{authRole} Account</span>
                  </div>
                </div>

                {!isEditingProfile ? (
                    <>
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Full Name</span>
                          <span className="text-sm font-bold text-gray-800">{authData.name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</span>
                          <span className="text-sm font-bold text-gray-800">{authData.mobile}</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Email Address</span>
                          <span className="text-sm font-bold text-gray-800">{authData.email}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 size={14} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </>
                ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setIsEditingProfile(false);
                      showToast("Profile updated successfully!");
                    }} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={authData.name}
                            onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-gray-50 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            maxLength="10"
                            required
                            value={authData.mobile}
                            onChange={(e) => setAuthData({ ...authData, mobile: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-gray-50 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={authData.email}
                            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-gray-50 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
        )}
      </div>
  );
}
