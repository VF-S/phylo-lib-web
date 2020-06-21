import React from 'react';
import { Button, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';

import '../App.css';
const { Content } = Layout;

const reader = new FileReader();

const parseDNA = async (file) => {
  try {
    reader.onload = () => {
      console.log(Dna.to_string(Dna.from_string(reader.result)));
    };
    reader.readAsText(file);
  } catch (e) {
    console.log(e);
    console.log('File printing failed');
  }
};

const fastaUploadProps = {
  accept: '.FASTA, .text, .fasta',
  multiple: true,
  transformFile(file) {
    parseDNA(file);
  },
};

export default function GeneratePhyloContent() {
  return (
    <Content justify="center">
      <Row className="intro" justify="center">
        <div>
          <h1>Generate a Phylogenetic Tree</h1>
          <h2>
            By computing similarity scores for DNA samples of species, we can
            infer their species' evolutionary history through time. Begin by
            uploading .FASTA files that contain DNA sequences, or use our
            default DNA sequences.
          </h2>
        </div>
      </Row>
      <Row className="upload">
        <Upload {...fastaUploadProps}>
          <Button>
            <UploadOutlined /> Upload DNA sequences in .FASTA format
          </Button>
        </Upload>
        {/* <Button onClick={() => parseDNA()}> Generate tree </Button> */}
      </Row>
    </Content>
  );
}
