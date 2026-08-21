import React, { useState } from 'react';
import { Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'CITIZEN'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // For demo purposes, triggering success login state to enter the app
        onLoginSuccess(formData.role);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

                {/* App Branding */}
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-full shadow-lg mb-2">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide">CivicPulse Nexus</h1>
                    <p className="text-xs text-blue-200 mt-1">Smart Governance & Welfare Portal</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-black/20 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
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
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Select Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition"
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