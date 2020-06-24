import React, { useState } from 'react';
import './App.css';
import { Popover } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Context from './components/Context';
import HomeContent from './components/HomeContent';
import Generate from './components/Generate';
import Visualize from './components/Visualize';

const Header = ({ useBack }) => {
  const { goHome } = React.useContext(Context);
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <header className="site-header">
      <button className="site-title" onClick={goHome}>
        {useBack ? (
          <ArrowLeftOutlined
            style={{ alignSelf: 'center', paddingRight: '10px' }}
          />
        ) : null}
        PhyloML
      </button>
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

const App = () => {
  const [screen, setScreen] = useState('HOME');

  const context = React.useMemo(
    () => ({
      goHome: () => {
        setScreen('HOME');
      },
      goVisualizePhylo: () => {
        setScreen('VISUALIZE_PHYLO');
      },
      goGeneratePhylo: () => {
        setScreen('GENERATE_PHYLO');
      },
    }),
    [],
  );

  const CurrScreen = () => {
    switch (screen) {
      case 'HOME':
        return <HomeContent />;
      case 'VISUALIZE_PHYLO':
        return <Visualize />;
      case 'GENERATE_PHYLO':
        return <Generate />;
      default:
        return null;
    }
  };

  return (
    <Context.Provider value={context}>
      <Header useBack={screen !== 'HOME'} />
      <CurrScreen />
    </Context.Provider>
  );
};

export default App;
