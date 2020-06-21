import React, { useState } from 'react';
import './App.css';
import { Popover } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Context from './components/Context';
import HomeContent from './components/HomeContent';
import GeneratePhyloContent from './components/GeneratePhyloContent';
import VisualizePhyloContent from './components/VisualizePhyloContent';

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
        Phylo
      </button>
      <Popover content={content} className="tooltip" title="Title" trigger="click">
        <a class="tooltip"> <InfoCircleOutlined style={{ paddingRight: '0.5em' }} />Confused by all the terms?</a>
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
        return <VisualizePhyloContent />;
      case 'GENERATE_PHYLO':
        return <GeneratePhyloContent />;
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
