import React from 'react';
import { Button, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs'
import * as Pairwise from '../ocaml_src/pairwise.bs';
import * as Msa from "../ocaml_src/msa.bs"
import * as Distance from "../ocaml_src/distance.bs"
import * as PhyloAlgo from "../ocaml_src/phylo_algo.bs"

import '../App.css';
const { Content } = Layout;

const dnaArr = [];
const placeholder = ["1", "2", "3"];

const parseDNA = async (file) => {
  try {
    const reader = new FileReader();
    reader.onload = () => {
      const dna = Dna.from_string(reader.result);
      dnaArr.push(dna);
      console.log(Dna.to_string(Dna.from_string(reader.result)));
    };
    reader.readAsText(file);
  } catch (e) {
    console.log(e);
    console.log('File printing failed');
  }
};

const pairwiseAlign = () => {
  if (dnaArr.length < 2) {
    alert("Not enough DNA sequences to perform pairwise alignment")
  }
  else {
    const pair = Pairwise.align_pair(dnaArr[0], dnaArr[1], 1, -1, -1);
    Pairwise.print_alignment(dnaArr[0], dnaArr[1]);

  }
}

const generateTree = () => {

  const dist_matrix = Distance.dist_dna(dnaArr, 1, (-1), (-1));
  const virus_names = placeholder;
  const tree = PhyloAlgo.upgma(dist_matrix, virus_names);
  console.log(Tree.to_string(tree));

}

const fastaUploadProps = {
  accept: '.FASTA, .txt, .fasta',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  multiple: true,
  transformFile(file) {
    parseDNA(file);
  },
};

export default function GeneratePhyloContent() {
  return (
    <div class="wrapper">
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
        <Row className="upload">
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button onClick={() => generateTree()}> Generate tree </Button>
        </Row>
      </Content>
    </div>
  );
}
