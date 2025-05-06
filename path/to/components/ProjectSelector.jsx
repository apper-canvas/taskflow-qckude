import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectAllProjects } from '../store/projectsSlice';
import getIcon from '../utils/iconUtils';

const ProjectSelector = ({ selectedProject, onProjectSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const projects = useSelector(selectAllProjects);
  
  const BriefcaseIcon = getIcon('Briefcase');
  const ChevronDownIcon = getIcon('ChevronDown');
  
  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    setIsOpen(false);
  };
  
  const selectedProjectData = projects.find(p => p.id === selectedProject) || null;
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input flex items-center justify-between pl-10 text-left"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedProjectData ? (
            <>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProjectData.color }}></span>
              <span className="truncate">{selectedProjectData.name}</span>
            </>
          ) : (
            <span className="text-surface-400">Select project</span>
          )}
        </div>
        <ChevronDownIcon className="w-4 h-4 ml-2 text-surface-400" />
      </button>
      
      <BriefcaseIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {projects.map(project => (
            <button key={project.id} onClick={() => handleProjectSelect(project.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-surface-100 dark:hover:bg-surface-700">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></span>
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectSelector;