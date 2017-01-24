/**
 * Created by Razi on 12/24/2016.
 */

import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
    }

    handleChangeDate(event, date) {
        this.props.handleChangeDate(date);
    }

    handleChangeTime(event, time) {
        this.props.handleChangeTime(time);
    }

    render() {
        const styles = {
            paperStyle: {
                paddingTop: 26,
                paddingRight: 26,
                paddingBottom: 10,
                paddingLeft: 26,
                marginLeft: 5,
                marginRight: 5
            },
            datePickerSpace: {
                marginBottom: 7
            },
            pleaseSelectStyle: {
                fontSize: 13,
                fontWeight: "bold"
            }
        };

        let minDate = new Date();
        let maxDate = new Date();
        maxDate.setDate(maxDate.getDate()+180);

        return (
            <Row>
                <Col xs={12} sm={10} smOffset={1} md={6} mdOffset={3}>
                    <Paper style={styles.paperStyle} zDepth={1}>
                        <Row center="xs">
                            <Col style={styles.datePickerSpace} xs={12} sm={6}>
                                <div style={styles.pleaseSelectStyle}>Please select date</div>
                                <DatePicker
                                    id="date-picker"
                                    onChange={this.handleChangeDate}
                                    className="date-picker"
                                    disableYearSelection={true}
                                    defaultDate={new Date()}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <div style={styles.pleaseSelectStyle}>Please select time</div>
                                <TimePicker
                                    id="time-picker"
                                    format="24hr"
                                    onChange={this.handleChangeTime}
                                    defaultTime={new Date()}
                                />
                            </Col>
                        </Row>
                    </Paper>
                </Col>
            </Row>
        );
    }
}