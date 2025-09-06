'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteFlashcard, deleteSet } from '@/lib/api';

// Simple animation wrapper
export function AnimatedSection({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Search filter component
export function SearchFilter({ items, onFiltered, searchKey = 'name', placeholder = 'Search...' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      onFiltered(items);
    } else {
      const filtered = items.filter(item => 
        item[searchKey]?.toLowerCase().includes(value.toLowerCase())
      );
      onFiltered(filtered);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

// Action buttons for CRUD operations
export function ActionButton({ item, action, variant = 'default' }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Er du sikker på du vil slette "${item.name || item.front}"?`)) {
      return;
    }

    try {
      if (item.front) {
        // It's a flashcard
        await deleteFlashcard(item.id);
        toast({
          title: "Flashcard slettet",
          description: `"${item.front}" er blevet slettet.`,
        });
      } else {
        // It's a set
        await deleteSet(item.id);
        toast({
          title: "Set slettet", 
          description: `"${item.name}" er blevet slettet.`,
        });
      }
      router.refresh(); // Refresh the page to show changes
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Fejl",
        description: error.message || "Kunne ikke slette elementet.",
        variant: "destructive",
      });
    }
  };

  const baseClasses = "px-3 py-1 rounded text-sm transition-colors";
  const variants = {
    default: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    destructive: "bg-red-100 hover:bg-red-200 text-red-700"
  };

  if (action === 'Edit') {
    const editPath = item.front 
      ? `/cards/${item.id}/edit`  // It's a flashcard
      : `/sets/${item.id}/edit`;  // It's a set

    return (
      <Link href={editPath}>
        <button className={`${baseClasses} ${variants[variant]}`}>
          Rediger
        </button>
      </Link>
    );
  }

  if (action === 'Delete') {
    return (
      <button 
        onClick={handleDelete}
        className={`${baseClasses} ${variants[variant]}`}
      >
        Slet
      </button>
    );
  }

  // Fallback for other actions
  return (
    <button 
      onClick={() => toast({
        title: `${action} not implemented`,
        description: `${action} functionality coming soon.`,
      })}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {action}
    </button>
  );
}