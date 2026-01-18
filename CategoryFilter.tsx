
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Category } from './types';

interface CategoryItem {
  id: Category;
  name: string;
  icon: React.ReactNode;
}

interface CategoryFilterProps {
  categories: CategoryItem[];
  selectedCategory: Category | 'all';
  onSelect: (id: Category | 'all') => void;
  allText?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelect,
  allText = "الكل"
}) => {
  return (
    <div className="px-4 py-4">
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
        {/* Special 'All' Button */}
        <button 
          onClick={() => onSelect('all')}
          className={`flex flex-col items-center min-w-[70px] transition-all duration-200 ${
            selectedCategory === 'all' ? 'text-emerald-600 scale-105' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className={`p-3 rounded-2xl mb-1 transition-all duration-200 ${
            selectedCategory === 'all' 
              ? 'bg-emerald-100 shadow-md ring-2 ring-emerald-500/20' 
              : 'bg-white border border-gray-100 hover:border-emerald-200'
          }`}>
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold">{allText}</span>
        </button>

        {/* Dynamic Category List */}
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center min-w-[70px] transition-all duration-200 ${
              selectedCategory === cat.id ? 'text-emerald-600 scale-105' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className={`p-3 rounded-2xl mb-1 transition-all duration-200 ${
              selectedCategory === cat.id 
                ? 'bg-emerald-100 shadow-md ring-2 ring-emerald-500/20' 
                : 'bg-white border border-gray-100 hover:border-emerald-200'
            }`}>
              {cat.icon}
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
