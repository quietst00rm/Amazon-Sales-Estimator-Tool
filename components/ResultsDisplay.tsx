import React from 'react';
import { type CalculationResult } from '../types';

interface MetricCardProps {
    label: string;
    value: string;
    unit?: string;
    variant?: 'primary' | 'highlight' | 'default';
    isCurrency?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, variant = 'default', isCurrency = false }) => {
    const variantClasses = {
        primary: 'bg-accent-green/5 dark:bg-accent-green/10 border-accent-green/30 dark:border-accent-green/50',
        highlight: 'bg-bright-blue/5 dark:bg-bright-blue/10 border-bright-blue/30 dark:border-bright-blue/50 md:col-span-1 lg:col-span-1',
        default: 'bg-slate-gray/5 dark:bg-slate-gray/10 border-slate-gray/20 dark:border-slate-gray/30'
    };

    const currencyClass = isCurrency ? 'text-accent-green' : 'text-deep-navy dark:text-soft-white';
    
    return (
        <div className={`flex flex-col justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:border-bright-blue/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-bright-blue/10 dark:hover:shadow-bright-blue/20 min-h-[140px] ${variantClasses[variant]}`}>
            <div className="font-manrope text-sm font-semibold text-slate-gray dark:text-soft-white/70 uppercase tracking-wide mb-3">{label}</div>
            <div className={`font-manrope text-3xl md:text-4xl font-extrabold ${currencyClass}`}>
                {value}
            </div>
            {unit && <div className="text-sm text-slate-gray/80 dark:text-soft-white/50 font-medium mt-1">{unit}</div>}
        </div>
    );
};

interface ResultsDisplayProps {
    result: CalculationResult;
    priceProvided: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, priceProvided }) => {
    const formatNumber = (num: number) => num.toLocaleString('en-US');
    const formatCurrency = (num: number) => '$' + formatNumber(Math.round(num));

    return (
        <div className="space-y-8 pt-8 border-t-2 border-slate-gray/10 dark:border-slate-gray/20">
            <div className="flex justify-between items-center">
                <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-deep-navy dark:text-soft-white">Sales & Revenue Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard 
                    label="Estimated Monthly Sales" 
                    value={formatNumber(result.monthlySales)} 
                    unit="units/month"
                    variant="primary"
                />
                <MetricCard 
                    label="Daily Sales" 
                    value={formatNumber(result.dailySales)} 
                    unit="units/day"
                />
            </div>

            {priceProvided && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                        label="Monthly Revenue" 
                        value={formatCurrency(result.monthlyRevenue)} 
                        unit="estimated"
                        isCurrency
                    />
                     <MetricCard 
                        label="Daily Revenue" 
                        value={formatCurrency(result.dailyRevenue)} 
                        unit="average per day"
                        isCurrency
                    />
                    <MetricCard 
                        label="Annual Revenue Projection" 
                        value={formatCurrency(result.annualRevenue)} 
                        unit="12-month forecast"
                        variant="highlight"
                        isCurrency
                    />
                </div>
            )}

            <div className="bg-slate-gray/5 dark:bg-slate-gray/10 border border-slate-gray/10 dark:border-slate-gray/20 rounded-xl p-6">
                <h3 className="font-manrope text-sm font-bold text-slate-gray/80 dark:text-soft-white/60 uppercase tracking-wider mb-2">Calculation Method</h3>
                <p className="text-slate-gray dark:text-soft-white/70 text-sm leading-relaxed">{result.methodologyText}</p>
            </div>
        </div>
    );
};