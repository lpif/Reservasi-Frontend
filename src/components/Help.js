/**
 * Created by Razi on 2/21/2017.
 */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import HelpIcon from 'material-ui/svg-icons/action/help';
import FlatButton from 'material-ui/FlatButton';
import {cyan500, cyan700} from 'material-ui/styles/colors';

export default class Help extends React.Component {
    constructor() {
        super();
        this.state = {
            showHelp: false
        };
        this.showHelp = this.showHelp.bind(this);
        this.closeHelp = this.closeHelp.bind(this);
    }

    showHelp() {
        this.setState({
            showHelp: true
        });
    }

    closeHelp() {
        this.setState({
            showHelp: false
        });
    }

    render() {
        const styles = {
            helpIcon: {
                position: "fixed",
                height: "40px",
                width: "40px",
                bottom: 18,
                right: 18,
                cursor: "pointer"
            },
            dialogStyle: {
                width: "98%",
                maxWidth: "750px",
            }
        };

        const helpText = (
            <div>
                Ini Help
            </div>
        );

        const actions = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={this.closeHelp}
            />
        ];

        return (
            <div>`
                <HelpIcon
                    onTouchTap={this.showHelp}
                    style={styles.helpIcon}
                    color={cyan500}
                    hoverColor={cyan700}
                />
                <Dialog
                    title="FAQ(?)"
                    actions={actions}
                    modal={false}
                    open={this.state.showHelp}
                    onRequestClose={this.closeHelp}
                    autoScrollBodyContent={true}
                    contentStyle={styles.dialogStyle}>
                    {helpText}
                </Dialog>
            </div>
        );
    }
}