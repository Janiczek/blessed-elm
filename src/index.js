import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import {Elm} from './Main.elm';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {counter: 0}; // TODO how better to do this?

    this.elm = Elm.Main.init(); // no flags

    this.elm.ports.sendNewModel.subscribe((model) => {
      this.setState(model);
    });

    this.elm.ports.sendError.subscribe((err) => {
      console.error(err);
    });
  }

  dec() { this.elm.ports.listenForCommands.send('Dec'); }
  inc() { this.elm.ports.listenForCommands.send('Inc'); }

  render() {
    return (
      <box top="center"
           left="center"
           align="center"
           width="50%"
           height={5}
           content={this.state.counter.toString()}
           border={{type: 'line'}}
           style={{border: {fg: 'blue'}}}>
        <button mouse
                width={5}
                height={3}
                left={10}
                border={{type: 'line'}}
                onPress={this.dec.bind(this)}>-</button>
        <button mouse
                width={5}
                height={3}
                right={10}
                border={{type: 'line'}}
                onPress={this.inc.bind(this)}>+</button>
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Elm + react-blessed = <3'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<App />, screen);
