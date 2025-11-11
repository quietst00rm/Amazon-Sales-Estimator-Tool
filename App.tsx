import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import { type CalculationResult, type CalculationMethod } from './types';
import { SALES_DATA } from './constants';

const App: React.FC = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [error, setError] = useState<string>('');
    const [priceProvided, setPriceProvided] = useState<boolean>(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const interpolate = (x: number, x1: number, y1: number, x2: number, y2: number): number => {
        return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    };

    const calculatePowerLaw = (bsr: number, coefficient: number, exponent: number): number => {
        return coefficient * Math.pow(bsr, exponent);
    };

    const calculateSales = useCallback((category: string, bsr: number): { sales: number; method: CalculationMethod } => {
        const categoryData = SALES_DATA[category];
        const data = categoryData.data;

        for (let i = 0; i < data.length - 1; i++) {
            if (bsr >= data[i][0] && bsr <= data[i + 1][0]) {
                const sales = interpolate(bsr, data[i][0], data[i][1], data[i + 1][0], data[i + 1][1]);
                return {
                    sales: Math.max(30, Math.round(sales / 30) * 30),
                    method: 'interpolation',
                };
            }
        }
        
        const sales = calculatePowerLaw(bsr, categoryData.coefficient, categoryData.exponent);
        if (bsr < data[0][0]) {
            return {
                sales: Math.max(30, Math.round(sales / 30) * 30),
                method: 'extrapolation',
            };
        }
        
        return {
            sales: Math.max(30, Math.round(sales / 30) * 30),
            method: 'power_law',
        };
    }, []);

    const handleCalculate = useCallback((category: string, bsr: number, price: number | null) => {
        setError('');

        if (!category) {
            setError('Please select a product category.');
            return;
        }
        if (isNaN(bsr) || bsr < 1) {
            setError('Please enter a valid Best Seller Rank (must be 1 or greater).');
            return;
        }
         if (bsr > 10000000) {
            setError('BSR value seems unusually high. Please verify your input.');
            return;
        }
        if (price !== null && (isNaN(price) || price <= 0)) {
            setError('Please enter a valid price (must be greater than 0).');
            return;
        }

        const { sales, method } = calculateSales(category, bsr);
        const dailySales = Math.round(sales / 30);

        const monthlyRevenue = price ? sales * price : 0;
        const dailyRevenue = price ? dailySales * price : 0;
        const annualRevenue = price ? monthlyRevenue * 12 : 0;

        let methodologyText = '';
        const formattedBsr = bsr.toLocaleString('en-US');

        if (method === 'interpolation') {
            methodologyText = `This estimate is interpolated from verified historical sales data for the ${category} category at BSR ${formattedBsr}, based on direct data points.`;
        } else if (method === 'extrapolation') {
            methodologyText = `This estimate uses power law extrapolation calibrated from historical data in the ${category} category, as the BSR is below the typical observed range.`;
        } else {
            methodologyText = `This estimate uses a power law regression model calibrated from extensive historical data in the ${category} category.`;
        }

        if (price) {
            methodologyText += ` Revenue calculations based on a $${price.toFixed(2)} price point.`;
        }
        
        setResult({
            monthlySales: sales,
            dailySales: dailySales,
            monthlyRevenue: monthlyRevenue,
            dailyRevenue: dailyRevenue,
            annualRevenue: annualRevenue,
            methodologyText: methodologyText,
        });

        setPriceProvided(!!price);

    }, [calculateSales]);

    const handleReset = useCallback(() => {
        setResult(null);
        setError('');
        setPriceProvided(false);
    }, []);

    return (
        <div className="bg-soft-white dark:bg-deep-navy min-h-screen text-deep-navy dark:text-soft-white flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
            <div className="container mx-auto max-w-5xl w-full">
                 <div className="w-full flex justify-end mb-4 -mt-2 sm:-mt-0">
                    <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                </div>
                <Header />
                <main className="bg-white dark:bg-deep-navy-lighter border border-slate-gray/20 dark:border-slate-gray/30 rounded-2xl shadow-2xl shadow-slate-gray/10 dark:shadow-black/20 p-6 sm:p-8 md:p-12">
                    <CalculatorForm onCalculate={handleCalculate} onReset={handleReset} error={error} theme={theme} />
                    {result && (
                        <div className="mt-8 sm:mt-12 animate-fadeIn">
                             <ResultsDisplay result={result} priceProvided={priceProvided} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;