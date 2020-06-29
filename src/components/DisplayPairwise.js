import React, { useState } from 'react';
import { Button, Layout, Row, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';
import * as Dna from '../ocaml_src/dna.bs';
import * as Pairwise from '../ocaml_src/pairwise.bs';

const { Content } = Layout;

export default function DisplayPairwise() {
  const [displayVisible, setDisplayVisible] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [alignExample, setAlignExample] = useState('');
  const [fileList, setFileList] = useState([]);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);

  const parseDNA = async (file, filename) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dna = Dna.from_string(reader.result);
        dnaArr.push(dna);
        names.push(filename);
        if (dnaArr.length > 2) {
          setDnaArr(dnaArr.slice(-2));
        }
        if (names.length > 2) {
          setNames(names.slice(-2));
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      console.log('File printing failed');
    }
  };

  const displayAlignment = () => {
    if (dnaArr.length < 2) {
      alert('Not enough DNA sequences to perform pairwise alignment');
    } else {
      const [pair] = Pairwise.align_pair(dnaArr[0], dnaArr[1], 1, -1, -1);
      const str = Pairwise.to_string(pair[0], pair[1]);
      setAlignment(str.trim());
      setDisplayVisible(true);
    }
  };

  const uploadProps = {
    accept: '.FASTA, .fasta, .txt',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    fileList: fileList,
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    transformFile(file) {
      fileList.push(file);
      setFileList(fileList.slice(-2));
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
        <Row className="page" justify="center" gutter={[16, 16]}>
          <div>
            <h1>Visualize Pairwise DNA Alignments</h1>
            <h2>
              Visualize an alignment of two DNA sequences. Begin by uploading
              two .FASTA files.
            </h2>
          </div>
        </Row>
        <Row className="horizontally-centered">
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined />
              Upload .FASTA Files
            </Button>
          </Upload>
          <Button onClick={displayAlignment}>Display Alignment</Button>
        </Row>
        {displayVisible ? (
          <Row justify="center">
            <div className="ascii-phylo-container">
              <p className="ascii-phylo">{alignment}</p>
            </div>
          </Row>
        ) : null}
      </Content>
    </div>
  );
}
