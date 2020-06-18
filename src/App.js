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
    <header class="site-header">
      <button class="site-title" onClick={goHome}>
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
  const [screen, setScreen] = useState(0);

  const context = React.useMemo(
    () => ({
      goHome: () => {
        setScreen(0);
      },
      goVisualizePhylo: () => {
        setScreen(1);
      },
      goGeneratePhylo: () => {
        setScreen(2);
      },
    }),
    [],
  );

  const CurrScreen = () => {
    switch (screen) {
      case 0:
        return <HomeContent />;
      case 1:
        return <VisualizePhyloContent />;
      case 2:
        return <GeneratePhyloContent />;
      default:
        return null;
    }
  };

  return (
    <Context.Provider value={context}>
      <div>
        <Header useBack={screen !== 0} />
        <CurrScreen />
      </div>
    </Context.Provider>
  );
};

export default App;
