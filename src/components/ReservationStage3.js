/**
 * Created by Razi on 12/31/2016.
 */

import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Home from 'material-ui/svg-icons/action/home';
import {cyan500} from 'material-ui/styles/colors';

export default class ReservationStage3 extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    render() {
        const styles = {
            paperStyle: {
                padding: 20,
                marginLeft: 10,
                marginRight: 10
            },
            loadingTextStyle: {
                color: cyan500,
                fontSize: 15,
                fontWeight: "bold",
            },
            headerStyle: {
                textAlign: "center"
            }
        };

        let statusContent = "";
        if (this.props.status === true) {
            statusContent = (
                <div>
                    <h3>Thank you for your reservation request.</h3>
                    <h3>We will proceed as soon as possible.</h3>
                    <h4>P.S. Have a nice day</h4>
                </div>
            );
        }
        else {
            statusContent = (
                <div>
                    <h3>Sorry we can't process your request.</h3>
                    <h3>Contact administrator for more information</h3>
                </div>
            );
        }

        let status = (
            <Row>
                <Col xs={12}>
                    <Row center="xs">
                        <div>
                            {statusContent}
                            <br/><br/>
                            <RaisedButton
                                label="Back to Home"
                                primary={true}
                                onTouchTap={this.props.goToStageOne}
                                icon={<Home />}
                            />
                        </div>
                    </Row>
                </Col>
            </Row>
        );
        if (this.props.isLoadingSubmit === true) {
            status = (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <div>
                                <CircularProgress size={90} thickness={5}/>
                                <br/><br/>
                                <div style={styles.loadingTextStyle}>Please Wait ...</div>
                            </div>
                        </Row>
                    </Col>
                </Row>
            );
        }

        return (
            <ReactCSSTransitionGroup
                transitionName="container-animate"
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={false}
                transitionLeave={false}>
                <Row>
                    <Col xs={12} smOffset={2} sm={8} mdOffset={3} md={6}>
                        <Paper style={styles.paperStyle} zDepth={1}>
                            {status}
                        </Paper>
                    </Col>
                </Row>
            </ReactCSSTransitionGroup>
        );
    }
}