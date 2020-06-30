import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Layout } from 'antd';
import '../App.css';
const { Content } = Layout;

export default function HomeContents() {
  return (
    <div className="wrapper main">
      <Content justify="center">
        <Row className="intro" justify="center" gutter={[16, 16]}>
          <div>
            <h1>Welcome to PhyloML</h1>
            <h2>A phylogenetic library written in OCaml.</h2>
            <h2>
              Inferring Evolutionary History through modern genetic similarity.
            </h2>
          </div>
        </Row>
        <Row justify="center" gutter={[16, 40]}>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/generate">
              Generate Phylogenetic Trees
            </Link>
          </Col>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/visualize">
              Visualize Phylogenetic Trees
            </Link>
          </Col>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/pairwise">
              Visualize Pairwise DNA Alignments
            </Link>
          </Col>
        </Row>
      </Content>
    </div>
  );
}
