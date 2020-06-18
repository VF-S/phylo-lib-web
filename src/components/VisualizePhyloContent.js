import React from 'react';
import { Row, Layout } from 'antd';
import '../App.css';
const { Content } = Layout;

export default function VisualizePhyloContent() {
  const heading = 'Visualize PhyloXML';
  return (
    <Content justify="center">
      <Row className="intro" justify="center" gutter={[16, 16]}>
        <div>
          <h1>{heading}</h1>
          <p>
            <h2>A phylogenetic library written in OCaml.</h2>
          </p>
        </div>
      </Row>
    </Content>
  );
}
