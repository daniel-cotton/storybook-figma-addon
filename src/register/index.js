import React from 'react';
import addons from '@storybook/addons';
import styled from '@emotion/styled';

import Loader from "../Loader";

const FigmaPanel = styled.div(props => ({
  backgroundColor: props.background,
  margin: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}));

const LoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

class Figma extends React.Component {

  constructor() {
    super();
    this.state = {
      background: '#fff',
      url: null
    };
    this.onAddURL = this.onAddURL.bind(this);
    this.loadConfig = this.loadConfig.bind(this);
    this.loadingFinished = this.loadingFinished.bind(this);
  }

  onAddURL(url) {
    this.setState({
      url,
      loading: true
    });
  };

  loadConfig(config) {
    const { background, figma } = config;
    if (background) {
      this.setState({
        background
      });
    }
    if (figma) {
      this.setState({
        globalURL: figma,
        loading: this.state.url ? false : true
      });
    }
  }

  loadingFinished() {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on('figma-addon/store_url', this.onAddURL);
    channel.on('figma-addon/config', this.loadConfig);

    this.stopListeningOnStory = api.onStory(() => {
      this.onAddURL('');
    });
  }

  render() {
    const { background, globalURL, url, loading } = this.state;
    const { active } = this.props;

    return active ? <FigmaPanel background={background}>
      {loading ? <LoaderWrapper><Loader /></LoaderWrapper> : null}
      <iframe src={`https://www.figma.com/embed?embed_host=share&url=${url || globalURL}`} width="100%" height="100%" onLoad={this.loadingFinished}/>
    </FigmaPanel> : null;
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel, api } = this.props;
    channel.removeListener('figma-addon/store_url', this.onAddURL);
    channel.removeListener('figma-addon/config', this.loadConfig);
  }
}

addons.register('figma-addon', api => {
  addons.addPanel('figma-addon/panel', {
    title: 'Figma',
    render: ({ active }) => <Figma channel={addons.getChannel()} api={api} active={active} />,
  });
});
