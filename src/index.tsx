import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

const jobName = location.search.slice(1)

ReactDOM.render(<App jobName={jobName} />, document.getElementById('app'))
