import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';

import { formatCash } from '../utils';
import IdeaListItem from './IdeaListItem';

const AllIdeas = ({ ideas }) => {

  const deleteIdea = (id) => {
    axios.delete(`/api/ideas/${id}`)
      .then(() => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const total = formatCash(
    ideas.reduce(
      (accum, curr) => curr.weeklyRevenue * curr.numWeeks + accum,
      0
    )
  );

  const allIdeas = ideas.map(idea => (
    <tr key={idea.id}>
      <td>{idea.name}</td>
      <td>{formatCash(idea.weeklyRevenue * idea.numWeeks)}</td>
      <td>
        <button onClick={() => deleteIdea(idea.id)}>
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div>
      <div id="ideas-landing">

        <div className="label meetings-label">
          Ideas
        </div>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Income</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {allIdeas}

            <tr>
              <td></td>

              <td id="add-idea-td">
                <Link to="/ideas/new">
                  <img
                    id="add-idea"
                    className="button"
                    src="public/img/add_button.svg"
                    alt="add idea"
                  />
                </Link>
              </td>

              <td></td>

            </tr>

          </tbody>

        </table>

        <div id="total-money">
          <p>Total Money: {total}</p>
        </div>

      </div>

      <div className="button back-button">
        <Link to="/">
          <img
            className="button"
            src="public/img/arrow.svg"
            alt="back"
          />
        </Link>
      </div>

    </div>
  );
};

const mapState = ({ ideas }) => ({
  ideas
});

export default connect(mapState)(AllIdeas);