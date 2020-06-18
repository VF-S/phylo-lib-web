import React from 'react';
import { Row, Layout } from 'antd';
import '../App.css';
const { Content } = Layout;

export default function GeneratePhyloContent() {
  return (
    <Content justify="center">
      <Row className="intro" justify="center" gutter={[16, 16]}>
        <div>
          <h1>Generate a Phylogenetic Tree</h1>
          <p>
            <h2>A phylogenetic library written in OCaml.</h2>
          </p>
        </div>
      </Row>
    </Content>
  );
}
