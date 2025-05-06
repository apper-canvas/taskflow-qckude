import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import ProjectSelector from './ProjectSelector';
import { selectAllProjects } from '../store/projectsSlice';

export default function MainFeature({ selectedCategory = 'all', selectedProject = null, onStatsUpdate }) {
  // State for tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { 
        id: '1', 
        title: 'Welcome to TaskFlow!', 
        description: 'This is your first task. Try marking it as complete or edit it.', 
        completed: false, 
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 86400000).toISOString(), 
        projectId: '1', // Default project
        priority: 2,
        category: 'personal'
      }
    ];
  });
  
  // State for new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    projectId: '',
    priority: 2,
    category: 'personal'
  });
  
  // State for task being edited
  const [editingTask, setEditingTask] = useState(null);
  
  // State for showing task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Icon declarations
  const PlusIcon = getIcon('Plus');
  const CheckIcon = getIcon('Check');
  const TrashIcon = getIcon('Trash2');
  const EditIcon = getIcon('Edit');
  const XIcon = getIcon('X');
  const FlagIcon = getIcon('Flag');
  const SaveIcon = getIcon('Save');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronDownIcon = getIcon('ChevronDown');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const BriefcaseIcon = getIcon('Briefcase');
  
  const projects = useSelector(selectAllProjects);
  
  // Ref for input focus
  const titleInputRef = useRef(null);
  
  // Effect to save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onStatsUpdate) {
      onStatsUpdate(tasks);
    }
  }, [tasks, onStatsUpdate]);
  
  // Function to focus title input when form is shown
  useEffect(() => {
    if (showTaskForm && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showTaskForm]);
  
  // Filtered tasks based on selected category
  const filteredTasks = tasks.filter(task => {
    // First filter by category if specified
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
    
    // Then filter by project if specified
    const projectMatch = selectedProject === null || task.projectId === selectedProject;
    
    // Task must match both filters
    return categoryMatch && projectMatch;
  });
  
  // Find project for a task
  const getProjectForTask = (projectId) => projects.find(p => p.id === projectId) || null;
  
  // Handle input change for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle project selection for new task
  const handleProjectSelect = (projectId) => {
    setNewTask(prev => ({ ...prev, projectId }));
  };
  
  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
      projectId: newTask.projectId || null,
      priority: parseInt(newTask.priority) || 2,
      category: newTask.category || 'personal'
    };
    
    setTasks(prev => [newTaskObj, ...prev]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      projectId: '',
      priority: 2,
      category: 'personal'
    });
    
    toast.success("Task added successfully");
    setShowTaskForm(false);
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    
    const task = tasks.find(task => task.id === id);
    if (task) {
      toast.info(task.completed ? "Task marked as pending" : "Task completed!");
    }
  };
  
  // Delete task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted");
  };
  
  // Set task to edit
  const startEditTask = (task) => {
    setEditingTask({ ...task });
  };
  
  // Handle edit input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle project selection for editing task
  const handleEditProjectSelect = (projectId) => {
    setEditingTask(prev => ({ ...prev, projectId }));
  };
  
  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id ? { 
          ...editingTask,
          title: editingTask.title.trim(),
          description: editingTask.description.trim(),
          dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString() : null,
          projectId: editingTask.projectId,
          priority: parseInt(editingTask.priority) || 2
        } : task
      )
    );
    
    setEditingTask(null);
    toast.success("Task updated");
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
  };
  
  // Priority color helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return "text-green-500";
      case 2: return "text-amber-500";
      case 3: return "text-red-500";
      default: return "text-amber-500";
    }
  };
  
  // Category color helper
  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'personal': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 'shopping': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'health': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">My Tasks</h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showTaskForm ? (
            <>
              <XIcon className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              <span>Add Task</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Add Task Form */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-4 md:p-6">
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="input"
                    placeholder="Enter task description (optional)"
                  ></textarea>
                </div>
                
                  <div className="col-span-1">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        className="input pl-10"
                      />
                      <CalendarIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                    </div>
                  </div>
                  <div className="col-span-1">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        className="input appearance-none pl-10"
                      >
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                      </select>
                      <FlagIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="project" className="block text-sm font-medium mb-1">
                      Project
                    </label>
                    <ProjectSelector 
                      selectedProject={newTask.projectId} 
                      onProjectSelect={handleProjectSelect} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="col-span-1">
                    
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={newTask.category}
                        onChange={handleInputChange}
                        className="input appearance-none pl-10"
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                      </select>
                      <TagIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="bg-surface-100 dark:bg-surface-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <TagIcon className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
                {selectedCategory === 'all' 
                  ? "You don't have any tasks yet. Add a new task to get started!"
                  : `You don't have any tasks in the "${selectedCategory}" category.`}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`card overflow-visible ${
                    task.completed ? 'opacity-80 border-green-200 dark:border-green-900' : ''
                  }`}
                >
                  {editingTask && editingTask.id === task.id ? (
                    // Edit Task Form
                    <div className="p-4 md:p-6 space-y-4">
                      <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
                          Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          name="title"
                          value={editingTask.title}
                          onChange={handleEditChange}
                          className="input"
                          placeholder="Enter task title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id="edit-description"
                          name="description"
                          value={editingTask.description}
                          onChange={handleEditChange}
                          rows="3"
                          className="input"
                          placeholder="Enter task description (optional)"
                        ></textarea>
                      </div>
                      
                      <div className="col-span-1">
                        <div>
                            Due Date
                            Due Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="edit-dueDate"
                              name="dueDate"
                              value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                              onChange={handleEditChange}
                              className="input pl-10"
                            />
                            <CalendarIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                          </div>
                        </div>
                        
                      <div className="col-span-1">
                          <label htmlFor="edit-priority" className="block text-sm font-medium mb-1">
                            Priority
                          </label>
                          <div className="relative">
                            <select
                              id="edit-priority"
                              name="priority"
                              value={editingTask.priority}
                              onChange={handleEditChange}
                              className="input appearance-none pl-10"
                            >
                              <option value="1">Low</option>
                              <option value="2">Medium</option>
                              <option value="3">High</option>
                            </select>
                            <FlagIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                          </div>
                        </div>
                        
                      <div className="col-span-1">
                        <label htmlFor="edit-project" className="block text-sm font-medium mb-1">
                          Project
                        </label>
                        <ProjectSelector 
                          selectedProject={editingTask.projectId} 
                          onProjectSelect={handleEditProjectSelect} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                      <div className="col-span-1">
                        
                          <label htmlFor="edit-category" className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <div className="relative">
                            <select
                              id="edit-category"
                              name="category"
                              value={editingTask.category}
                              onChange={handleEditChange}
                              className="input appearance-none pl-10"
                            >
                              <option value="work">Work</option>
                              <option value="personal">Personal</option>
                              <option value="shopping">Shopping</option>
                              <option value="health">Health</option>
                            </select>
                            <TagIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-4 h-4 text-surface-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEditedTask}
                          className="btn-primary flex items-center gap-2"
                        >
                          <SaveIcon className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Task View
                    <div className="group">
                      <div className="flex items-start gap-3 p-4 md:p-6">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-surface-300 dark:border-surface-600 
                                    flex items-center justify-center group-hover:border-primary transition-colors"
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed && (
                            <CheckIcon className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                        
                        {/* Task Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className={`text-lg font-medium break-words ${
                                task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''
                              }`}>
                                {task.title}
                              </h3>
                              
                              {task.projectId && getProjectForTask(task.projectId) && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full" 
                                    style={{ backgroundColor: getProjectForTask(task.projectId).color }}
                                  ></span>
                                  <span className="text-xs text-surface-500">{getProjectForTask(task.projectId).name}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(task.category)}`}>
                                {task.category}
                              </span>
                              <FlagIcon className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className={`mt-1 text-surface-600 dark:text-surface-400 break-words ${
                              task.completed ? 'text-surface-400 dark:text-surface-600' : ''
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-surface-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span>
                                Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>
                                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Task Actions */}
                      <div className="flex justify-end p-2 pt-0 pr-4 md:pr-6 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEditTask(task)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                          aria-label="Edit task"
                        >
                          <EditIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}