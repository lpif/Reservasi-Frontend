import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReservationStage1 from './components/ReservationStage1';
import './assets/main.css';
import Perf from 'react-addons-perf';

injectTapEventPlugin();

ReactDOM.render(
    (
       <MuiThemeProvider>
           <ReservationStage1/>
       </MuiThemeProvider>
    ),
    document.getElementById('root')
);

