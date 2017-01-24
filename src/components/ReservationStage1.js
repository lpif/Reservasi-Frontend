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
import IconButton from 'material-ui/IconButton';
import Book from 'material-ui/svg-icons/action/book';
import Event from 'material-ui/svg-icons/action/event';
import ManageDate from '../funtions/ManageDate';

export default class ReservationStage1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            selectedTime: new Date(),
            maxDuration: null,
            isValidReserve: false,
            stage1: true
        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.updateValidReserveStatus = this.updateValidReserveStatus.bind(this);
        this.updateMaxDuration = this.updateMaxDuration.bind(this);
        this.nextStage = this.nextStage.bind(this);
        this.prevStage = this.prevStage.bind(this);
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

    render() {
        const readableDate = ManageDate.getReadableDate(this.state.selectedDate);
        const readableTime = ManageDate.getReadableTime(this.state.selectedTime);
        const labelSubmit = "reserve on " + readableDate + " at " + readableTime;

        let reserveButton = "";
        if (this.state.isValidReserve === true) {
            reserveButton = (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <RaisedButton
                                label={labelSubmit}
                                primary={true}
                                onTouchTap={this.nextStage}
                            />
                        </Row>
                    </Col>
                </Row>
            );
        }

        let stage = <div></div>;
        if (this.state.stage1 === true) {
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
                    <Row>
                        <Col xs={12} sm={10} smOffset={1} md={6} mdOffset={3} lg={6}>
                            <ScheduleList
                                selectedDate={this.state.selectedDate}
                                selectedTime={this.state.selectedTime}
                                updateValidReserveStatus={this.updateValidReserveStatus}
                                updateMaxDuration={this.updateMaxDuration}
                            />
                        </Col>
                    </Row>
                    <br/><br/>
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
            <div>
                <AppBar
                    title="LP Reservation"
                    iconElementLeft={<IconButton><Book/></IconButton>}
                    iconElementRight={<IconButton><Event/></IconButton>}
                />
                <br/><br/><br/>
                {stage}
            </div>
        );
    }
}