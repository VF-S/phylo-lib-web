import React from 'react';
import { Row, Col, Layout } from 'antd';
import '../App.css';
import Context from './Context';
const { Content } = Layout;

export default function HomeContents() {
  const i = 'Welcome to Phylo';
  const { goVisualizePhylo, goGeneratePhylo } = React.useContext(Context);
  return (
    <Content justify="center">
      <Row className="intro" justify="center" gutter={[16, 16]}>
        <div>
          <h1>{i}</h1>
          <h2>A phylogenetic library written in OCaml.</h2>
        </div>
      </Row>
      <Row justify="center" gutter={[16, 40]}>
        <Col lg={6} md={8} xs={12}>
          <div className="wrap">
            <button className="offset" onClick={goGeneratePhylo}>
              Work with .FASTA files
            </button>
          </div>
        </Col>
        <Col lg={6} md={8} xs={12}>
          <div className="wrap">
            <button className="offset" onClick={goVisualizePhylo}>
              Work with PhyloXML files
            </button>
          </div>
        </Col>
      </Row>
    </Content>
  );
}
