import React, { useState } from 'react';
import axios from 'axios';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const LinkSubmitter = ({ setType, setLinkMessage }) => {
  const [longLink, setLongLink] = useState('');

  const isURL = (link) => {
    try {
      new URL(link);
    } catch (_) {
      return false;
    }

    return true;
  };

  const requestLink = async () => {
    let prefix = '';

    if (!(longLink.startsWith('http://') || longLink.startsWith('https://'))) {
      prefix = 'http://';
    }

    if (isURL(prefix + longLink)) {
      try {
        const { data: { data: { to } } } = await axios.post(
          `${process.env.REACT_APP_API_HOST}/api/short`, { link: prefix + longLink }
        );

        setType('link');
        setLinkMessage(`${process.env.REACT_APP_API_HOST}/${to}`);
      } catch ({ response: { data: { msg } } }) {
        setType('error');
        setLinkMessage(msg);
      }
    } else {
      setType('error');
      setLinkMessage('Cannot shorten an invalid link!');
    }
  };

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        requestLink();
      }}>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Your link goes here..."
            aria-label="Your link goes here..."
            aria-describedby="link submission form"
            value={longLink}
            onChange={(e) => setLongLink(e.target.value)}
          />
          <InputGroup.Append>
            <Button variant="dark">Submit</Button>
          </InputGroup.Append>
        </InputGroup>
      </form>
    </div>
  );
};

export default LinkSubmitter;