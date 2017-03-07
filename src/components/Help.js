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
                right: 7,
                cursor: "pointer"
            },
            dialogStyle: {
                width: "98%",
                maxWidth: "750px",
            }
        };

        const helpText = (
            <div>
                <br/>
                <b>How to reserve?</b><br/>
                1. Pick a date and a time your activity starts. Make sure the time is between 7.00-22.00<br/>
                2. It will appear the reserve button if it is available.<br/>
                3. Fill your detail reservation into the form.<br/>
                4. Wait until your reservation is accepted :)<br/>
                <br/>
                <b>When should I reserve?</b><br/>
                -At least D-1, except for the lecturer can order via admin. :)<br/>
                <br/>
                <b>How to cancel the reservation?</b><br/>
                -Call the LP administrator :)<br/>
                <br/>
                <b>How to edit the reservation?</b><br/>
                -Call the LP administrator :)<br/>
                <br/>
                <b>When do I know if it's already been accepted?</b><br/>
                -Check this web continuously. It will appear in the schedule. :)<br/>
                <br/>
                <b>How to know the schedule in mounth?</b><br/>
                -Click at the calendar icon in the top right corner. :)<br/>
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
            <div>
                <HelpIcon
                    onTouchTap={this.showHelp}
                    style={styles.helpIcon}
                    color={cyan500}
                    hoverColor={cyan700}
                />
                <Dialog
                    title="(?) FAQ"
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