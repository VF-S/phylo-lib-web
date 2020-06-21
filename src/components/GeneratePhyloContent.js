import React from 'react';
import { Button, Row, Layout, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Dna from '../ocaml_src/dna.bs';

import '../App.css';
const { Content } = Layout;

const parseDNA = async (file) => {
  try {
    const reader = new FileReader();
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
          {/* <Button onClick={() => parseDNA()}> Generate tree </Button> */}
        </Row>
      </Content>
    </div>
  );
}
