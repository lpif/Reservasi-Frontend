/**
 * Created by Razi on 12/25/2016.
 */

import React from 'react';
import axios from 'axios';
import {Row, Col} from 'react-flexbox-grid';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import {cyan500, pink500} from 'material-ui/styles/colors';
import ManageDate from '../funtions/ManageDate';
import config from '../../appConfig';

export default class ScheduleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedules: [],
            isLoading: false,
            showDetail: false,
            detail: ''
        };

        this.showDetail = this.showDetail.bind(this);
        this.closeDetail = this.closeDetail.bind(this);
    }

    componentDidMount() {
        this.getSchedule(new Date());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDate !== null) {
            if (nextProps.selectedDate !== this.props.selectedDate) {
                this.getSchedule(nextProps.selectedDate);
            }
        }
        if (nextProps.selectedTime !== null) {
            if (nextProps.selectedTime !== this.props.selectedTime) {
                this.isTimeValidToReserve(nextProps.selectedTime);
            }
        }
    }

    getSchedule(dateObject) {
        this.setState({
            isLoading: true
        });

        const date = ManageDate.pad(dateObject.getDate(), 2);
        const month = ManageDate.pad(dateObject.getMonth() + 1, 2);
        const year = dateObject.getFullYear();

        axios({
            url: config.API_SERVER + 'schedules/' + year + '-' + month + '-' + date,
            timeout: 10000,
            method: 'get',
        }).then(function (response) {
            this.setState({
                schedules: response.data,
                isLoading: false,
            }, () => this.isTimeValidToReserve());
        }.bind(this));
    }

    isTimeValidToReserve(selectedNextTime = null) {
        const schedules = this.state.schedules;
        let status = true;
        const selectedVal = this.convertTimeToMinutesFromDateObject(selectedNextTime);
        let maxDuration = null;

        // Check intersect
        for (let i = 0; i < schedules.length; i++) {
            const startVal = this.convertTimeToMinutesFromSchedule(schedules[i].start);

            if (startVal > selectedVal && maxDuration == null) {
                maxDuration = startVal - selectedVal;
            }

            if (schedules[i].start)
                if (this.isActive(schedules[i], selectedNextTime)) {
                    status = false;
                    break;
                }
        }

        if (status === true) {
            // Must be one day earlier
            const selectedDate = this.props.selectedDate;

            let selectedTime = this.props.selectedTime;
            if (selectedNextTime !== null)
                selectedTime = selectedNextTime;

            const today = new Date();
            if (selectedDate > today) {
                // Not at night
                const hour = selectedTime.getHours();
                if (!(hour >= 7 && hour < 22)) {
                    status = false;
                }
            }
            else {
                status = false;
            }
        }

        this.props.updateValidReserveStatus(status);
        this.props.updateMaxDuration(maxDuration);
    }

    isActive(schedule, selectedNextTime = null) {
        const startTimeVal = this.convertTimeToMinutesFromSchedule(schedule.start);
        const endTimeVal = this.convertTimeToMinutesFromSchedule(schedule.end);
        const selectedTimeVal = this.convertTimeToMinutesFromDateObject(selectedNextTime);
        return (startTimeVal <= selectedTimeVal && selectedTimeVal <= endTimeVal);
    }

    convertTimeToMinutesFromSchedule(scheduleTime) {
        const time = scheduleTime.substring(11, 16);
        return parseInt(time.split(':')[0], 10) * 60 + parseInt(time.split(':')[1], 10);
    }

    convertTimeToMinutesFromDateObject(dateObject = null) {
        let selectedTime = this.props.selectedTime;
        if (dateObject !== null)
            selectedTime = dateObject;
        return selectedTime.getHours() * 60 + selectedTime.getMinutes();
    }

    showDetail(id) {
        this.setState({
            showDetail: true,
            detail: this.state.schedules[id]
        });
    }

    closeDetail() {
        this.setState({
            showDetail: false,
            detail: ''
        });
    }

    render() {
        const styles = {
            paperStyle: {
                padding: 10,
                marginLeft: 5,
                marginRight: 5
            },
            loadingTextStyle: {
                color: cyan500,
                fontSize: 15,
                fontWeight: "bold",
            },
            headerStyle: {
                textAlign: "center"
            },
            scheduleNotFound: {
                color: pink500,
                fontSize: 22,
                fontWeight: "bold",
                textAlign: "center"
            },
            dialogStyle: {
                width: "98%",
                maxWidth: "750px",
            },
            tableStyle: {
                textAlign: "left",
                marginTop: "20px"
            },
        };

        let loading = "";
        let content = <div style={styles.scheduleNotFound}>No Schedule Found !</div>;

        if (this.state.isLoading === true) {
            loading = (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <div>
                                <CircularProgress size={90} thickness={5}/>
                                <br/><br/>
                                <div style={styles.loadingTextStyle}>Please Wait...</div>
                            </div>
                        </Row>
                    </Col>
                </Row>
            );
            content = "";
        }
        else if (this.state.schedules.length > 0) {
            content = this.state.schedules.map(function (schedule, index) {
                const startTime = schedule.start.substring(11, 16);
                const endTime = schedule.end.substring(11, 16);
                let activeStatus = <div></div>;
                if (this.isActive(schedule)) {
                    activeStatus = <ActionGrade color={cyan500}/>;
                }
                return (
                    <ListItem
                        key={schedule.id}
                        primaryText={schedule.booking.title}
                        secondaryText={startTime + " - " + endTime}
                        rightIcon={activeStatus}
                        onTouchTap={() => this.showDetail(index)}
                    />
                );
            }.bind(this));
        }

        const actions = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={this.closeDetail}
            />
        ];

        let detailModel = "";
        if (this.state.detail !== '') {
            const startTime = this.state.detail.start.substring(11, 16);
            const endTime = this.state.detail.end.substring(11, 16);
            const title = (
                this.state.detail.booking.title + " | " + startTime + " - " + endTime
            );

            let description = "-";
            if (this.state.detail.booking.description.length !== 0) {
                description = this.state.detail.booking.description;
            }

            const detailText = (
                <table style={styles.tableStyle}>
                    <tbody>
                    <tr>
                        <th>Category</th>
                        <th>:</th>
                        <th>{this.state.detail.booking.type.name}</th>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <th>:</th>
                        <th>{description}</th>
                    </tr>
                    <tr>
                        <th>Reserved by</th>
                        <th>:</th>
                        <th>{this.state.detail.booking.user.name}</th>
                    </tr>
                    </tbody>
                </table>
            );
            detailModel = (
                <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.state.showDetail}
                    onRequestClose={this.closeDetail}
                    autoScrollBodyContent={true}
                    contentStyle={styles.dialogStyle}>
                    {detailText}
                </Dialog>
            );
        }

        return (
            <div>
                {detailModel}
                <Paper style={styles.paperStyle} zDepth={1}>
                    <h2 style={styles.headerStyle}>{ManageDate.getReadableDate(this.props.selectedDate)}</h2>
                    {loading}
                    <List>
                        <ReactCSSTransitionGroup
                            transitionName="list-animate"
                            transitionEnterTimeout={500}
                            transitionLeave={false}>
                            {content}
                        </ReactCSSTransitionGroup>
                    </List>
                </Paper>
            </div>
        );
    }
}