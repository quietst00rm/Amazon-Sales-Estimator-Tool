import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-8 sm:mb-12 pt-4 sm:pt-0">
            <h1 className="font-manrope text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-deep-navy dark:text-soft-white">
                Amazon Sales Estimator
            </h1>
            <p className="text-base sm:text-lg text-slate-gray italic">
                Evidence-based monthly sales predictions for Amazon sellers
            </p>
        </header>
    );
};