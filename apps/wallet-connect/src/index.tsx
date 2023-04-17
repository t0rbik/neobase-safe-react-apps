import ReactDOM from 'react-dom'
import App from './App'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk'
import { theme } from '@gnosis.pm/safe-react-components'
import { ThemeProvider } from 'styled-components'

import GlobalStyles from './global'

ReactDOM.render(
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <SafeProvider>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </>,
  document.getElementById('root'),
)
