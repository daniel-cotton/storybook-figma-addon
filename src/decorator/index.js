import addons, { makeDecorator } from '@storybook/addons';

export default makeDecorator({
  name: 'withFigma',
  parameterName: 'figma',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { options: inputOptions, parameters }) => {
    const channel = addons.getChannel();

    // Our simple API above simply sets the notes parameter to a string,
    // which we send to the channel
    channel.emit('figma-addon/config', inputOptions);
    channel.emit('figma-addon/store_url', parameters);

    return getStory(context);
  }
});