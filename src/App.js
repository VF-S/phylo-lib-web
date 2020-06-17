import React from 'react';
import './App.css';
import { Row, Col, Button, Layout } from 'antd';
const { h, f, s, Content } = Layout;


class Header extends React.Component {
  render() {
    return (
      <header class="site-header">
        <a class="site-title" href="index.html">Phylo</a>
      </header>
    );
  }
}
class HomeContents extends React.Component {
  render() {
    const i = "Welcome to Phylo";
    return (
      <Content justify="center">
        <Row className="intro" justify="center" gutter={[16, 16]}>
          <div>
            <h1>
              {i}
            </h1>
            <p><h2>A phylogenetic library written in OCaml.</h2></p>

          </div>

        </Row>
        <Row justify="center" gutter={[16, 40]}>
          <Col lg={6} md={8} xs={12}>
            <div class="wrap">
              <button class="offset">Work with .FASTA files</button>
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
  }
}
const App = () => (
  <div>
    <Header>
    </Header>
    <HomeContents>
    </HomeContents>
  </div>
);

export default App;