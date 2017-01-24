/**
 * Created by Razi on 12/25/2016.
 */

import React from 'react';
import axios from 'axios';
import {Row, Col} from 'react-flexbox-grid';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {cyan500} from 'material-ui/styles/colors';
import ReservationStage3 from './ReservationStage3';
import ManageDate from '../funtions/ManageDate';
import config from '../../config';

export default class ReservationStage2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: ManageDate.getReadableDate(this.props.selectedDate),
            selectedTime: ManageDate.getReadableTime(this.props.selectedTime),
            duration: '',
            repeat: false,
            repeatCount: 1,
            repeatType: 1,
            repeatOccurrences: 1,
            title: '',
            categoryList: [],
            category: 1,
            description: '',
            nrp: '',
            name: '',
            email: '',
            phone: '',
            errorDuration: '',
            errorTitle: '',
            errorNrp: '',
            errorName: '',
            errorEmail: '',
            errorPhone: '',
            flagDuration: false,
            flagTitle: false,
            flagNrp: false,
            flagName: false,
            flagEmail: false,
            flagPhone: false,
            isUserFound: false,
            userId: '',
            openDialogSubmit: false,
            isLoadingSubmit: false,
            stage2: true
        };

        this.handleOnChangeDuration = this.handleOnChangeDuration.bind(this);
        this.handleOnToggleRepeat = this.handleOnToggleRepeat.bind(this);
        this.handleOnChangeRepeatCount = this.handleOnChangeRepeatCount.bind(this);
        this.handleOnBlurRepeatCount = this.handleOnBlurRepeatCount.bind(this);
        this.handleOnChangeRepeatType = this.handleOnChangeRepeatType.bind(this);
        this.handleOnChangeRepeatOccurrences = this.handleOnChangeRepeatOccurrences.bind(this);
        this.handleOnBlurRepeatOccurrences = this.handleOnBlurRepeatOccurrences.bind(this);

        this.handleOnChangeTitle = this.handleOnChangeTitle.bind(this);
        this.handleOnChangeCategory = this.handleOnChangeCategory.bind(this);
        this.handleOnChangeDescription = this.handleOnChangeDescription.bind(this);
        this.handleOnChangeNRP = this.handleOnChangeNRP.bind(this);
        this.handleOnChangeName = this.handleOnChangeName.bind(this);
        this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
        this.handleOnChangePhone = this.handleOnChangePhone.bind(this);
        this.handleOpenDialogSubmit = this.handleOpenDialogSubmit.bind(this);
        this.handleCloseDialogSubmit = this.handleCloseDialogSubmit.bind(this);

        this.doReserveUser = this.doReserveUser.bind(this);
    }

    componentWillMount() {
        this.getCategory();
    }

    handleOnChangeDuration(e) {
        const durationPattern = /^\d+$/;
        let input = e.target.value;
        let maxDuration = 720;
        if (this.props.maxDuration !== null) {
            maxDuration = this.props.maxDuration;
        }

        if (input.length === 0) {
            this.setState({
                duration: '',
                errorDuration: '*Required',
                flagDuration: false
            });
        }
        else if (durationPattern.test(input)) {
            input = parseInt(input, 10);
            if (input === 0) {
                this.setState({
                    duration: 1,
                    errorDuration: '',
                    flagDuration: true
                }, () => this.checkConflict());
            }
            else if (input > maxDuration) {
                this.setState({
                    duration: maxDuration,
                    errorDuration: '',
                    flagDuration: true
                }, () => this.checkConflict());
            }
            else {
                this.setState({
                    duration: input,
                    errorDuration: '',
                    flagDuration: true
                }, () => this.checkConflict());
            }
        }
    }

    handleOnToggleRepeat(e) {
        if (e.target.checked === true) {
            this.setState({
                repeat: true
            });
        }
        else {
            this.setState({
                repeat: false
            });
        }
    }

    handleOnChangeRepeatCount(e) {
        let maxRepeatCount = config.MAX_REPEAT.COUNT_DAY;
        if (this.state.repeatType === 2)
            maxRepeatCount = config.MAX_REPEAT.COUNT_WEEK;
        else if (this.state.repeatType === 3)
            maxRepeatCount = config.MAX_REPEAT.COUNT_MONTH;

        const repeatCountPattern = /^\d+$/;
        let input = e.target.value;

        if (input.length === 0) {
            this.setState({
                repeatCount: ''
            });
        }
        else if (repeatCountPattern.test(input)) {
            input = parseInt(input, 10);
            let result = input;
            if (input === 0) {
                result = 1;
            }
            else if (input > maxRepeatCount) {
                result = maxRepeatCount;
            }
            this.setState({
                repeatCount: result
            }, () => this.checkConflict());
        }
    }

    handleOnBlurRepeatCount(e) {
        const input = e.target.value;
        if (input.length === 0) {
            this.setState({
                repeatCount: 1
            });
        }
    }

    // TODO check conflict if repeat type change
    handleOnChangeRepeatType(e, i, value) {
        this.setState({
            repeatType: value
        });
        if (value === 2) {
            if (this.state.repeatCount > config.MAX_REPEAT.COUNT_WEEK) {
                this.setState({
                    repeatCount: config.MAX_REPEAT.COUNT_WEEK
                });
            }
            if (this.state.repeatOccurrences > config.MAX_REPEAT.OCCURRENCES_WEEK) {
                this.setState({
                    repeatOccurrences: config.MAX_REPEAT.OCCURRENCES_WEEK
                });
            }
        }
        else if (value === 3) {
            if (this.state.repeatCount > config.MAX_REPEAT.COUNT_MONTH) {
                this.setState({
                    repeatCount: config.MAX_REPEAT.COUNT_MONTH
                });
            }
            if (this.state.repeatOccurrences > config.MAX_REPEAT.OCCURRENCES_MONTH) {
                this.setState({
                    repeatOccurrences: config.MAX_REPEAT.OCCURRENCES_MONTH
                });
            }
        }
    }

    handleOnChangeRepeatOccurrences(e) {
        let maxRepeatOccurrences = config.MAX_REPEAT.OCCURRENCES_DAY;
        if (this.state.repeatType === 2)
            maxRepeatOccurrences = config.MAX_REPEAT.OCCURRENCES_WEEK;
        else if (this.state.repeatType === 3)
            maxRepeatOccurrences = config.MAX_REPEAT.OCCURRENCES_MONTH;

        const repeatOccurrencesPattern = /^\d+$/;
        let input = e.target.value;

        if (input.length === 0) {
            this.setState({
                repeatOccurrences: ''
            });
        }
        else if (repeatOccurrencesPattern.test(input)) {
            input = parseInt(input, 10);
            let result = input;

            if (input === 0) {
                result = 1;
            }
            else if (input > maxRepeatOccurrences) {
                result = maxRepeatOccurrences;
            }
            console.log("here");
            this.setState({
                repeatOccurrences: result
            }, () => this.checkConflict());
        }
    }

    handleOnBlurRepeatOccurrences(e) {
        const input = e.target.value;
        if (input.length === 0) {
            this.setState({
                repeatOccurrences: 1
            });
        }
    }

    checkConflict() {
        if (this.state.repeat === true) {
            const selectedDate = this.props.selectedDate;
            const selectedTime = this.props.selectedTime;
            const year = selectedDate.getFullYear();
            const month = ManageDate.pad(selectedDate.getMonth() + 1, 2);
            const date = ManageDate.pad(selectedDate.getDate(), 2);
            const hour = ManageDate.pad(selectedTime.getHours(), 2);
            const minute = ManageDate.pad(selectedTime.getMinutes(), 2);
            const startTime = year + "-" + month + "-" + date + "T" + hour + ":" + minute + ":00";

            let duration = this.state.duration;
            if (duration.length === 0) {
                duration = 1;
            }

            const data = {
                'start': startTime,
                'duration': duration * 60,
                'repeated': this.state.repeatType,
                'repeated_every': this.state.repeatCount,
                'repeated_end_after': this.state.repeatOccurrences
            };
            axios({
                method: 'post',
                url: config.API_SERVER + 'schedules/conflict',
                timeout: 10000,
                data: data,
            }).then(function (response) {
                console.log(response);
            });
        }
    }

    handleOnChangeTitle(e) {
        const input = e.target.value;
        if (input.length === 0) {
            this.setState({
                title: '',
                errorTitle: '*Required',
                flagTitle: false
            });
        }
        else {
            this.setState({
                title: input,
                errorTitle: '',
                flagTitle: true
            });
        }
    }

    handleOnChangeCategory(e, i, value) {
        this.setState({
            category: value
        });
    }

    handleOnChangeDescription(e) {
        const input = e.target.value;
        this.setState({
            description: input
        });
    }

    handleOnChangeNRP(e) {
        const phonePattern = /^[\d]{10,18}$/;
        const input = e.target.value;
        if (!phonePattern.test(input)) {
            this.setState({
                nrp: input,
                errorNrp: '*Enter a valid NRP',
                flagNrp: false
            });
        }
        else {
            this.setState({
                nrp: input,
                errorNrp: '',
                flagNrp: true
            }, () => this.getUserData(input));
        }
    }

    handleOnChangeName(e) {
        const input = e.target.value;
        if (input.length === 0) {
            this.setState({
                name: input,
                errorName: '*Required',
                flagName: false
            });
        }
        else {
            this.setState({
                name: input,
                errorName: '',
                flagName: true
            });
        }
    }

    handleOnChangeEmail(e) {
        const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;
        const input = e.target.value;
        if (!emailPattern.test(input)) {
            this.setState({
                email: input,
                errorEmail: '*Enter a valid email',
                flagEmail: false
            });
        }
        else {
            this.setState({
                email: input,
                errorEmail: '',
                flagEmail: true
            });
        }
    }

    handleOnChangePhone(e) {
        const phonePattern = /^[+0][\d]{8,}$/;
        const input = e.target.value;
        if (!phonePattern.test(input)) {
            this.setState({
                phone: input,
                errorPhone: '*Enter a valid phone number',
                flagPhone: false
            });
        }
        else {
            this.setState({
                phone: input,
                errorPhone: '',
                flagPhone: true
            });
        }
    }

    getCategory() {
        axios({
            url: config.API_SERVER + 'types',
            timeout: 10000,
            method: 'get',
        }).then(function (response) {
            this.setState({
                categoryList: response.data,
            });
        }.bind(this));
    }

    getUserData(nrp) {
        axios({
            method: 'get',
            url: config.API_SERVER + 'users/nrp_nip/' + nrp,
            timeout: 10000
        }).then(function (response) {
            console.log(response);
            if (response.data[0] === undefined) {
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                    phone: response.data.hp,
                    errorName: '',
                    errorEmail: '',
                    errorPhone: '',
                    flagName: true,
                    flagEmail: true,
                    flagPhone: true,
                    isUserFound: true,
                    userId: response.data.id
                });
            }
            else {
                this.setState({
                    isUserFound: false,
                    userId: ''
                });
            }
        }.bind(this));
    }

    doReserveUser() {
        this.setState({
            isLoadingSubmit: true,
            stage2: false
        });
        this.doReserveBooking(1).bind(this);

        // if(this.state.isUserFound === true) {
        //     this.doReserveBooking(this.state.userId).bind(this);
        // }
        // else {
        //     const data = {
        //         'name': this.state.name,
        //         'email': this.state.email,
        //         'hp': this.state.phone,
        //         'nrp_nip': this.state.nrp,
        //         'password': "",
        //         'is_admin': false
        //     };
        //     axios({
        //         method: 'post',
        //         url: config.API_SERVER + 'users',
        //         timeout: 10000,
        //         data: data,
        //     }).then(function (response) {
        //         this.doReserveBooking(response.data.id).bind(this);
        //     }.bind(this));
        // }
    }

    doReserveBooking(user_id) {
        this.doReserveSchedule(1).bind(this);
        // const data = {
        //     'user_id': user_id,
        //     'validation_by': "0",
        //     'type_id': this.state.category,
        //     'title': this.state.title,
        //     'description': this.state.description,
        // };
        // axios({
        //     method: 'post',
        //     url: config.API_SERVER + 'bookings',
        //     timeout: 10000,
        //     data: data,
        // }).then(function (response) {
        //     this.doReserveSchedule(response.data.id).bind(this);
        // }.bind(this));
    }

    doReserveSchedule(booking_id) {
        this.setState({
            isLoadingSubmit: false
        });
        // var tmp = this.state.dateString.split(['***']);
        // var tmp2 = tmp[0].split('/');
        // var date = tmp2[2] + '-' + tmp2[1] + '-' + tmp2[0] + 'T' + tmp[1] + ':00';
        //
        // let repeated = "0";
        // let repeated_every = "1";
        // let repeated_end_after = "1";
        //
        // if (this.state.repeat.isChecked === true) {
        //     repeated = this.state.repeat.type.toString();
        //     repeated_every = this.state.repeat.count.toString();
        //     repeated_end_after = this.state.repeat.occurrences.toString();
        // }
        //
        // const data = {
        //     'booking_id': booking_id,
        //     'start': date,
        //     'duration': (parseInt(this.state.duration) * 60).toString(),
        //     'repeated': repeated,
        //     'repeated_every': repeated_every,
        //     'repeated_end_after': repeated_end_after,
        // };
        // axios({
        //     method: 'post',
        //     url: config.API_SERVER + 'schedules',
        //     timeout: 10000,
        //     data: data,
        // }).then(function (response) {
        //     console.log("RESPONSE dari server" + response);
        //     // this.doReserveSchedule().bind(this);
        // }.bind(this));
    }

    handleOpenDialogSubmit() {
        this.setState({
            openDialogSubmit: true
        });
    }

    handleCloseDialogSubmit() {
        this.setState({
            openDialogSubmit: false
        });
    }

    render() {
        const styles = {
            paperStyle: {
                padding: 30,
                marginLeft: 5,
                marginRight: 5
            },
            headerStyle: {
                margin: 0,
                overflow: "hidden"
            },
            labelInputStyle: {
                paddingTop: 40,
                height: 72,
            },
            repeatType: {
                paddingTop: 24,
            },
            inputStyle: {
                fontWeight: "bold",
                color: cyan500
            },
            tableConfirmationStyle: {
                textAlign: "left"
            }
        };

        const categoryList = this.state.categoryList.map(function (category) {
            return (
                <MenuItem key={category.id} value={category.id} primaryText={category.name}/>
            );
        });

        let repeatForm = '';
        if (this.state.repeat === true) {
            repeatForm = (
                <div>
                    <Row>
                        <Col xs={6} sm={3}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Repeat every"
                                value={this.state.repeatCount}
                                onChange={this.handleOnChangeRepeatCount}
                                onBlur={this.handleOnBlurRepeatCount}
                            />
                        </Col>
                        <Col xs={6} sm={4} md={3}>
                            <SelectField
                                fullWidth={true}
                                value={this.state.repeatType}
                                style={styles.repeatType}
                                onChange={this.handleOnChangeRepeatType}
                                onBlur={this.handleOnChangeRepeatType}>
                                <MenuItem value={1} primaryText="Daily"/>
                                <MenuItem value={2} primaryText="Week"/>
                                <MenuItem value={3} primaryText="Month"/>
                            </SelectField>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={4} md={2}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="End after"
                                value={this.state.repeatOccurrences}
                                onChange={this.handleOnChangeRepeatOccurrences}
                                onBlur={this.handleOnBlurRepeatOccurrences}
                            />
                        </Col>
                        <Col xs={6} style={styles.labelInputStyle}>
                            occurrences
                        </Col>
                    </Row>
                </div>
            )
        }

        let submitDisable = true;
        if (this.state.flagDuration === true && this.state.flagTitle === true &&
            this.state.flagNrp === true && this.state.flagName === true &&
            this.state.flagEmail === true && this.state.flagPhone === true) {
            submitDisable = false;
        }

        const actions = [
            <FlatButton
                label="Back"
                secondary={true}
                onTouchTap={this.handleCloseDialogSubmit}
            />,
            <FlatButton
                label="Reserve"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.doReserveUser}
            />,
        ];

        let repeatDetail = "No";
        if (this.state.repeat === true) {
            repeatDetail = "Yes";
            let repeatType = "days";
            if (this.state.repeatType === 2) repeatType = "weeks";
            else if (this.state.repeatType === 3) repeatType = "months";
            repeatDetail = repeatDetail + ". Every " + this.state.repeatCount + " " + repeatType + ".";
            repeatDetail = repeatDetail + " End after " + this.state.repeatOccurrences + " occurrences.";
        }

        let categoryName = '';
        if (this.state.categoryList[this.state.category - 1] !== undefined)
            categoryName = this.state.categoryList[this.state.category - 1].name;

        let categoryNameDetail = <div></div>;
        if (categoryName.length > 0) {
            categoryNameDetail = (
                <tr>
                    <th>Category</th>
                    <th>: {categoryName}</th>
                </tr>
            );
        }

        let descriptionDetail = '';
        if (this.state.description.length > 0) {
            descriptionDetail = (
                <tr>
                    <th>Description</th>
                    <th>: {this.state.description}</th>
                </tr>
            )
        }

        const reservationDetail = (
            <table style={styles.tableConfirmationStyle}>
                <tbody>
                <tr>
                    <td colSpan="2">Reservation Detail</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <th>: {this.state.selectedDate}</th>
                </tr>
                <tr>
                    <th>Time</th>
                    <th>: {this.state.selectedTime}</th>
                </tr>
                <tr>
                    <th>Duration</th>
                    <th>: {this.state.duration} minutes</th>
                </tr>
                <tr>
                    <th>Repeat</th>
                    <th>: {repeatDetail}</th>
                </tr>
                <tr>
                    <th>Title</th>
                    <th>: {this.state.title}</th>
                </tr>
                {categoryNameDetail}
                {descriptionDetail}
                <tr><br/></tr>
                <tr>
                    <td colSpan="2">Contact Person</td>
                </tr>
                <tr>
                    <th>NRP</th>
                    <th>: {this.state.nrp}</th>
                </tr>
                <tr>
                    <th>Name</th>
                    <th>: {this.state.name}</th>
                </tr>
                <tr>
                    <th>Email</th>
                    <th>: {this.state.email}</th>
                </tr>
                <tr>
                    <th>Phone</th>
                    <th>: {this.state.phone}</th>
                </tr>
                </tbody>
            </table>
        );

        let stage = <div></div>;
        if (this.state.stage2 === false) {
            stage = (
                <div>
                    <ReservationStage3
                        isLoadingSubmit={this.state.isLoadingSubmit}
                        goToStageOne={this.props.prevStage}
                    />
                </div>
            );
        }
        else {
            stage = (
                <ReactCSSTransitionGroup
                    transitionName="container-animate"
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <Col xs={12} smOffset={2} sm={8} mdOffset={3} md={6}>
                            <Paper style={styles.paperStyle} zDepth={1}>
                                {/*Form Reservation Detail Start*/}
                                <h3 style={styles.headerStyle}>Reservation Details</h3>
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Date"
                                    floatingLabelFixed={true}
                                    disabled={true}
                                    inputStyle={styles.inputStyle}
                                    value={this.state.selectedDate}
                                />
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Time"
                                    floatingLabelFixed={true}
                                    disabled={true}
                                    inputStyle={styles.inputStyle}
                                    value={this.state.selectedTime}
                                />
                                <Row>
                                    <Col xs={6} sm={4} md={2}>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText="Duration"
                                            value={this.state.duration}
                                            errorText={this.state.errorDuration}
                                            onChange={this.handleOnChangeDuration}
                                            onBlur={this.handleOnChangeDuration}
                                        />
                                    </Col>
                                    <Col xs={6} style={styles.labelInputStyle}>
                                        minutes
                                    </Col>
                                </Row>
                                <br/><br/>
                                <Row>
                                    <Col xs={4} sm={2}>
                                        <Toggle
                                            label="Repeat"
                                            labelPosition="right"
                                            onToggle={this.handleOnToggleRepeat}
                                        />
                                    </Col>
                                </Row>
                                {repeatForm}
                                <br/><br/>

                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Title"
                                    floatingLabelFixed={true}
                                    hintText="eg. Kelas PAA 1 B 2016"
                                    value={this.state.title}
                                    errorText={this.state.errorTitle}
                                    onChange={this.handleOnChangeTitle}
                                    onBlur={this.handleOnChangeTitle}
                                />
                                <SelectField
                                    fullWidth={true}
                                    floatingLabelText="Category"
                                    value={this.state.category}
                                    onChange={this.handleOnChangeCategory}>
                                    {categoryList}
                                </SelectField>
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Description"
                                    multiLine={true}
                                    rows={2}
                                    rowsMax={4}
                                    value={this.state.description}
                                    onChange={this.handleOnChangeDescription}
                                    onBlur={this.handleOnChangeDescription}
                                />
                                <br/><br/><br/>
                                {/*Form Reservation Detail End*/}

                                {/*Form Contact Person Start*/}
                                <h3 style={styles.headerStyle}>Contact Person</h3>
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="NRP"
                                    value={this.state.nrp}
                                    errorText={this.state.errorNrp}
                                    onChange={this.handleOnChangeNRP}
                                    onBlur={this.handleOnChangeNRP}
                                />
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Name"
                                    value={this.state.name}
                                    errorText={this.state.errorName}
                                    onChange={this.handleOnChangeName}
                                    onBlur={this.handleOnChangeName}
                                />
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Email"
                                    value={this.state.email}
                                    errorText={this.state.errorEmail}
                                    onChange={this.handleOnChangeEmail}
                                    onBlur={this.handleOnChangeEmail}
                                />
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Phone Number"
                                    value={this.state.phone}
                                    errorText={this.state.errorPhone}
                                    onChange={this.handleOnChangePhone}
                                    onBlur={this.handleOnChangePhone}
                                />
                                <br/><br/><br/>
                                {/*Form Contact Person End*/}

                                {/*Submit and Cancel button start*/}
                                <Row>
                                    <Col xs={12}>
                                        <Row between="xs">
                                            <RaisedButton
                                                label="Cancel"
                                                secondary={true}
                                                onTouchTap={this.props.prevStage}
                                            />
                                            <RaisedButton
                                                label="Submit"
                                                primary={true}
                                                disabled={false}
                                                onTouchTap={this.handleOpenDialogSubmit}
                                            />
                                        </Row>
                                    </Col>
                                </Row>
                                <Dialog
                                    title="Confirm the Reservation"
                                    actions={actions}
                                    modal={false}
                                    open={this.state.openDialogSubmit}
                                    onRequestClose={this.handleCloseDialogSubmit}>
                                    {reservationDetail}
                                </Dialog>
                                {/*Submit and Cancel button end*/}
                            </Paper>
                            <br/><br/><br/><br/>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            );
        }

        return (
            <div>
                {stage}
            </div>
        );
    }
}