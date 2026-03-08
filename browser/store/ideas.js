import { api } from '../apiClient';
import { setSelectedIdea } from './selectedIdea';

const SET_IDEAS = 'SET_IDEAS';
const CREATE_IDEA = 'CREATE_IDEA';
const UPDATE_IDEA = 'UPDATE_IDEA';

// actions
export const setIdeas = (ideas) => ({ type: SET_IDEAS, ideas });
export const createIdea = (idea) => ({ type: CREATE_IDEA, idea });
export const updateIdea = (idea) => ({ type: UPDATE_IDEA, idea });

// Thunks
export const createIdeaThunk = (idea) => (dispatch) => {
  return api
    .post('/ideas', idea)
    .then((res) => res.data)
    .then((createdIdea) => {
      dispatch(createIdea(createdIdea));
    })
    .catch(console.error.bind(console));
};

export const updateIdeaThunk = (idea) => (dispatch) => {
  return api
    .put(`/ideas/${idea.id}`, idea)
    .then((res) => res.data)
    .then((updatedIdea) => {
      dispatch(updateIdea(updatedIdea));
      dispatch(setSelectedIdea(updatedIdea));
    })
    .catch(console.error.bind(console));
};

// Reducer
const initial = [];

export default (initialState = initial, action) => {
  switch (action.type) {
    case CREATE_IDEA:
      return [...initialState, action.idea];
    case SET_IDEAS:
      return action.ideas;
    case UPDATE_IDEA: {
      const index = initialState.findIndex((el) => el.id === action.idea.id);
      if (index === -1) return initialState;
      return [
        ...initialState.slice(0, index),
        action.idea,
        ...initialState.slice(index + 1),
      ];
    }
    default:
      return initialState;
  }
};
