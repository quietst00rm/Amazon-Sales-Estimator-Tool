import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, children }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-manrope font-bold text-sm text-slate-gray dark:text-soft-white/90">{label}</label>
            {children}
        </div>
    );
};

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-500/10 border-2 border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-4 text-center text-sm animate-shake">
            {message}
        </div>
    );
};


interface CalculatorFormProps {
    onCalculate: (category: string, bsr: number, price: number | null) => void;
    onReset: () => void;
    error: string;
    theme: 'light' | 'dark';
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, onReset, error, theme }) => {
    const [category, setCategory] = useState('');
    const [bsr, setBsr] = useState('');
    const [price, setPrice] = useState('');

    const formatBsr = (value: string): string => {
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    const handleBsrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBsr(formatBsr(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bsrAsNumber = bsr ? Number(bsr.replace(/,/g, '')) : 0;
        onCalculate(category, bsrAsNumber, price ? Number(price) : null);
    };

    const handleResetClick = () => {
        setCategory('');
        setBsr('');
        setPrice('');
        onReset();
    };

    const baseInputClasses = "w-full px-4 py-3 text-base border-2 rounded-xl bg-soft-white dark:bg-deep-navy border-slate-gray/30 dark:border-slate-gray/70 text-deep-navy dark:text-soft-white placeholder:text-slate-gray/60 dark:placeholder:text-slate-gray/40 transition-colors duration-300 focus:outline-none focus:border-bright-blue focus:ring-2 focus:ring-bright-blue/50";

    const lightArrowColor = '%234B5563'; // slate-gray
    const darkArrowColor = '%23F9FAFB'; // soft-white
    const selectArrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='${theme === 'dark' ? darkArrowColor : lightArrowColor}' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`;


    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputGroup label="Amazon Product Category">
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${baseInputClasses} appearance-none bg-no-repeat bg-right-4`}
                        style={{ backgroundImage: selectArrowSvg }}
                    >
                        <option value="" disabled>Select a category...</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-soft-white text-deep-navy dark:bg-deep-navy dark:text-soft-white">{cat}</option>
                        ))}
                    </select>
                </InputGroup>
                <InputGroup label="Best Seller Rank (BSR)">
                    <input
                        type="text"
                        inputMode="numeric"
                        id="bsr"
                        value={bsr}
                        onChange={handleBsrChange}
                        placeholder="e.g., 1,000"
                        className={baseInputClasses}
                    />
                </InputGroup>
                <InputGroup label="Product Price (Optional)">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-gray pointer-events-none">$</span>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="29.99"
                            min="0.01"
                            step="0.01"
                            className={`${baseInputClasses} pl-7`}
                        />
                    </div>
                </InputGroup>
            </div>

            <ErrorMessage message={error} />

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                    type="submit"
                    className="font-manrope w-full sm:w-auto font-bold text-base uppercase tracking-wider px-10 py-4 rounded-xl bg-gradient-to-r from-bright-blue to-blue-700 text-soft-white shadow-lg shadow-bright-blue/30 hover:shadow-bright-blue/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                    Calculate Sales
                </button>
                <button
                    type="button"
                    onClick={handleResetClick}
                    className="font-manrope w-full sm:w-auto font-bold text-base uppercase tracking-wider px-10 py-4 rounded-xl bg-slate-gray/10 dark:bg-slate-gray/20 border-2 border-slate-gray/20 dark:border-slate-gray/50 text-slate-gray dark:text-soft-white hover:bg-slate-gray/20 dark:hover:bg-slate-gray/40 hover:border-slate-gray/40 dark:hover:border-slate-gray/70 transition-colors duration-300"
                >
                    Reset
                </button>
            </div>
        </form>
    );
};