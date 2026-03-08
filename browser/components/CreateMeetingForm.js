// src/components/CreateMeetingForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeetingThunk } from '../store/meeting';

const CreateMeetingForm = () => {
  const dispatch = useDispatch();

  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare meeting data
    const meetingData = { day, time, note };

    // Call the thunk
    dispatch(createMeetingThunk(meetingData));

    // Optionally reset form
    setDay('');
    setTime('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '8px' }}>
      <label>
        Day:
        <input type="text" value={day} onChange={(e) => setDay(e.target.value)} required />
      </label>
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <label>
        Note:
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <button type="submit">Create Meeting</button>
    </form>
  );
};

export default CreateMeetingForm;