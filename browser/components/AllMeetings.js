import React, { Component } from 'react';
import { connect } from 'react-redux';
import Meeting from './Meeting';

class AllMeetings extends Component {
  render() {

    console.log(this.props.meetings)
    const allMeetings = this.props.meetings.map(meeting => (
      <Meeting
        key={meeting.id}
        day={meeting.day}
        time={meeting.time}
        note={meeting.note}
        meetingDate={meeting.date} // pass as meetingDate
      />
    ));

    return (
      <div id="meetings-landing">
        <div className="label meetings-label">Meetings</div>
        <div id="meetings-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Day</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {allMeetings}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapState = ({ meetings }) => ({ meetings });

export default connect(mapState)(AllMeetings);