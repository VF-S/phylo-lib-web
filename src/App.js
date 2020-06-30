import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import HomeContent from './components/HomeContent';
import Generate from './components/Generate';
import Visualize from './components/Visualize';
import DisplayPairwise from './components/DisplayPairwise';

const Header = () => {
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <header className="site-header">
      <Link className="site-title" to="/">
        PhyloML
      </Link>
      <Popover
        content={content}
        className="tooltip"
        title="Title"
        trigger="click"
      >
        <a className="tooltip">
          {' '}
          <InfoCircleOutlined style={{ paddingRight: '0.5em' }} />
          Confused by all the terms?
        </a>
      </Popover>
    </header>
  );
};

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/generate">
            <Generate />
          </Route>
          <Route path="/visualize">
            <Visualize />
          </Route>
          <Route path="/pairwise">
            <DisplayPairwise />
          </Route>
          <Route path="/">
            <HomeContent />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
