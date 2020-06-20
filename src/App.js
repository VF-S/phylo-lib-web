import React, { useState } from 'react';
import './App.css';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Context from './components/Context';
import HomeContent from './components/HomeContent';
import GeneratePhyloContent from './components/GeneratePhyloContent';
import VisualizePhyloContent from './components/VisualizePhyloContent';

const Header = ({ useBack }) => {
  const { goHome } = React.useContext(Context);
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
      <div>
        <Header useBack={screen !== 'HOME'} />
        <CurrScreen />
      </div>
    </Context.Provider>
  );
};

export default App;
