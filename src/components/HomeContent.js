import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Divider, Layout, Radio } from 'antd';
import '../App.css';
import influenza from '../ocaml_src/Examples/Influenza.js';
import cytochrome_c from '../ocaml_src/Examples/cytochrome_c.js';
import capsid from '../ocaml_src/Examples/Capsid.js';
const { Content } = Layout;

export default function HomeContents() {
  const [PhyloTree, setPhyloTree] = useState(cytochrome_c);
  const [phyloVisible, setPhyloVisible] = useState(true);

  const changeGenerateExamples = (e) => {
    switch (e.target.value) {
      case 'Influenza A Viruses':
        setPhyloTree(influenza);
        break;
      case 'COXII':
        setPhyloTree(cytochrome_c);
        break;
      case 'Virus Capsid':
        setPhyloVisible(true);
        console.log(capsid);
        setPhyloTree(capsid);
        break;
    }
  };

  console.log(process.env.PUBLIC_URL);
  return (
    <div className="wrapper main">
      <Content justify="center">
        <Row className="intro" justify="center">
          <div>
            <h1>Welcome to PhyloML</h1>
            <h2>A phylogenetic library written in OCaml.</h2>
            <h2>
              Inferring Evolutionary History through Modern Genetic Similarity.
            </h2>
          </div>
        </Row>
        <Row justify="center" gutter={[16, 40]}>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/pairwise">
              Visualize Pairwise DNA Alignments
            </Link>
          </Col>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/visualize">
              Visualize Phylogenetic Trees
            </Link>
          </Col>
          <Col lg={7} md={10} sm={12}>
            <Link className="offset" to="/generate">
              Generate Phylogenetic Trees
            </Link>
          </Col>
        </Row>
        <Row justify="center">
          <Divider />
          <h1> Explanations and Examples: </h1>
        </Row>
        <Row>
          <h2> About Phylogenetic Trees: </h2>
          <h3>
            {' '}
            Scientists often wish to infer the evolutionary history between
            different organisms. In order to determine the closeness of species
            such as birds or fish, historically the similarity in physical
            characteristics was analyzed. With the advent of modern computers
            and DNA analysis, the field has moved towards using DNA. Two species
            with more similar DNA are assumed to be more closely related. By
            analyzing these similarities and differences in the DNA, we can
            generate a hypothetical evolutionary tree, called a phylogenetic
            tree, that estimates what the historical evolutionary tree would
            have looked like.
          </h3>

          <h2> Functionality: </h2>

          <h3>
            <b> Visualize Pairwise Alignment: </b>
            At the heart of constructing phylogenetic trees is the pairwise
            alignment, where two DNA sequences are compared. Only once the
            alignment scores of all DNA sequences with one another is known is
            it possible to determine genetic similarity and through that,
            evolutionary history. The pairwise Alignment is performed using the
            Needleman-Wunsch algorithm, a globally optimal dynamic programming
            algorithm that computes a loss for the most optimal alignment. Here
            * represents a DNA base pair match, _ a gap, often used if a DNA
            sequence is longer than the other, and | a mismatch.
          </h3>
          <h3>
            <b> Visualize Phylogenetic Trees: </b>
            When a phylogenetic tree has already been constructed, whether
            through this program or other commercially available software, it is
            important that the user can visualize the final alignment. Here we
            built a tokenizer, lexer, and parser to read PhyloXML, an extension
            of the popular XML format designed to encode phylogenetic trees.
          </h3>
          <h3>
            <b> Generate Phylogenetic Trees: </b>
            We construct phylogenetic genetic trees from DNA sequences encoded
            in a standard .FASTA format using two algorithms: Unweighted Pair
            Group Method with Arithmetic Mean (UPGMA) and Bayesian Inference,
            each with their respective tradeoffs regarding speed and accuracy.
            Each algorithm reads in the .FASTA files, constructs pairwise
            alignments, and then uses respective techniques to find an optimal
            rooted tree.
          </h3>
        </Row>

        <h2> Examples: </h2>

        <h3>
          Examples of constructed phylogenetic trees using DNA sequences from
          the National Center for Biotechnology Information (NCBI).
        </h3>
        <Row className="centered-content">
          <Radio.Group onChange={changeGenerateExamples}>
            <Radio.Button value="Virus Capsid">Virus Capsid Gene</Radio.Button>
            <Radio.Button value="COXII">
              Cytochrome C Oxidase Subunit II
            </Radio.Button>
            <Radio.Button value="Influenza A Viruses">
              Influenza A PB-2
            </Radio.Button>
          </Radio.Group>
        </Row>
        {phyloVisible ? (
          <Row justify="center">
            <div className="ascii-phylo-container">
              <p className="ascii-phylo">{PhyloTree}</p>
            </div>
          </Row>
        ) : null}
      </Content>
    </div>
  );
}
