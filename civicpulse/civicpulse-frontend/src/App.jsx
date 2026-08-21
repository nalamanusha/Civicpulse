import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, FileText, Award, BarChart3, Shield, User, CheckCircle, LogOut, Search, Filter, Mail, Lock, ArrowRight, ExternalLink, MapPin, Navigation, Clock, Upload, FileCheck } from 'lucide-react';

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
  const [role, setRole] = useState('CITIZEN');

  // Using original key 'civicpulse_grievances' so your previously filed data is preserved!
  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('civicpulse_grievances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 101, category: 'Water Supply', title: 'No water supply for 5 days', description: 'Pipeline leakage near main junction', location: 'Sector 5', image: null, status: 'In Progress', createdAt: new Date().toISOString().split('T')[0] },
      { id: 102, category: 'Sanitation', title: 'Garbage Clearance', description: 'Overflowing bins near market area', location: 'Collectorate Junction', image: null, status: 'Resolved', createdAt: new Date().toISOString().split('T')[0] }
    ];
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('civicpulse_certificates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 'APP-2024-1247', type: 'Birth Certificate', applicant: 'Priya Sharma', child: 'Aarav', status: 'Approved', issuedDate: new Date().toISOString().split('T')[0] },
      { id: 'APP-2024-1248', type: 'Income Certificate', applicant: 'Rajesh Kumar', child: 'Self', status: 'Pending Verification', issuedDate: '-' }
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
    email: '',
    password: '',
    name: ''
  });

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
    setRole(authRole);
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
    showToast('Grievance status updated to Resolved!');
  };

  const handleApproveCert = (id) => {
    const currentDate = new Date().toISOString().split('T')[0];
    setCertificates(certificates.map(c => c.id === id ? { ...c, status: 'Approved', issuedDate: currentDate } : c));
    showToast(`Certificate ${id} approved successfully!`);
  };

  const filteredGrievances = grievances.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const resolutionPercentage = grievances.length > 0 ? Math.round((resolvedCount / grievances.length) * 100) : 0;

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
          {toastMessage && (
              <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
                {toastMessage}
              </div>
          )}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
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
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authData.password}
                      onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Select Role</label>
                <select
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value)}
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
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
      <div className="flex h-screen bg-gray-100">
        {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
              {toastMessage}
            </div>
        )}

        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
          <div>
            <div className="p-4 font-bold text-sm border-b border-gray-200 flex items-center gap-2 text-blue-600 leading-tight">
              <Shield className="h-6 w-6 shrink-0" /> Smart Governance Portal
            </div>
            <nav className="p-4 space-y-2">
              <button onClick={() => setActiveTab('feed')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'feed' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Home size={18} /> Live Feed
              </button>
              <button onClick={() => setActiveTab('file')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'file' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <FileText size={18} /> File Grievance
              </button>
              <button onClick={() => setActiveTab('certificates')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'certificates' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <FileCheck size={18} /> Certs & Permits
              </button>
              <button onClick={() => setActiveTab('track')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'track' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Navigation size={18} /> Track Grievance
              </button>
              <button onClick={() => setActiveTab('schemes')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'schemes' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Award size={18} /> Welfare Schemes
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <BarChart3 size={18} /> Governance Analytics
              </button>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 font-semibold uppercase">Current Role</div>
            <div className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-1">
              <User size={14} /> {role}
            </div>
            <button
                onClick={() => setIsAuthenticated(false)}
                className="mt-3 w-full bg-red-50 text-red-600 hover:bg-red-100 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'feed' && (
              <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Administrative Operations & Live Feed</h1>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>Role: {role}</span>
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
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {item.status}
                  </span>

                        {role === 'ADMIN' && item.status !== 'Resolved' && (
                            <button
                                onClick={() => handleStatusChange(item.id, 'Resolved')}
                                className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={14} /> Mark as Resolved
                            </button>
                        )}
                      </div>
                    </div>
                ))}
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

                {role === 'CITIZEN' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <h3 className="text-md font-bold text-gray-800 mb-3">Apply for New Certificate</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const newCert = {
                          id: `APP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                          type: e.target.certType.value,
                          applicant: e.target.applicantName.value,
                          child: e.target.childName.value,
                          status: 'Pending Verification',
                          issuedDate: '-'
                        };
                        setCertificates([newCert, ...certificates]);
                        showToast("Certificate application submitted successfully!");
                        e.target.reset();
                      }} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input name="certType" type="text" required placeholder="Certificate Type (e.g. Birth/Income)" className="border p-2 rounded text-sm bg-gray-50" />
                          <input name="applicantName" type="text" required placeholder="Applicant Full Name" className="border p-2 rounded text-sm bg-gray-50" />
                          <input name="childName" type="text" required placeholder="Beneficiary / Child Name" className="border p-2 rounded text-sm bg-gray-50" />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-2 rounded font-medium hover:bg-blue-700 transition cursor-pointer">
                          Submit Application
                        </button>
                      </form>
                    </div>
                )}

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

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Issued Date: {cert.issuedDate}</span>
                          {role === 'ADMIN' && cert.status !== 'Approved' && (
                              <button
                                  onClick={() => handleApproveCert(cert.id)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle size={14} /> Approve & Sign
                              </button>
                          )}
                          {cert.status === 'Approved' && (
                              <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle size={14} /> Digital Signed & Downloadable
                      </span>
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
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-xs font-bold text-blue-600 uppercase">Complaint ID: #{trackedResult.id}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${trackedResult.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {trackedResult.status}
                  </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{trackedResult.title}</h3>
                      <p className="text-gray-600 text-sm">{trackedResult.description}</p>
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
                  <BarChart3 className="text-blue-600" /> Administrative Operations & Analytics
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Total Grievances</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{grievances.length}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Resolved Cases</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{resolvedCount} ({resolutionPercentage}%)</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Active Applications</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-2">{certificates.length}</h3>
                  </div>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}