import React from 'react';
import { Row, Col, Layout } from 'antd';
import '../App.css';
import Context from './Context';
const { Content } = Layout;

export default function HomeContents() {
  const i = 'Welcome to PhyloCaml';
  const { goVisualizePhylo, goGeneratePhylo } = React.useContext(Context);
  return (
    <div class="wrapper main">
      <Content justify="center">
        <Row className="intro" justify="center" gutter={[16, 16]}>
          <div>
            <h1>{i}</h1>
            <h2>A phylogenetic library written in OCaml.</h2>
            <h2>
              Inferring Evolutionary History through modern genetic similarity.
          </h2>
          </div>
        </Row>
        <Row justify="center" gutter={[16, 40]}>
          <Col lg={7} md={10} sm={12}>
            <div className="wrap">
              <button className="offset" onClick={goGeneratePhylo}>
                Work with .FASTA files
            </button>
            </div>
          </Col>
          <Col lg={7} md={10} sm={12}>
            <div className="wrap">
              <button className="offset" onClick={goVisualizePhylo}>
                Work with PhyloXML files
            </button>
            </div>
          </Col>
        </Row>
      </Content>
    </div>
  );
}
