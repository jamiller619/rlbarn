import * as React from 'react'
import { Toggle } from '../Toggle'
import './App.pcss'

export const App = (): JSX.Element => (
  <Toggle onToggle={(on) => console.log('on: ', on)}>
    <Toggle.On>The button is on</Toggle.On>
    <Toggle.Off>The button is off</Toggle.Off>
    <Toggle.Button />
  </Toggle>
)
