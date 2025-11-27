import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Pagination: React.FC = () => (
    <div className="pagination">
        <button className="pagination-nav">
            <ChevronDown size={20} className="rotate-90" />
        </button>
        {[1, 2, 3, '...', 10].map((page, index) => (
            <button
                key={index}
                className={`pagination-button ${page === 1 ? 'active' : ''}`}
                disabled={page === '...'}
            >
                {page}
            </button>
        ))}
        <button className="pagination-nav">
            <ChevronDown size={20} className="-rotate-90" />
        </button>
    </div>
);
