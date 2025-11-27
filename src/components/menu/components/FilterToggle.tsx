import React from 'react';

interface FilterToggleProps {
    title: string;
    icon: React.ReactElement;
    checked: boolean;
    onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ title, icon, checked, onToggle }) => (
    <div className="filter-toggle-item">
        <div className="filter-toggle-content">
            <div className="filter-toggle-label">
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
                <span>{title}</span>
            </div>
            <label className="toggle-switch">
                <input type="checkbox" checked={checked} onChange={onToggle} className="toggle-input" />
                <div className="toggle-track">
                    <div className="toggle-thumb"></div>
                </div>
            </label>
        </div>
    </div>
);
