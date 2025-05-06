import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Icons
  const CheckIcon = getIcon('CheckCircle2');
  const PendingIcon = getIcon('Clock');
  const TotalIcon = getIcon('ListTodo');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.completed).length;
    setStats({
      total: tasks.length,
      completed: completed,
      pending: tasks.length - completed
    });
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    toast.info(`Filtered by ${category === 'all' ? 'all tasks' : category}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center pb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Organize Your Tasks</h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Create, organize, and track your tasks with our intuitive interface.
          Stay productive and never miss a deadline again.
        </p>
      </div>
      
      {/* Stats Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants} className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
              <TotalIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-lg">
              <CheckIcon className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg">
              <PendingIcon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'work', 'personal', 'shopping', 'health'].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Main Task Management Feature */}
      <MainFeature 
        selectedCategory={selectedCategory} 
        onStatsUpdate={updateStats} 
      />
    </motion.div>
  );
}