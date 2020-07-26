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
  Tooltip,
  Upload,
} from 'antd';
import {
  DeleteOutlined,
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

import h1n1 from '../ocaml_src/Examples/h1n1.js';
import h3n2 from '../ocaml_src/Examples/h3n2.js';
import h5n1 from '../ocaml_src/Examples/h5n1.js';
import '../App.css';

const { Content } = Layout;

export default function Generate() {
  const [PhyloTree, setPhyloTree] = useState('');
  const [phyloVisible, setPhyloVisible] = useState(false);
  const [alignmentChecked, setAlignmentChecked] = useState(true);
  const [dnaArr, setDnaArr] = useState([]);
  const [names, setNames] = useState([]);
  const [download, setDownload] = useState(undefined);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const exampleDnas = [h1n1, h3n2, h5n1];
  const exampleNames = ['H1N1', 'H3N2', 'H5N1'];

  const phyloContainer = useRef(null);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
      console.log(e);
      console.log('File printing failed');
    }
  };

  const changeGenerateExamples = (e) => {
    switch (e.target.value) {
      case 'Influenza A Viruses':
        setPhyloVisible(true);
        setPhyloTree(influenza);
        break;
      case 'COXII':
        setPhyloVisible(true);
        setPhyloTree(cytochrome_c);
        break;
      case 'Virus Capsid':
        setPhyloVisible(true);
        console.log(capsid);
        setPhyloTree(capsid);
        break;
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

  const generateTree = () => {
    // use default files if no other files have been uploaded
    setLoading(true);
    const dnaNames = uploaded ? names : exampleNames;
    if (!alignmentChecked) {
      setTimeout(() => {
        const dnas = uploaded ? dnaArr : exampleDnas;
        const dist_matrix = Distance.dist_dna(dnas, 1, -1, -1);
        const tree = PhyloAlgo.upgma(dist_matrix, dnaNames);
        const output = Tree.to_string(tree);
        setPhyloTree(output);
        setPhyloVisible(true);
        setLoading(false);
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
                const tree = PhyloAlgo.upgma(dist_matrix, dnaNames);
                const output = Tree.to_string(tree);
                setPhyloTree(output);
                setPhyloVisible(true);
                setLoading(false);
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

  const downloadTree = () => {
    if (uploaded && dnaArr.length < 1) {
      alert('At least one FASTA file must be uploaded for tree generation.');
      return;
    }
    const dnas = uploaded ? dnaArr : exampleDnas;
    const dnaNames = uploaded ? names : exampleNames;

    const dist_matrix = Distance.dist_dna(dnas, 1, -1, -1);
    const tree = PhyloAlgo.upgma(dist_matrix, dnaNames);
    const treeXML = PhyloPrinter.xml_of_tree(tree);
    const element = (
      <a
        href={'data:text/xml;charset=utf-8,' + encodeURIComponent(treeXML)}
        download="tree.xml"
      >
        Click to Download
      </a>
    );
    setDownload(element);
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
      setUploaded(true);
      const file_name = clean_file_name(file.name);
      parseDNA(file, file_name);
    },

    onRemove(file) {
      const file_name = clean_file_name(file.name);
      console.log(file_name);
      const file_index = names.indexOf(file_name);
      console.log(file_index);

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
                    sequences.
                  </p>
                }
                vocab=".FASTA"
                link="https://en.wikipedia.org/wiki/FASTA_format"
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
          <h3 className="upload-text">Or upload your own FASTA files:</h3>
        </Row>
        <Row className="horizontally-centered">
          <Popover
            content={<p>Information on Clustal and UPGMA</p>}
            title="Info"
            trigger="click"
          >
            <div className="generate-info">
              <InfoCircleOutlined />
            </div>
          </Popover>
          <Switch
            checkedChildren="Clustal"
            unCheckedChildren="UPGMA"
            className="generate-toggle"
            defaultChecked
            onChange={(checked, event) => {
              setAlignmentChecked(checked);
            }}
          />
          <Upload {...fastaUploadProps}>
            <Button>
              <UploadOutlined /> Upload .FASTA files
            </Button>
          </Upload>
          <Button
            onClick={generateTree}
            className="action-button"
            disabled={dnaArr.length === 0}
          >
            Generate tree
          </Button>
          {loading ? <Spin className="spinner" indicator={antIcon} /> : null}
        </Row>
        {dnaArr.length === 0 ? null : (
          <Row className="centered-content">
            <Button onClick={downloadTree}>Save tree as phyloXML</Button>
          </Row>
        )}

        {download !== undefined ? (
          <Row className="centered-content">
            {download}
            <Button
              onClick={() => setDownload(undefined)}
              className="hide-download"
            >
              <Tooltip title="Hide Download Link">
                <DeleteOutlined style={{ color: 'firebrick' }} />
              </Tooltip>
            </Button>
          </Row>
        ) : null}
      </Content>
      {phyloVisible ? (
        <Row justify="center">
          <div className="ascii-phylo-container" ref={phyloContainer}>
            <p className="ascii-phylo">{PhyloTree}</p>
          </div>
        </Row>
      ) : null}
    </div>
  );
}
