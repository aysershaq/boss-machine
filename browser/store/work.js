import { api } from '../apiClient';

const SET_WORK = 'SET_WORK';
const CREATE_WORK = 'CREATE_WORK';
const UPDATE_WORK = 'UPDATE_WORK';
const DELETE_WORK = 'DELETE_WORK';

// Actions
export const setWork = (allWork) => ({ type: SET_WORK, allWork });
export const addWork = (work) => ({ type: CREATE_WORK, work });
export const updateWork = (work) => ({ type: UPDATE_WORK, work });
export const deleteWork = (workId) => ({ type: DELETE_WORK, workId });

// Thunks
export const createWorkThunk = (work) => (dispatch) => {
  return api
    .post(`/minions/${work.minionId}/work`, work)
    .then((res) => res.data)
    .then((createdWork) => {
      dispatch(addWork(createdWork));
    })
    .catch(console.error.bind(console));
};

export const updateWorkThunk = (work) => (dispatch) => {
  return api
    .put(`/minions/${work.minionId}/work/${work.id}`, work)
    .then((res) => res.data)
    .then((updated) => {
      dispatch(updateWork(updated));
    })
    .catch(console.error.bind(console));
};

export const deleteWorkThunk = (work) => (dispatch) => {
  return api
    .delete(`/minions/${work.minionId}/work/${work.id}`)
    .then(() => {
      dispatch(deleteWork(work.id));
    })
    .catch(console.error.bind(console));
};

// Reducer
export const initial = [];

export default (initialState = initial, action) => {
  switch (action.type) {
    case CREATE_WORK:
      return [...initialState, action.work];
    case SET_WORK:
      return action.allWork;
    case UPDATE_WORK: {
      const index = initialState.findIndex((el) => el.id === action.work.id);
      if (index === -1) return initialState;
      return [
        ...initialState.slice(0, index),
        action.work,
        ...initialState.slice(index + 1),
      ];
    }
    case DELETE_WORK: {
      const deleteIndex = initialState.findIndex((el) => el.id === action.workId);
      if (deleteIndex === -1) return initialState;
      return [...initialState.slice(0, deleteIndex), ...initialState.slice(deleteIndex + 1)];
    }
    default:
      return initialState;
  }
};
