import React, { useRef, useState } from 'react';
import {
  Button,
  Col,
  Layout,
  Popover,
  Radio,
  Row,
  Spin,
  Switch,
  Upload,
} from 'antd';
import {
  InfoCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import HoverVocab from './HoverVocab';
import * as Dna from '../ocaml_src/dna.bs';
import * as Tree from '../ocaml_src/tree.bs';
import * as Distance from '../ocaml_src/distance.bs';
import * as PhyloAlgo from '../ocaml_src/phylo_algo.bs';
import * as PhyloPrinter from '../ocaml_src/phylo_printer.bs';
import * as Msa from '../ocaml_src/msa.bs';
import influenza from '../ocaml_src/Examples/Influenza.js';
import cytochrome_c from '../ocaml_src/Examples/cytochrome_c.js';
import capsid from '../ocaml_src/Examples/Capsid.js';
import '../App.css';

const { Content } = Layout;

export default function Generate() {
  const [currTree, setCurrTree] = useState(null);
  const [phyloTree, setPhyloTree] = useState('');
  const [alignmentChecked, setAlignmentChecked] = useState(true);
  const [treeMethodChecked, setTreeMethodChecked] = useState(true);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateClicked, setGenerateClicked] = useState(false);
  const BAYESIAN_EXISTS = false;

  const phyloContainer = useRef(null);

  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const updateSeq = (dna, name) => {
    setDnaArr((dnaArr) => dnaArr.concat(dna));
    setNames((names) => names.concat(name));
  };

  const parseDNA = async (file, filename) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dna = Dna.from_string(reader.result);
        updateSeq(dna, filename);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log('File printing failed');
      console.log(e);
    }
  };

  const scrollDown = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: phyloContainer.current.offsetTop - 15,
    });
  };

  const scrollToPhylo = () => {
    if (phyloContainer.current !== null) {
      scrollDown();
    } else {
      setTimeout(() => {
        scrollDown();
      }, 1000);
    }
  };

  const changeGenerateExamples = (e) => {
    switch (e.target.value) {
      case 'Influenza A Viruses':
        setPhyloTree(influenza);
        break;
      case 'COXII':
        setPhyloTree(cytochrome_c);
        break;
      case 'Virus Capsid':
        setPhyloTree(capsid);
        break;
    }
    setGenerateClicked(false);
    scrollToPhylo();
  };

  const generateTree = () => {
    setLoading(true);
    if (!alignmentChecked) {
      setTimeout(() => {
        const distMatrix = Distance.dist_dna(dnaArr, 1, -1, -1);
        const tree = PhyloAlgo.upgma(distMatrix, names);
        setCurrTree(tree);
        setPhyloTree(Tree.to_string(tree));
        setLoading(false);
        setGenerateClicked(true);
        scrollToPhylo();
      }, 500);
      return;
    }
    let job = '';

    const waitStatus = (numTries) => {
      fetch(
        'https://www.ebi.ac.uk/Tools/services/rest/clustalo/status/' + job,
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
        .then((response) => response.text())
        .then((result) => {
          if (result !== 'FINISHED' && numTries < 50) {
            console.log('querying');
            setTimeout(waitStatus(numTries + 1), 1000);
          } else {
            if (result !== 'FINISHED') {
              return;
            }
            console.log(result);

            fetch(
              'https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/' +
              job +
              '/aln-fasta',
              {
                method: 'GET',
                redirect: 'follow',
              },
            )
              .then((response) => response.text())
              .then((result) => {
                console.log('got result');
                console.log(result);
                const aligned_dnas = Dna.multiple_from_string(result);
                console.log('got dnas');
                const msa = Msa.align(aligned_dnas);
                console.log('got msa');
                const dist_matrix = Distance.dist_msa(msa, 1);
                console.log('got dist mat');
                const tree = PhyloAlgo.upgma(dist_matrix, names);
                setCurrTree(tree);
                setPhyloTree(Tree.to_string(tree));
                setLoading(false);
                setGenerateClicked(true);
                scrollToPhylo();
              })
              .catch((error) => console.log('error1', error));
          }
        })
        .catch((error) => console.log('error', error));
    };

    var urlencoded = new URLSearchParams();
    urlencoded.append('email', 'vg222@cornell.edu');
    let dnaStr = '';
    for (let i = 0; i < dnaArr.length; i++) {
      dnaStr += '>';
      dnaStr += names[i].split(' ').join('_');
      dnaStr += '\n';
      dnaStr += Dna.to_string(dnaArr[i]);
      dnaStr += '\n';
    }
    urlencoded.append('sequence', dnaStr);
    urlencoded.append('outfmt', 'fa');

    fetch('https://www.ebi.ac.uk/Tools/services/rest/clustalo/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlencoded,
      redirect: 'follow',
    })
      .then((response) => response.text())
      .then((result) => {
        job = result;
        console.log(job);
        waitStatus(0);
      })
      .catch((error) => console.log('error', error));
  };

  const downloadTreeLink = () => {
    const treeXML = PhyloPrinter.xml_of_tree(currTree);
    return 'data:text/xml;charset=utf-8,' + encodeURIComponent(treeXML);
  };

  const clean_file_name = (name) => {
    return name.split('.').slice(0, -1).join('.').toUpperCase();
  };
  const fastaUploadProps = {
    accept: '.FASTA, .txt, .fasta',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    multiple: true,
    transformFile(file) {
      const file_name = clean_file_name(file.name);
      parseDNA(file, file_name);
    },

    onRemove(file) {
      const file_name = clean_file_name(file.name);
      const file_index = names.indexOf(file_name);
      dnaArr.splice(file_index, 1);
      names.splice(file_index, 1);
      setDnaArr(dnaArr);
      setNames(names);
    },
  };

  return (
    <div className="wrapper">
      <Content justify="center">
        <Row className="page" justify="center">
          <div>
            <h1>Generate a Phylogenetic Tree</h1>
            <h2>
              By computing similarity scores for DNA samples of species, we can
              infer their species' evolutionary history through time.
            </h2>
            <h2>
              Begin by uploading{' '}
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
                linkText="Pearson et. al, 1988"
              />{' '}
              files that contain DNA sequences, or use our example DNA
              sequences.
            </h2>
          </div>
        </Row>
        <Row className="centered-content">
          <h3 className="example-text">See some examples:</h3>
        </Row>
        <Row className="centered-content" gutter={[5, 5]}>
          <Col lg={1}></Col>
          <Col lg={10} md={12} className="centered-content">
            <Radio.Group onChange={changeGenerateExamples}>
              <Radio.Button value="Virus Capsid">
                Virus Capsid Gene
              </Radio.Button>
              <Radio.Button value="COXII">
                Cytochrome C Oxidase Subunit II
              </Radio.Button>
              <Radio.Button value="Influenza A Viruses">
                Influenza A PB-2
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col lg={1} md={12}>
            <Button>
              <a
                href={
                  process.env.PUBLIC_URL + '/examples/FASTA/phylo_examples.zip'
                }
              >
                Download Examples
              </a>
            </Button>
          </Col>
        </Row>
        <Row className="centered-content">
          <h3 className="upload-text">Or upload 3 or more FASTA files:</h3>
        </Row>
        <Row className="horizontally-centered">
          <Popover
            content={
              <div>
                <p>
                  Clustal and DP are two techniques of aligning DNA sequences.
                  Clustal is a software package used for multiple sequence
                  alignment, utilizing heuristics for faster alignments. The
                  dynamic programming (DP) technique generates a globally
                  optimum alignment, but may be situationally slower than
                  Clustal.
                </p>
                {BAYESIAN_EXISTS ? (
                  <p>
                    UPGMA and Bayesian inference are two ways of generating
                    phylogenetic trees from sequence alignments. UPGMA
                    (unweighted pair group method with arithmetic mean) is an
                    agglomerative clustering method that groups sequences based
                    on pairwise similarity. Bayesian inference uses prior
                    information and Markov Chain Monte Carlo sampling to
                    construct a chain of trees and get a sample of the final
                    tree distribution, thereby finding the most likely
                    phylogenetic tree. Bayesian inference is slower than UPGMA,
                    but more accurate and customizable.
                  </p>
                ) : null}
              </div>
            }
            title="MSA Information"
            trigger="click"
          >
            <div className="generate-info">
              <InfoCircleOutlined />
            </div>
          </Popover>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Switch
              checkedChildren="Clustal"
              unCheckedChildren="DP"
              className="generate-toggle"
              defaultChecked
              onChange={(checked, event) => {
                setAlignmentChecked(checked);
                if (!checked) {
                  setTreeMethodChecked(true);
                }
              }}
            />
            {BAYESIAN_EXISTS ? (
              <Switch
                checked={treeMethodChecked}
                checkedChildren="UPGMA"
                unCheckedChildren="Bayesian"
                className="generate-toggle"
                defaultChecked
                disabled={!alignmentChecked}
                onChange={(checked, event) => {
                  setTreeMethodChecked(checked);
                }}
              />
            ) : null}
          </div>
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button
            onClick={generateTree}
            className="action-button"
            disabled={dnaArr.length < 3}
          >
            Generate tree
          </Button>
          {loading ? (
            <Spin className="spinner" indicator={loadingIcon} />
          ) : null}
        </Row>
        {generateClicked ? (
          <Row className="centered-content">
            <Button>
              <a href={downloadTreeLink()} download="tree.xml">
                Save Displayed Tree as PhyloXML
              </a>
            </Button>
          </Row>
        ) : null}
      </Content>
      {phyloTree ? (
        <Row justify="center">
          <div className="ascii-phylo-container" ref={phyloContainer}>
            <p className="ascii-phylo">{phyloTree}</p>
          </div>
        </Row>
      ) : null}
    </div>
  );
}
