import React from 'react';
import { Button, Layout, Row, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../App.css';
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
    </Content>
  );
}
