import React, { useState } from 'react';
import { Button, Layout, Popover, Radio, Row, Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import '../App.css';
import * as Tree from '../ocaml_src/tree.bs';
import * as PhyloParser from '../ocaml_src/phylo_parser.bs';

const { Content } = Layout;

export default function Visualize() {
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [asciiPhylo, setasciiPhylo] = useState('');
  const [currPhylo, setCurrPhylo] = useState('');

  const reader = new FileReader();

  const displayPhyloFile = (file) => {
    try {
      reader.onload = () => {
        const phylo = PhyloParser.from_phylo_str(reader.result);
        const str = Tree.to_string(phylo.tree);
        setasciiPhylo(str);
        setPhyloVisible(true);
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
      displayPhyloFile(file);
    },
  };

  const changeExamples = (e) => {
    const filePath =
      process.env.PUBLIC_URL + '/examples/phyloXML/' + e.target.value + '.xml';
    setCurrPhylo(e.target.value);
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => displayPhyloFile(blob));
  };

  return (
    <div className="wrapper">
      <Content justify="center">
        <Row className="page" justify="center" gutter={[16, 16]}>
          <div>
            <h1>Visualize PhyloXML</h1>
            <h2>
              Visualize an existing phylogenetic tree. Begin by uploading a
              PhyloXML file, or use our example files.
            </h2>
          </div>
        </Row>
        <Row className="centered-content">
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined />
              Upload PhyloXML Files
            </Button>
          </Upload>
        </Row>
        <Row className="centered-content">
          <p className="phylo-example-text">or see some examples</p>
        </Row>
        <Row className="centered-content">
          <Radio.Group
            onChange={changeExamples}
            defaultValue="phyloXML examples"
          >
            <Radio.Button value="amphi_frost">Amphibian Phylogeny</Radio.Button>
            <Radio.Button value="tol_156">The Tree of Life</Radio.Button>
            <Radio.Button value="apaf">Apaf-1 Gene Family Tree</Radio.Button>
            <Radio.Button value="adh">Alcohol Dehydrogenases</Radio.Button>
          </Radio.Group>
          <Popover
            content={
              <p>
                Example files obtained from{' '}
                <a
                  href="http://phyloxml.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this website
                </a>
                .
                {currPhylo !== '' ? (
                  <p>
                    See the phyloXML source for the current tree{' '}
                    <a
                      href={
                        'http://phyloxml.org/archaeopteryx-js/phyloxml_trees/' +
                        currPhylo +
                        '.xml'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    .
                  </p>
                ) : null}
              </p>
            }
            title="Credits"
            trigger="click"
          >
            <div className="phylo-example-credits">
              <InfoCircleOutlined />
            </div>
          </Popover>
        </Row>
        {phyloVisible ? (
          <Row justify="center">
            <div className="ascii-phylo-container">
              <p className="ascii-phylo">{asciiPhylo}</p>
            </div>
          </Row>
        ) : null}
        <svg id="phylo-container" name="phylo-container" />
      </Content>
    </div>
  );
}