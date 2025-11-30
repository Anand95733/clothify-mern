import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

export function FilterPanel({ filters, setFilters, categories = ['Men', 'Women', 'Kids', 'Accessories'] }) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        setFilters(localFilters);
    };

    const handleReset = () => {
        const reset = { category: '', minPrice: '', maxPrice: '', sort: '' };
        setLocalFilters(reset);
        setFilters(reset);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={localFilters.category === cat}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="text-primary focus:ring-primary"
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full border rounded px-2 py-1"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full border rounded px-2 py-1"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex space-x-2 pt-4">
                <Button onClick={handleApply} className="w-full" size="sm">Apply</Button>
                <Button onClick={handleReset} variant="outline" className="w-full" size="sm">Reset</Button>
            </div>
        </div>
    );
}
