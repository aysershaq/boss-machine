import { api } from '../apiClient';

const CREATE_MEETING = 'CREATE_MEETING';
const CANCEL_MEETINGS = 'CANCEL_MEETINGS';
const SET_MEETINGS = 'SET_MEETINGS';

// Action creators
export const setMeetings = (meetings) => ({ type: SET_MEETINGS, meetings });
export const createMeeting = (meeting) => ({ type: CREATE_MEETING, meeting });
export const cancelMeetings = () => ({ type: CANCEL_MEETINGS });

// Thunks
export const createMeetingThunk = (meetingData) => {
  return async (dispatch) => {
    try {
      console.log("Sending meeting data:", meetingData);
      const res = await api.post('/meetings', meetingData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Created meeting:", res.data);
      dispatch(createMeeting(res.data));
    } catch (err) {
      console.error("Error creating meeting:", err.response?.data || err.message);
    }
  };
};

export const cancelMeetingsThunk = () => {
  return async (dispatch) => {
    try {
      await api.delete('/meetings');
      dispatch(cancelMeetings());
    } catch (err) {
      console.error('Error cancelling meetings:', err.response?.data || err.message);
    }
  };
};

// Initial state
const initial = [];

// Reducer
const meetingsReducer = (state = initial, action) => {
  switch (action.type) {

    case SET_MEETINGS:
      return action.meetings;

    case CREATE_MEETING:
      return [...state, action.meeting]; // <-- add new meeting to state

    case CANCEL_MEETINGS:
      return []; // <-- clear all meetings

    default:
      return state;
  }
};

export default meetingsReducer;