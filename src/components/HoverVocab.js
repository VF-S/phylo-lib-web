import React from 'react';
import { Popover } from 'antd';
import '../App.css';

export default function HoverVocab({ content, vocab, link, linkText }) {
  return (
    <Popover
      className="hover-vocab"
      content={
        <div>
          {content}
          <p>
            See{' '}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText ? linkText : 'Wikipedia'}
            </a>{' '}
            for more details.
          </p>
        </div>
      }
      placement="top"
      title="Vocabulary"
      trigger="hover"
    >
      <div>{vocab}</div>
    </Popover>
  );
}
