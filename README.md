# storybook-figma-addon

A really simple addon for Storybook that brings in embedded Figma designs.


## Usage

1) Register the Addon
`import 'storybook-figma-addon';`

2) Include it in your Storybook Config

```
import withFigma from "storybook-figma-addon";

addDecorator(withFigma({
  // Here you can add options like the default background colour
  // to assist with loading
  background: "#0c2c3a"
}));

```

3) Tag stories to figma projects.
```

const figma = {
  figma: "https://www.figma.com/file/<your-figma-url-here>"
}

storiesOf('Button', module)
  .add('basic button', () => <Button>Primary Button</Button>, figma)

```