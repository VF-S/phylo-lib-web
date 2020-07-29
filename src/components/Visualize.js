import React, { useRef, useState } from 'react';
import { Button, Layout, Popover, Radio, Row, Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import '../App.css';
import HoverVocab from './HoverVocab';
import * as Tree from '../ocaml_src/tree.bs';
import * as PhyloParser from '../ocaml_src/phylo_parser.bs';

const { Content } = Layout;

export default function Visualize() {
  const [fileList, setFileList] = useState([]);
  const [currFile, setCurrFile] = useState(undefined);
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [asciiPhylo, setasciiPhylo] = useState('');
  const [currPhylo, setCurrPhylo] = useState('');

  const phyloContainer = useRef(null);

  const reader = new FileReader();

  const displayPhyloFile = (file) => {
    try {
      reader.onload = () => {
        const phylo = PhyloParser.from_phylo_str(reader.result);
        const str = Tree.to_string(phylo.tree);
        setasciiPhylo(str);
        setPhyloVisible(true);
        window.scrollTo({
          behavior: 'smooth',
          top: phyloContainer.current.offsetTop - 15,
        });
        phyloContainer.current.scrollTo({
          behavior: 'smooth',
          top: 1000,
        });
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      console.log('File printing failed');
    }
  };

  const handleVisualize = function () {
    setCurrPhylo('');
    displayPhyloFile(currFile);
  };

  const uploadProps = {
    accept: '.xml',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    fileList: fileList,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    transformFile(file) {
      setFileList([file]);
      setCurrFile(file);
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
              Visualize an existing{' '}
              <HoverVocab
                content={
                  <p>
                    A tree that displays the evolutionary relationships between
                    various organisms.
                  </p>
                }
                vocab="phylogenetic tree"
                link="https://www.khanacademy.org/science/high-school-biology/hs-evolution/hs-phylogeny/a/phylogenetic-trees"
                linkText="Khan Academy"
              />
              . Begin by uploading a{' '}
              <HoverVocab
                content={
                  <p>An XML format for describing phylogenetic trees.</p>
                }
                vocab="phyloXML"
                link="http://phyloxml.org/"
                linkText=" the phyloXML website "
              />{' '}
              file, or use our example files.
            </h2>
          </div>
        </Row>
        <Row className="centered-content">
          <h3 className="example-text">See some examples:</h3>
        </Row>
        <Row className="centered-content">
          <Radio.Group onChange={changeExamples} value={currPhylo}>
            <Radio.Button value="amphi_frost">Amphibian Phylogeny</Radio.Button>
            <Radio.Button value="tol_156">The Tree of Life</Radio.Button>
            <Radio.Button value="apaf">Apaf-1 Gene Family Tree</Radio.Button>
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
                  phyloxml.org
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
            <div className="example-credits">
              <InfoCircleOutlined />
            </div>
          </Popover>
        </Row>
        <Row className="centered-content">
          <h3 className="example-text">Or upload your own PhyloXML file:</h3>
        </Row>
        <Row className="horizontally-centered">
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined />
              Upload PhyloXML Files
            </Button>
          </Upload>
          <Button
            onClick={handleVisualize}
            className="action-button"
            disabled={fileList.length < 1}
          >
            Visualize
          </Button>
        </Row>
        {phyloVisible ? (
          <Row justify="center">
            <div className="ascii-phylo-container" ref={phyloContainer}>
              <p className="ascii-phylo">{asciiPhylo}</p>
            </div>
          </Row>
        ) : null}
      </Content>
    </div>
  );
}
