import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Header from './components/Header'
import SongPlayer from './components/SongPlayer'

function App() {
  return (
    <Container>
      <Header />
      <SongPlayer />
    </Container>
  );
}

export default App;
