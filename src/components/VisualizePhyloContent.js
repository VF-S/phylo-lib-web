import React, { useEffect, useState, useRef } from 'react';
import { Button, Layout, Row, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';
import * as Dna from '../ocaml_src/dna.bs';
const { Content } = Layout;

const reader = new FileReader();

const printFile = async (file) => {
  try {
    reader.onload = () => {
      console.log(reader.result);
    };
    reader.readAsText(file);
  } catch (e) {
    console.log(e);
    console.log('File printing failed');
  }
};

const uploadProps = {
  accept: '.xml',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  transformFile(file) {
    printFile(file);
  },
};

export default function VisualizePhyloContent() {
  const [fileList, setFileList] = useState([]);
  const input = useRef(null);

  const updateFileList = () => {
    console.log('hi');
    console.log(fileList);
  };

  useEffect(() => {
    setFileList(input.current.files);
    console.log(fileList);
  }, [input, fileList]);

  const printFiles = () => {
    if (fileList !== undefined && fileList instanceof FileList) {
      const dnaReader = new FileReader();
      dnaReader.onload = () => {
        console.log(Dna.to_string(Dna.from_string(reader.result)));
      };
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        console.log('index');
        console.log(i);
        try {
          dnaReader.readAsText(file);
        } catch (e) {
          console.log(e);
          console.log('File printing failed');
          console.log('index');
          console.log(i);
        }
      }
    }
  };
  useEffect(() => {
    console.log('hi again');
    if (fileList !== undefined && fileList instanceof FileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        try {
          reader.onload = () => {
            console.log(Dna.to_string(Dna.from_string(reader.result)));
          };
          reader.readAsText(fileList[i]);
        } catch (e) {
          console.log(e);
          console.log('File printing failed');
        }
      }
    }
  }, [fileList, fileList.length]);

  const heading = 'Visualize PhyloXML';
  return (
    <Content justify="center">
      <Row className="intro" justify="center" gutter={[16, 16]}>
        <div>
          <h1>{heading}</h1>
          <h2>A phylogenetic library written in OCaml.</h2>
        </div>
      </Row>
      <Row className="upload">
        <Upload {...uploadProps}>
          <Button>
            <UploadOutlined />
            Upload PhyloXML Files Here
          </Button>
        </Upload>
      </Row>
      <Row className="upload">
        <div className="custom-upload">
          <Button>
            <UploadOutlined />
            Upload Multiple PhyloXML Files Here
            <input
              type="file"
              name="dnaFiles"
              accept=".fasta,.FASTA,.txt"
              multiple
              ref={input}
              onInput={printFiles}
            />
          </Button>
        </div>
      </Row>
    </Content>
  );
}
