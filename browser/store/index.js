import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import meetings from './meetings';
import { api } from './apiClient';
import store from './store/index';

import { setMinions } from './store/minions';
import { setSelectedMinion } from './store/selectedMinion';
import { setIdeas } from './store/ideas';
import { setSelectedIdea } from './store/selectedIdea';
import { setWork } from './store/work';
import { setMeetings } from './store/meetings';
import { setIdeaEditing, setMinionEditing, resetEditingState } from './store/appState';

import App from './components/App';
import AllMinions from './components/AllMinions';
import Home from './components/Home';
import AllIdeas from './components/AllIdeas';
import Idea from './components/Idea';
import Minion from './components/Minion';

const appEnter = () => {
  return Promise.all([
    api.get('/minions'),
    api.get('/ideas'),
    api.get('/meetings'),
  ])
    .then(([minionsRes, ideasRes, meetingsRes]) => {
      store.dispatch(setMinions(minionsRes.data));
      store.dispatch(setIdeas(ideasRes.data));
      store.dispatch(setMeetings(meetingsRes.data));
    })
    .catch(console.error.bind(console));
};

const singleMinionEnter = (nextRouterState) => {
  store.dispatch(resetEditingState());
  const id = nextRouterState.params.id;

  api.get(`/minions/${id}`)
    .then((res) => res.data)
    .then((minion) => store.dispatch(setSelectedMinion(minion)))
    .catch(console.error.bind(console));

  api.get(`/minions/${id}/work`)
    .then((res) => res.data)
    .then((work) => store.dispatch(setWork(work)))
    .catch(console.error.bind(console));
};

const singleIdeaEnter = (nextRouterState) => {
  const id = nextRouterState.params.id;

  api.get(`/ideas/${id}`)
    .then((res) => res.data)
    .then((idea) => store.dispatch(setSelectedIdea(idea)))
    .catch(console.error.bind(console));
};

const newIdeaEnter = () => {
  store.dispatch(setIdeaEditing());
  store.dispatch(
    setSelectedIdea({
      name: 'New Idea',
      description: '',
      weeklyRevenue: 0,
      numWeeks: 0,
    })
  );
};

const newMinionEnter = () => {
  store.dispatch(setWork([]));
  store.dispatch(setMinionEditing());
  store.dispatch(
    setSelectedMinion({
      name: '',
      title: '',
      weaknesses: '',
      salary: 0,
    })
  );
};

const allIdeasEnter = () => {
  store.dispatch(resetEditingState());
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App} onEnter={appEnter}>
        <IndexRoute component={Home} />
        <Route path="/minions" component={AllMinions} />
        <Route path="/minions/new" onEnter={newMinionEnter} component={Minion} />
        <Route path="/minions/:id" onEnter={singleMinionEnter} component={Minion} />
        <Route path="/ideas" onEnter={allIdeasEnter} component={AllIdeas} />
        <Route path="/ideas/new" onEnter={newIdeaEnter} component={Idea} />
        <Route path="/ideas/:id" onEnter={singleIdeaEnter} component={Idea} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
