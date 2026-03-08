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
  return (dispatch) => {
     console.log("Sending meeting data:", meetingData); // <-- 
   return api.post('/meetings', meetingData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => {
      dispatch({ type: 'CREATE_MEETING', meeting: res.data });
    })
    .catch(err => {
      console.error("Error creating meeting:", err);
    });
  };
};

export const cancelMeetingsThunk = () => (dispatch) => {
  return api
    .delete('/meetings')
    .then(() => {
      dispatch(cancelMeetings());
    })
    .catch((err) => console.error('Error cancelling meetings:', err.response?.data || err.message));
};

// Initial state
const initial = [];

// Reducer
export default function meetingReducer(state = initial, action) {
  switch (action.type) {
    case CREATE_MEETING: {
      const newMeetings = [action.meeting, ...state];
      newMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return newMeetings;
    }
    case CANCEL_MEETINGS:
      return [];
    case SET_MEETINGS:
      return action.meetings;
    default:
      return state;
  }
}