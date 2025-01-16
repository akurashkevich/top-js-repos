import './App.css'
import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';
import List from './components/List/List.tsx'

function App() {
  return (
    <MantineProvider>
        <List />
    </MantineProvider>
  )
}

export default App
