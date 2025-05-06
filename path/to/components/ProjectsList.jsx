import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { selectAllProjects, deleteProject } from '../store/projectsSlice';
import ProjectForm from './ProjectForm';
import getIcon from '../utils/iconUtils';

const ProjectsList = ({ onProjectSelect, selectedProjectId }) => {
  const projects = useSelector(selectAllProjects);
  const dispatch = useDispatch();
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash2');
  const BriefcaseIcon = getIcon('Briefcase');
  
  const handleDeleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project? All associated tasks will remain but will no longer be assigned to this project.')) {
      dispatch(deleteProject(projectId));
      toast.success('Project deleted successfully');
      
      // If the deleted project was selected, revert to "all"
      if (selectedProjectId === projectId) {
        onProjectSelect(null);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Projects</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingProject(!isAddingProject)}
          className="btn-outline text-sm flex items-center gap-1 px-2 py-1"
        >
          {isAddingProject ? 'Cancel' : (
            <>
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </>
          )}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isAddingProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ProjectForm onComplete={() => setIsAddingProject(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2">
        <button
          onClick={() => onProjectSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between
            ${!selectedProjectId ? 'bg-surface-100 dark:bg-surface-800 font-medium text-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-900'}`
          }
        >
          <span>All Tasks</span>
        </button>
        
        {projects.map(project => (
          <div key={project.id} className="group">
            <button
              onClick={() => onProjectSelect(project.id)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                selectedProjectId === project.id ? 'bg-surface-100 dark:bg-surface-800 font-medium' : 'hover:bg-surface-50 dark:hover:bg-surface-900'
              }`}
            >
              <div className="flex items-center gap-2 max-w-[85%]">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }}></span>
                <span className="truncate">{project.name}</span>
              </div>
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                  }}
                  className="p-1 text-surface-500 hover:text-primary rounded"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="p-1 text-surface-500 hover:text-red-500 rounded"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>
            
            <AnimatePresence>
              {editingProject?.id === project.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <ProjectForm 
                    project={project} 
                    onComplete={() => setEditingProject(null)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-6 text-surface-500 dark:text-surface-400">
            <BriefcaseIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No projects created yet</p>
            <p className="text-sm">Create a project to organize your tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;