import React, { useState } from 'react';
import { Button, Radio, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs';
import * as Distance from '../ocaml_src/distance.bs';
import * as PhyloAlgo from '../ocaml_src/phylo_algo.bs';
import * as PhyloPrinter from '../ocaml_src/phylo_printer.bs';
import influenza from '../ocaml_src/Examples/Influenza.js';

import '../App.css';

const { Content } = Layout;

export default function Generate() {
  const [PhyloTree, setPhyloTree] = useState('');
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);
  const [download, setDownload] = useState(undefined);

  const updateSeq = (dna, name) => {
    setDnaArr((dnaArr) => dnaArr.concat(dna));
    setNames((names) => names.concat(name));
  };

  const parseDNA = async (file, filename) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dna = Dna.from_string(reader.result);
        updateSeq(dna, filename);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      console.log('File printing failed');
    }
  };

  const changeGenerateExamples = (e) => {
    switch (e.target.value) {
      case 'Influenza A Viruses':
        setPhyloVisible(true);
        setPhyloTree(influenza);
    }
  };

  const generateTree = () => {
    const dist_matrix = Distance.dist_dna(dnaArr, 1, -1, -1);
    const tree = PhyloAlgo.upgma(dist_matrix, names);
    const output = Tree.to_string(tree);
    console.log(output);
    setPhyloTree(output);
    setPhyloVisible(true);
  };

  const downloadTree = () => {
    if (dnaArr.length < 1) {
      alert('At least one FASTA file must be uploaded for tree generation.');
      return;
    }
    const dist_matrix = Distance.dist_dna(dnaArr, 1, -1, -1);
    const tree = PhyloAlgo.upgma(dist_matrix, names);
    const treeXML = PhyloPrinter.xml_of_tree(tree);
    const element = (
      <a
        href={'data:text/xml;charset=utf-8,' + encodeURIComponent(treeXML)}
        download="tree.xml"
      >
        Click to Download
      </a>
    );
    setDownload(element);
  };

  const fastaUploadProps = {
    accept: '.FASTA, .txt, .fasta',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    transformFile(file) {
      const file_name = file.name
        .split('.')
        .slice(0, -1)
        .join('.')
        .toUpperCase();
      parseDNA(file, file_name);
    },
  };

  return (
    <div className="wrapper">
      <Content justify="center">
        <Row className="page" justify="center">
          <div>
            <h1>Generate a Phylogenetic Tree</h1>
            <h2>
              By computing similarity scores for DNA samples of species, we can
              infer their species' evolutionary history through time. Begin by
              uploading .FASTA files that contain DNA sequences, or use our
              example DNA sequences.
            </h2>
          </div>
        </Row>
        <Row className="horizontally-centered">
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button onClick={generateTree}>Generate tree</Button>
          <div>
            <Button onClick={downloadTree}>Save tree as phyloXML</Button>
            {download !== undefined ? (
              <Row className="centered-content">{download}</Row>
            ) : null}
          </div>
        </Row>
      </Content>
      <Row className="centered-content">
        <p className="phylo-example-text"> See our examples: </p>
      </Row>
      <Row className="centered-content">
        <Radio.Group onChange={changeGenerateExamples}>
          <Radio.Button value="Coronaviruses">Coronaviruses</Radio.Button>
          <Radio.Button value="Influenza A Viruses">
            Influenza A Viruses
          </Radio.Button>
          <Radio.Button value="Example 1">Apaf-1 Gene Family Tree</Radio.Button>
          <Radio.Button value="Example 2">Alcohol Dehydrogenases</Radio.Button>
        </Radio.Group>
      </Row>
      {phyloVisible ? (
        <Row justify="center">
          <div className="ascii-phylo-container">
            <p className="ascii-phylo">{PhyloTree}</p>
          </div>
        </Row>
      ) : null}
    </div>
  );
}
