/**
 * Created by Razi on 12/24/2016.
 */

import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppBar from 'material-ui/AppBar';
import DateTimePicker from './DateTimePicker';
import ScheduleList from './ScheduleList';
import ReservationStage2 from './ReservationStage2';
import RaisedButton from 'material-ui/RaisedButton';
import Calendar from './calender/Calendar';
import IconButton from 'material-ui/IconButton';
import Event from 'material-ui/svg-icons/action/event';
import Love from 'material-ui/svg-icons/action/favorite';
import {redA400} from 'material-ui/styles/colors';
import ManageDate from '../funtions/ManageDate';
import LPLogo from '../assets/lp_white.png';
import Help from './Help';

export default class ReservationStage1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            selectedTime: new Date(),
            maxDuration: null,
            isValidReserve: false,
            stage1: true,
            showCalendar: false
        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.updateValidReserveStatus = this.updateValidReserveStatus.bind(this);
        this.updateMaxDuration = this.updateMaxDuration.bind(this);
        this.nextStage = this.nextStage.bind(this);
        this.prevStage = this.prevStage.bind(this);
        this.showHome = this.showHome.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
    }

    handleChangeDate(date) {
        this.setState({
            selectedDate: date
        });
    }

    handleChangeTime(time) {
        this.setState({
            selectedTime: time
        });
    }

    updateValidReserveStatus(status) {
        this.setState({
            isValidReserve: status
        })
    }

    updateMaxDuration(duration) {
        this.setState({
            maxDuration: duration
        });
    }

    nextStage() {
        this.setState({
            stage1: false
        });
    }

    prevStage() {
        this.setState({
            selectedDate: new Date(),
            selectedTime: new Date(),
            stage1: true
        });
    }

    showCalendar() {
        this.setState({
            showCalendar: true
        });
    }

    showHome() {
        this.setState({
            showCalendar: false,
            stage1: true
        });
    }

    render() {
        const styles = {
            rowStyle: {
                margin: 0
            },
            reserveButtonStyle: {
                marginBottom: "20px"
            },
            stageStyle: {
                paddingBottom: "50px"
            },
            availableStyle: {
                color: "#76FF03",
                textAlign: "center"
            },
            love: {
                margin: "0 7px 0 7px"
            }
        };

        const readableDate = ManageDate.getReadableDate(this.state.selectedDate);
        const readableTime = ManageDate.getReadableTime(this.state.selectedTime);

        let reserveButton = "";
        if (this.state.isValidReserve === true) {
            reserveButton = (
                <Row style={Object.assign({}, styles.rowStyle, styles.reserveButtonStyle)}>
                    <Col xs={10} xsOffset={1}>
                        <h3 style={styles.availableStyle}>LP available on {readableDate} at {readableTime}</h3>
                        <Row center="xs">
                            <RaisedButton
                                label="reserve now"
                                primary={true}
                                onTouchTap={this.nextStage}
                                style={styles.raisedButton}
                            />
                        </Row>
                    </Col>
                </Row>
            );
        }

        let stage = "";
        let help = <Help/>;
        if (this.state.showCalendar === true) {
            stage = <Calendar/>;
            help = "";
        }
        else if (this.state.stage1 === true) {
            stage = (
                <ReactCSSTransitionGroup
                    transitionName="container-animate"
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <DateTimePicker
                        handleChangeDate={this.handleChangeDate}
                        handleChangeTime={this.handleChangeTime}
                    />
                    <br/><br/>
                    <Row style={styles.rowStyle}>
                        <Col xs={12} sm={10} smOffset={1} md={6} mdOffset={3} lg={6}>
                            <ScheduleList
                                selectedDate={this.state.selectedDate}
                                selectedTime={this.state.selectedTime}
                                updateValidReserveStatus={this.updateValidReserveStatus}
                                updateMaxDuration={this.updateMaxDuration}
                            />
                        </Col>
                    </Row>
                    <br/>
                    {reserveButton}
                </ReactCSSTransitionGroup>
            )
        }
        else {
            stage = (
                <div>
                    <ReservationStage2
                        selectedDate={this.state.selectedDate}
                        selectedTime={this.state.selectedTime}
                        maxDuration={this.state.maxDuration}
                        prevStage={this.prevStage}
                    />
                </div>
            )
        }

        return (
            <div id="x-wrapper">
                <AppBar
                    title="Reservatioan"
                    iconElementLeft={<img style={{cursor: "pointer"}} src={LPLogo} alt="LP" width={33} height={35}/>}
                    onLeftIconButtonTouchTap={this.showHome}
                    iconElementRight={<IconButton><Event/></IconButton>}
                    onRightIconButtonTouchTap={this.showCalendar}
                />
                <br/><br/><br/>
                <div style={styles.stageStyle}>
                    {stage}
                </div>
                <div id="x-footer">
                    &copy; 2017. <i>Made with <Love style={styles.love} color={redA400}/> by AdminLP</i>
                </div>
                {help}
            </div>
        );
    }
}