import React, { useState } from 'react';
import './App.css';
import { Row, Col, Button, Layout } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
const { h, f, s, Content } = Layout;

const Header = ({ useBack }) => {
  return (
    <header class="site-header">
      <a class="site-title" href="index.html">
        {useBack ? (
          <ArrowLeftOutlined style={{ paddingRight: '10px' }} />
        ) : null}
        Phylo
      </a>
    </header>
  );
};

const PhyloXML = () => (
  <div>
    <Header useBack={true} />
  </div>
);

const HomeContents = () => {
  const i = 'Welcome to Phylo';

  const [changeScreen, setChangeScreen] = useState(false);
  const screen = changeScreen ? (
    <PhyloXML />
  ) : (
    <Content justify="center">
      <Row className="intro" justify="center" gutter={[16, 16]}>
        <div>
          <h1>{i}</h1>
          <p>
            <h2>A phylogenetic library written in OCaml.</h2>
          </p>
        </div>
      </Row>
      <Row justify="center" gutter={[16, 40]}>
        <Col lg={6} md={8} xs={12}>
          <div class="wrap">
            <button class="offset" onClick={() => setChangeScreen(true)}>
              Work with .FASTA files
            </button>
          </div>
        </Col>
        <Col lg={6} md={8} xs={12}>
          <div class="wrap">
            <button class="offset">Work with PhyloXML files</button>
          </div>
        </Col>
      </Row>
    </Content>
  );
  return screen;
};

const App = () => (
  <div>
    <Header useBack={false} />
    <HomeContents />
  </div>
);

export default App;
