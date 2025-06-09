import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchAndFilters = ({ searchTerm, onSearchChange, onReset }) => (
    <div className="flex flex-col gap-4 mb-8 items-center w-full">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
            </div>
            <Button
                variant="outline"
                onClick={onReset}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-4 py-2"
            >
                <RotateCw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
    </div>
);

export default SearchAndFilters;
