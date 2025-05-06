import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addProject, updateProject } from '../store/projectsSlice';
import getIcon from '../utils/iconUtils';

const ProjectForm = ({ project = null, onComplete }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || '#4f46e5', // Default: indigo
  });
  
  const dispatch = useDispatch();
  
  // Icons
  const SaveIcon = getIcon('Save');
  const PlusIcon = getIcon('Plus');
  
  // Color options
  const colorOptions = [
    { value: '#4f46e5', name: 'Indigo' },
    { value: '#2563eb', name: 'Blue' },
    { value: '#0891b2', name: 'Cyan' },
    { value: '#059669', name: 'Emerald' },
    { value: '#65a30d', name: 'Lime' },
    { value: '#d97706', name: 'Amber' },
    { value: '#dc2626', name: 'Red' },
    { value: '#db2777', name: 'Pink' },
    { value: '#7c3aed', name: 'Violet' },
    { value: '#6b7280', name: 'Gray' },
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    if (project) {
      // Update existing project
      dispatch(updateProject({
        ...project,
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
      }));
      toast.success("Project updated successfully");
    } else {
      // Create new project
      const newProject = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        createdAt: new Date().toISOString(),
      };
      dispatch(addProject(newProject));
      toast.success("Project created successfully");
    }
    
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4">
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium mb-1">Project Name <span className="text-red-500">*</span></label>
        <input type="text" id="project-name" name="name" value={formData.name} onChange={handleInputChange} className="input" placeholder="Enter project name" />
      </div>
      
      <div>
        <label htmlFor="project-description" className="block text-sm font-medium mb-1">Description</label>
        <textarea id="project-description" name="description" value={formData.description} onChange={handleInputChange} rows="2" className="input" placeholder="Enter project description (optional)"></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
              className={`w-8 h-8 rounded-full transition-all ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-surface-900 scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            ></button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onComplete} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2">
          {project ? (
            <>
              <SaveIcon className="w-4 h-4" />
              <span>Save Project</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              <span>Create Project</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;