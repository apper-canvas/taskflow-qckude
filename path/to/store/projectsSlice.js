import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: localStorage.getItem('projects') 
    ? JSON.parse(localStorage.getItem('projects')) 
    : [
        {
          id: '1',
          name: 'Personal',
          description: 'My personal tasks and activities',
          color: '#4f46e5', // indigo
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Work',
          description: 'Professional projects and tasks',
          color: '#2563eb', // blue
          createdAt: new Date().toISOString()
        }
      ]
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
      localStorage.setItem('projects', JSON.stringify(state.projects));
    }
  }
});

// Export actions
export const { addProject, updateProject, deleteProject, setProjects } = projectsSlice.actions;

// Export selectors
export const selectAllProjects = (state) => state.projects.projects;
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.id === projectId);

// Export reducer
export default projectsSlice.reducer;