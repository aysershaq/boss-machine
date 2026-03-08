import React from 'react';

const Meeting = ({ day, time, note, meetingDate }) => {
  // Convert ISO string to readable format
  const formattedDate = new Date(meetingDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <tr>
      <td>{time}</td>
      <td>{day}</td>
      <td>{formattedDate}</td> {/* guaranteed to render */}
      <td>{note}</td>
    </tr>
  );
};

export default Meeting;