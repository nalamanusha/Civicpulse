import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function GovernanceAnalytics({ grievances }) {
    // Dynamically calculate based on the grievances prop passed from App.jsx
    const total = grievances.length;
    const resolved = grievances.filter(g => g.status === 'Resolved').length;
    const activeCitizens = 145; // Placeholder value

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <BarChart3 className="text-blue-600" /> Governance & Grievance Analytics
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Total Grievances Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Total Grievances</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{total}</h3>
                </div>

                {/* Resolved Cases Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Resolved Cases</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{resolved}</h3>
                </div>

                {/* Active Citizens Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Active Citizens</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-2">{activeCitizens}</h3>
                </div>
            </div>
        </div>
    );
}