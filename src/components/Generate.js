import React, { useState } from 'react';
import { Button, Radio, Row, Layout, Popover, Switch, Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs';
import * as Distance from '../ocaml_src/distance.bs';
import * as PhyloAlgo from '../ocaml_src/phylo_algo.bs';
import * as PhyloPrinter from '../ocaml_src/phylo_printer.bs';
import influenza from '../ocaml_src/Examples/Influenza.js';
import h1n1 from '../ocaml_src/Examples/h1n1.js';
import h3n2 from '../ocaml_src/Examples/h3n2.js';
import h5n1 from '../ocaml_src/Examples/h5n1.js';
import '../App.css';

const { Content } = Layout;

export default function Generate() {
  const [PhyloTree, setPhyloTree] = useState('');
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);
  const [download, setDownload] = useState(undefined);
  const [uploaded, setUploaded] = useState(false);
  const defaultFileList = [
    {
      uid: '1',
      name: 'h1n1.fasta',
      status: 'done',
      url: process.env.PUBLIC_URL + '/examples/FASTA/h1n1.fasta',
    },
    {
      uid: '2',
      name: 'h3n2.fasta',
      status: 'done',
      url: process.env.PUBLIC_URL + '/examples/FASTA/h3n2.fasta',
    },
    {
      uid: '3',
      name: 'h5n1.fasta',
      status: 'done',
      url: process.env.PUBLIC_URL + '/examples/FASTA/h5n1.fasta',
    },
  ];

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

  const generateExamples = () => {
    const dnaSeq = [h1n1, h3n2, h5n1];
    const dnaNames = ['H1N1', 'H3N2', 'H5N1'];
    generateTree(dnaSeq, dnaNames);
  };

  const generateTree = (dnas, dnaNames) => {
    const dist_matrix = Distance.dist_dna(dnas, 1, -1, -1);
    const tree = PhyloAlgo.upgma(dist_matrix, dnaNames);
    const output = Tree.to_string(tree);
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
    defaultFileList: defaultFileList,
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    transformFile(file) {
      setUploaded(true);
      while (defaultFileList.length > 0) {
        defaultFileList.pop();
      }
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
          <Switch
            checkedChildren="Clustal"
            unCheckedChildren="UPGMA"
            className="generate-toggle"
            defaultChecked
          />
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button
            onClick={() => {
              !uploaded ? generateExamples() : generateTree(dnaArr, names);
            }}
          >
            Generate tree
          </Button>
          <Popover
            content={<p>Information on Clustal and UPGMA</p>}
            title="Info"
            trigger="click"
          >
            <div className="generate-info">
              <InfoCircleOutlined />
            </div>
          </Popover>
        </Row>
        <Row className="centered-content">
          <div>
            <Button onClick={downloadTree}>Save tree as phyloXML</Button>
            {download !== undefined ? (
              <Row className="centered-content">{download}</Row>
            ) : null}
          </div>
        </Row>
      </Content>
      <Row className="centered-content">
        <p className="example-text"> See our examples: </p>
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
