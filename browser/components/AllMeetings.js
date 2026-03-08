import React, { Component } from 'react';
import { connect } from 'react-redux';
import Meeting from './Meeting';
import CreateMeetingForm from './components/CreateMeetingForm';

class AllMeetings extends Component {

  render() {

    const allMeetings = this.props.meetings.map(meeting => (
      <Meeting
        key={meeting.id}
        day={meeting.day}
        time={meeting.time}
        note={meeting.note}
        meetingDate={meeting.date}
      />
    ));

    return (
      <div id="meetings-landing">

        <div className="label meetings-label">
          Meetings
        </div>

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


        <CreateMeetingForm />
      </div>
    );
  }
}

const mapState = ({ meetings }) => ({
  meetings
});

export default connect(mapState)(AllMeetings);