import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

ReactDOM.render(
  <App voiceFile="./output.mp4" transcriptResultFile="./asrOutput.json" />,
  document.getElementById('app'),
)
