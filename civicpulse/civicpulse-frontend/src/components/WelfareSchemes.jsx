import React, { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';

export default function WelfareSchemes() {
    const [schemes] = useState([
        { id: 1, name: 'Rythu Bharosa / Farmer Support', description: 'Financial investment support of ₹13,500 per year to farmers.', eligibility: 'All landowning farmers' },
        { id: 2, name: 'Arogyasri Health Coverage', description: 'Free medical treatment up to ₹10 Lakhs for eligible families in network hospitals.', eligibility: 'Low-income households' },
        { id: 3, name: 'Vidya Deevena (Fee Reimbursement)', description: 'Full fee reimbursement for students pursuing higher education (MCA/BTech/Diploma).', eligibility: 'Students with parental income below 2L' },
        { id: 4, name: 'Palle Pragathi Sanitation Scheme', description: 'Infrastructure development and regular waste management tracking for rural areas.', eligibility: 'All rural civic zones' }
    ]);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Award className="text-blue-600" /> Active Government Welfare Schemes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                {schemes.map((scheme) => (
                    <div key={scheme.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                        <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
                        <p className="text-gray-600 text-sm mt-2">{scheme.description}</p>
                        <div className="mt-4 flex items-center justify-between">
              <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                {scheme.eligibility}
              </span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                                Apply Now <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}