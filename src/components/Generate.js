import React, { useState } from 'react';
import { Button, Radio, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs'
import * as Distance from "../ocaml_src/distance.bs"
import * as PhyloAlgo from "../ocaml_src/phylo_algo.bs"

import '../App.css';
const { Content } = Layout;

const dnaArr = [];
const names = [];


const parseDNA = async (file, filename) => {
  try {
    const reader = new FileReader();
    reader.onload = () => {
      const dna = Dna.from_string(reader.result);
      dnaArr.push(dna);
      names.push(filename)
    };
    reader.readAsText(file);
  } catch (e) {
    console.log(e);
    console.log('File printing failed');
  }
};

const getFile = (filename) => {
  return process.env.PUBLIC_URL + '/examples/FASTA/' + filename + '.fasta';
}


const changeGenerateExamples = (e) => {

  switch (e.target.value) {

    case "Influenza A Viruses":
      break;

    case "Coronaviruses":
      break;

    case "Example 1":
      break;

    case "Example 2":
      break;
  }

  // const filePath =
  //   process.env.PUBLIC_URL + '/examples/FASTA/' + e.target.value + '.fasta';
  // setCurrPhylo(e.target.value);
  // fetch(filePath)
  //   .then((response) => response.blob())
  //   .then((blob) => displayPhyloFile(blob));

}


export default function Generate() {

  const [currPhylo, setCurrPhylo] = useState([]);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [PhyloTree, setPhyloTree] = useState('');
  const [phyloVisible, setPhyloVisible] = useState(false);

  const generateTree = () => {
    setUploadDisabled(true);

    const dist_matrix = Distance.dist_dna(dnaArr, 1, (-1), (-1));
    const virus_names = names;
    const tree = PhyloAlgo.upgma(dist_matrix, virus_names);
    console.log(Tree.to_string(tree));
    setPhyloTree(Tree.to_string(tree));
    setPhyloVisible(true);
  }

  const fastaUploadProps = {
    accept: '.FASTA, .txt, .fasta',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    disabled: uploadDisabled,
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    transformFile(file) {
      var file_name = file.name.split('.').slice(0, -1).join('.').toUpperCase()
      parseDNA(file, file_name)
    }
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
        <Row className="centered-content" >
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          < Button onClick={() => generateTree()}> Generate tree </Button>
        </Row>
      </Content>
      <Row className="centered-content">
        <p className="phylo-example-text"> See our examples: </p>
      </Row>
      <Row className="centered-content">
        <Radio.Group
          onChange={changeGenerateExamples}
          defaultValue="phyloXML examples"
        >
          <Radio.Button value="Coronaviruses">Coronaviruses</Radio.Button>
          <Radio.Button value="Influenza A Viruses">Influenza A Viruses</Radio.Button>
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
