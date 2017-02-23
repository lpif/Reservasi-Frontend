/**
 * Created by Razi on 2/23/2017.
 */

import React from 'react';
import Paper from 'material-ui/Paper';

export default class DayWrapper extends React.Component {
    // eslint-disable-next-line
    constructor() {
        super();
    }

    render() {
        const styles = {
            dayNameStyle: {
                height: "7vh",
                width: "13vw",
                paddingTop: "1vh",
                display: "inline-block",
                textAlign: "center",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "2px",
                backgroundColor: "#EEEEEE"
            },
            weekEnd: {
                color: "#D50000"
            }
        };
        return (
            <div>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    <div style={styles.weekEnd}>Sun</div>
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    Mon
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    Tue
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    Wed
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    Thu
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    Fri
                </Paper>
                <Paper style={styles.dayNameStyle} zDepth={1}>
                    <div style={styles.weekEnd}>Sat</div>
                </Paper>
            </div>
        )
    }
}
