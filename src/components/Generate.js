import React, { useState } from 'react';
import { Button, Radio, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs';
import * as Distance from '../ocaml_src/distance.bs';
import * as PhyloAlgo from "../ocaml_src/phylo_algo.bs";
import h1n1 from '../ocaml_src/FASTA/h1n1.js'
import h3n2 from '../ocaml_src/FASTA/h3n2.js'
import h5n1 from '../ocaml_src/FASTA/h5n1.js'


import '../App.css';

const { Content } = Layout;

export default function Generate() {

  const [PhyloTree, setPhyloTree] = useState('');
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);

  const updateSeq = (dna, name) => {

    setDnaArr(dnaArr => dnaArr.concat(dna));
    setNames(names => names.concat(name));
  }

  const cleanSeq = () => {

    setDnaArr([])
    setNames([])

  }

  const parseDNA = async (file, filename) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dna = Dna.from_string(reader.result);
        setDnaArr(dnaArr => dnaArr.concat(dna));
        console.log(dnaArr);
        setNames(names => names.concat(filename));
        console.log(names);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      console.log('File printing failed');
    }
  };

  const changeGenerateExamples = (e) => {


    switch (e.target.value) {

      case "Influenza A Viruses":

        console.log("Running influenza code")
        cleanSeq()
        updateSeq(h1n1, "H1N1")
        updateSeq(h3n2, "H3N2")
        updateSeq(h5n1, "H5N1")

        console.log(dnaArr.length)

        generateTree();

      case "Coronaviruses":
        break;

      case "Example 1":
        break;

      case "Example 2":
        break;
    }
  };

  const generateTree = () => {

    const dist_matrix = Distance.dist_dna(dnaArr, 1, -1, -1);
    const tree = PhyloAlgo.upgma(dist_matrix, names);
    console.log(Tree.to_string(tree));
    setPhyloTree(Tree.to_string(tree));
    setPhyloVisible(true);
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
        <Row className="centered-content">
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button onClick={generateTree}> Generate tree </Button>
        </Row>
      </Content>
      <Row className="centered-content">
        <p className="phylo-example-text"> See our examples: </p>
      </Row>
      <Row className="centered-content">
        <Radio.Group
          onChange={changeGenerateExamples}

        >
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
