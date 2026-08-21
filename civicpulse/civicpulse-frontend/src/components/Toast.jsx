import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    if (!message) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                <span>{message}</span>
            </div>
        </div>
    );
}