import React, { useState } from 'react';
import { Button, Layout, Radio, Row, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';
import * as Dna from '../ocaml_src/dna.bs';
import * as Pairwise from '../ocaml_src/pairwise.bs';

const { Content } = Layout;

export default function DisplayPairwise() {
  const [displayVisible, setDisplayVisible] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [exampleArr, setExampleArr] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dnaArr, setDnaArr] = useState([]);

  const parseDNA = (file, arr, displayOnFinish) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        arr.push(Dna.from_string(reader.result));
        if (dnaArr.length > 2) {
          setDnaArr(dnaArr.slice(-2));
        }
        if (arr.length === 2 && displayOnFinish) {
          displayAlignment(arr);
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      console.log('File printing failed');
    }
  };

  const displayAlignment = (arr) => {
    if (arr.length < 2) {
      alert('Not enough DNA sequences to perform pairwise alignment');
    } else {
      const [pair] = Pairwise.align_pair(arr[0], arr[1], 1, -1, -1);
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
      parseDNA(file, dnaArr, false);
      fileList.push(file);
      setFileList(fileList.slice(-2));
    },
  };

  const changeExamples = (e) => {
    setExampleArr([]);
    const files = e.target.value.split(',');
    files.map((file) => {
      const filePath =
        process.env.PUBLIC_URL + '/examples/FASTA/' + file + '.fasta';
      fetch(filePath)
        .then((response) => response.blob())
        .then((blob) => parseDNA(blob, exampleArr, true));
    });
  };

  return (
    <div className="wrapper">
      <Content justify="center">
        <Row className="page" justify="center" gutter={[16, 16]}>
          <div>
            <h1>Visualize Pairwise DNA Alignments</h1>
            <h2>
              Visualize an alignment of two DNA sequences. Begin by uploading
              two .FASTA files, or use our example files.
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
          <Button onClick={() => displayAlignment(dnaArr)}>
            Display Alignment
          </Button>
        </Row>
        <Row className="centered-content">
          <p className="phylo-example-text"> See our examples: </p>
        </Row>
        <Row className="centered-content">
          <Radio.Group onChange={changeExamples}>
            <Radio.Button value="h1n1,h3n2">H1N1 vs H3N2</Radio.Button>
            <Radio.Button value="h3n2,h5n1">H5N1 vs H7N7</Radio.Button>
            <Radio.Button value="mers,sars">SARS vs MERS</Radio.Button>
          </Radio.Group>
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
