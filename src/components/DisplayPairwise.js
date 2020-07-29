import React, { useRef, useState } from 'react';
import { Button, Layout, Popover, Radio, Row, Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import '../App.css';
import HoverVocab from './HoverVocab';
import * as Dna from '../ocaml_src/dna.bs';
import * as Pairwise from '../ocaml_src/pairwise.bs';

const { Content } = Layout;

export default function DisplayPairwise() {
  const [displayVisible, setDisplayVisible] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [exampleArr, setExampleArr] = useState([]);
  const [exampleFileNames, setExampleFileNames] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dnaArr, setDnaArr] = useState([]);

  const phyloContainer = useRef(null);

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

  const scrollDown = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: phyloContainer.current.offsetTop - 15,
    });
  };

  const displayAlignment = (arr) => {
    const [pair] = Pairwise.align_pair(arr[0], arr[1], 1, -1, -1);
    const str = Pairwise.to_string(pair[0], pair[1]);
    setAlignment(str.trim());
    setDisplayVisible(true);
    if (phyloContainer.current !== null) {
      scrollDown();
    } else {
      setTimeout(() => {
        scrollDown();
      }, 1000);
    }
  };

  const uploadProps = {
    accept: '.FASTA, .fasta, .txt',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    onRemove(file) {
      dnaArr.splice(fileList.indexOf(file));
      setDnaArr(dnaArr);
    },
    transformFile(file) {
      parseDNA(file, dnaArr, false);
      fileList.push(file);
      setFileList(fileList.slice(-2));
    },
  };

  const changeExamples = (e) => {
    setExampleArr([]);
    const files = e.target.value.split(',');
    setExampleFileNames(files);
    files.map((file) => {
      const filePath =
        process.env.PUBLIC_URL + '/examples/FASTA/' + file + '.fasta';
      fetch(filePath)
        .then((response) => response.blob())
        .then((blob) => parseDNA(blob, exampleArr, true));
      return undefined;
    });
  };

  return (
    <div className="wrapper">
      <Content justify="center">
        <Row className="page" justify="center" gutter={[16, 16]}>
          <div>
            <h1>Visualize Pairwise DNA Alignments</h1>
            <h2>
              Visualize an{' '}
              <HoverVocab
                content={
                  <p>
                    A DNA sequence alignment arranges DNA to identify regions of
                    similarity, helping reveal evolutionary relations between
                    the sequences.
                    <br />A pairwise alignment is an alignment of 2 sequences,
                    and PhyloML utilizes the Needleman-Wunsch algorithm to
                    conduct this alignment.
                  </p>
                }
                vocab="alignment"
                link="https://www.sciencedirect.com/science/article/abs/pii/0022283670900574?via%3Dihub"
                linkText="the original paper on the Needleman-Wunsch algorithm"
              />{' '}
              of two DNA sequences. Begin by uploading two{' '}
              <HoverVocab
                content={
                  <p>
                    The FASTA format is a way of representing nucleotide
                    sequences. It was popularized by the FASTA software
                    developed by David J. Lipman and William R. Pearson.
                  </p>
                }
                vocab=".FASTA"
                link="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC280013/"
                linkText="the original paper on the FASTA program"
              />{' '}
              files, or use our example files.
            </h2>
          </div>
        </Row>
        <Row className="centered-content">
          <h3 className="example-text">See some examples:</h3>
        </Row>
        <Row className="centered-content">
          <Radio.Group
            onChange={changeExamples}
            value={exampleFileNames.join(',')}
          >
            <Radio.Button value="h1n1,h3n2">H1N1 vs H3N2</Radio.Button>
            <Radio.Button value="h5n1,h7n7">H5N1 vs H7N7</Radio.Button>
            <Radio.Button value="mers,h7n9">MERS vs H7N9</Radio.Button>
          </Radio.Group>
          <Popover
            content={
              <div>
                <p>
                  The pairwise alignment shown is a globally optimum alignment
                  obtained via the Needleman-Wunch algorithm.
                </p>
                <p>
                  Base pair matches, mismatches and gaps are visualized. A star
                  indicates a pair match, a bar indicates a mismatch, and a
                  blank space indicates a gap.
                </p>
                <p>
                  Example files obtained from{' '}
                  <a
                    href="https://www.ncbi.nlm.nih.gov/nuccore/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NCBI Nucleotide
                  </a>
                  .
                  {exampleFileNames.length === 2 ? (
                    <p>
                      See the sources for the current alignment:{' '}
                      <a
                        href={
                          process.env.PUBLIC_URL +
                          '/examples/FASTA/' +
                          exampleFileNames[0] +
                          '.fasta'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exampleFileNames[0] + '.fasta'}
                      </a>{' '}
                      and{' '}
                      <a
                        href={
                          process.env.PUBLIC_URL +
                          '/examples/FASTA/' +
                          exampleFileNames[1] +
                          '.fasta'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exampleFileNames[1] + '.fasta'}
                      </a>
                      .
                    </p>
                  ) : null}
                </p>
              </div>
            }
            title="Information and Credits"
            trigger="hover"
          >
            <div className="example-credits">
              <InfoCircleOutlined />
            </div>
          </Popover>
        </Row>
        <Row className="centered-content">
          <h3 className="upload-text">Or upload 2 FASTA files:</h3>
        </Row>
        <Row className="horizontally-centered">
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined />
              Upload .FASTA Files
            </Button>
          </Upload>
          <Button
            onClick={() => {
              displayAlignment(dnaArr);
              if (dnaArr.length >= 2) {
                setExampleArr([]);
                setExampleFileNames([]);
              }
            }}
            className="action-button"
            disabled={dnaArr.length < 2}
          >
            Display Alignment
          </Button>
        </Row>
        {displayVisible ? (
          <Row justify="center">
            <div className="ascii-phylo-container" ref={phyloContainer}>
              <p className="ascii-phylo">{alignment}</p>
            </div>
          </Row>
        ) : null}
      </Content>
    </div>
  );
}
