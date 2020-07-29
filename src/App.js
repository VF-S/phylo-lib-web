import React from 'react';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { Popover } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import HomeContent from './components/HomeContent';
import Generate from './components/Generate';
import Visualize from './components/Visualize';
import DisplayPairwise from './components/DisplayPairwise';

const Header = ({ useBack }) => {
  const content = (
    <div>
      <p>
        A{' '}
        <a href="https://en.wikipedia.org/wiki/Phylogenetic_tree">
          phylogenetic tree
        </a>{' '}
        is a tree that shows the evolutionary relationships between species. The
        structure of these trees can be stored in{' '}
        <a href="http://www.phyloxml.org/">XML</a> files. To see visualizations
        of such trees, you can click Visualize Phylogenetic Trees.
      </p>
      <p>
        {' '}
        We can also try to predict the structure of phylogenetic trees by
        looking at the similarities in the DNAs of different species. To know
        more, you can click Generate Phylogenetic Trees.
      </p>
    </div>
  );
  return (
    <header className="site-header">
      <Link className="site-title" to="/">
        {useBack ? (
          <ArrowLeftOutlined
            style={{ alignSelf: 'center', paddingRight: '10px' }}
          />
        ) : null}
        PhyloML
      </Link>
      <Popover
        className="clickable"
        content={content}
        className="tooltip"
        trigger="click"
      >
        <a className="tooltip">
          <InfoCircleOutlined style={{ paddingRight: '0.5em' }} />
          Confused by all the terms?
        </a>
      </Popover>
    </header>
  );
};

const Page = ({ useBack, body }) => {
  return (
    <div>
      <Header useBack={useBack} />
      {body}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route
            path="/generate"
            component={() => <Page useBack={true} body={<Generate />} />}
          />
          <Route
            path="/visualize"
            component={() => <Page useBack={true} body={<Visualize />} />}
          />
          <Route
            path="/pairwise"
            component={() => <Page useBack={true} body={<DisplayPairwise />} />}
          />
          <Route
            path="/"
            component={() => <Page useBack={false} body={<HomeContent />} />}
          />
        </Switch>
      </div>
    </Router>
  );
}
