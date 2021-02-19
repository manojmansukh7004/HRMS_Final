/* eslint-disable react/no-unused-state */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ActivityIndicator, Alert, Dimensions, ScrollView,
} from 'react-native';
import { Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LineChart } from 'react-native-chart-kit';
import { TextInput, Button, Card } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import Moment from 'moment';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { getDynamicFieldsValues } from '../services/GetDynamicFieldsValues';
import { regulariseAttendance } from '../services/RegulariseAttendance';
import { getAttendenceAnalytics } from '../services/AttendanceAnalytics';


const chartConfig = {
  backgroundGradientFrom: 'white',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'white',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 1, // optional, default 3
  barPercentage: 0.1,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F9F9F9',
    paddingBottom: 10,
    flexGrow: 1
  },
  textInput: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },

  button: {
    width: '48%',
    height: 45,
    borderRadius: 12,
  },
  buttonLabel: { color: 'white', fontSize: 14, textAlign: 'center' },
  buttonContent: { height: 45 },
  activityIndicator: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  cardContainer: { backgroundColor: 'white', height: 20, fontSize: 16 },
  singleCardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 8
  },
  twoCardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 12
  },
  pickers: { height: 30 },
  horizontalContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cardMenuSpasing: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 5
  },
  twoCardsMenuSpacing: {
    flexDirection: 'column',
    paddingStart: 2,
    paddingTop: 10,
    paddingBottom: 10
  },
  twoCards: {
    width: '48%',
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  longText: { backgroundColor: 'white', fontSize: 16, marginEnd: 10 },
  reasonView: { paddingStart: 3, paddingTop: 10, paddingBottom: 10 },
});

class AttendenceRegularizationScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      loading: true,
      date: this.item ? `${this.item.Date.substring(4, 6)}/${this.item.Date.substring(6, 8)}/${this.item.Date.substring(0, 4)}` : '',
      startTime: (this.item.TimeIn !== '00:00') ? Moment(this.item.TimeIn, 'HH:mm').format('hh:mm A') : '',
      endTime: (this.item.TimeOut !== '00:00') ? Moment(this.item.TimeOut, 'HH:mm').format('hh:mm A') : '',
      showTimePicker: false,
      selectedType: this.item.AttendanceCode ? this.item.AttendanceCode : '0',
      attTypeText: '',
      selectedReason: '0',
      reqesting: false,
      isTypeSelected: true,
      isReasonSelected: true,
      reason: '',
      startDateTimePickerVisible: false,
      endDateTimePickerVisible: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
      isStartTime: true,
      isEndTime: true,
      isReasonText: true,
      graphData: null,
    };
    this.startTime = false;
    this.endTime = false;
    this.types = [];
    this.reasons = [];
  }

  async componentDidMount() {
    console.log(this.item);
    const { user } = this.props;
    try {
      const resType = await getDynamicFieldsValues('4', '436', 'ESS_Attendance$[2002AttendanceData]', user);
      console.log(resType);
      const resReason = await getDynamicFieldsValues('4', '435', 'ESS_Attendance$[2002AttendanceData]', user);
      this.types = resType.controlDataValues[0];
      this.reasons = resReason.controlDataValues[0];
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }

    const attDays = [];
    const leaveDays = [];
    const attAnalyticsResponse = await getAttendenceAnalytics(this.props.user);
    const AttAnalytics = attAnalyticsResponse.AttAnalytics[0];
    console.log(AttAnalytics);
    for (let i = 0; i < AttAnalytics.length; i++) {
      attDays.push(AttAnalytics[i].AttDays);
      leaveDays.push(AttAnalytics[i].LeaveDays);
    }
    console.log(leaveDays);
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: attDays,
          color: () => this.props.secondaryColor,
          strokeWidth: 1
        },
        {
          data: leaveDays,
          color: () => this.props.primaryColor,
          strokeWidth: 1
        }
      ],
    };
    console.log(data);
    this.setState({ graphData: data });
  }

showStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: true });

showEndDateTimePicker = () => {
  console.log('sssssssssss');
  this.setState({ endDateTimePickerVisible: true });
};

hideStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: false });

hideEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: false });

handleStartDatePicked = date => {
  if (date) {
    this.setState({
      startTime: this.formatAMPM(new Date(date)),
      isStartTime: true
    });
  }
  this.hideStartDateTimePicker();
};

handleEndDatePicked = date => {
  if (this.item.IsNightShift === '0') {
    const startTime = this.convertTime12to24(this.state.startTime);
    const endTime = this.convertTime12to24(this.formatAMPM(new Date(date)));
    if (Date.parse(`01/01/2020 ${startTime}:00`) > Date.parse(`01/01/2020 ${endTime}:00`)) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'End time must be greater than start time',
        modalType: 'E',
        endDateTimePickerVisible: false
      });
    } else {
      this.setState({
        endTime: this.formatAMPM(new Date(date)),
        isEndTime: true
      });
      this.hideEndDateTimePicker();
    }
  } else {
    this.setState({
      endTime: this.formatAMPM(new Date(date)),
      isEndTime: true
    });
    this.hideEndDateTimePicker();
  }
};


formatAMPM =(date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

 convertTime12to24 = (time12h) => {
   if (time12h) {
     const [time, modifier] = time12h.split(' ');
     let [hours, minutes] = time.split(':');
     if (hours === '12') {
       hours = '00';
     }
     if (modifier === 'PM') {
       hours = parseInt(hours, 10) + 12;
     }
     return `${hours}:${minutes}`;
   }
   return '';
 }

 tConv24 = (time24) => {
   let ts = time24;
   const H = +ts.substr(0, 2);
   let h = (H % 12) || 12;
   h = (h < 10) ? (`0${h}`) : h;
   const ampm = H < 12 ? ' AM' : ' PM';
   ts = h + ts.substr(2, 3) + ampm;
   return ts;
 };

onModalHide = () => {
  if (this.state.modalType === 'S') {
    this.props.navigation.goBack();
    this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
  }
}

  onTypeSelected = (itemValue) => {
    if (itemValue === '0') {
      this.setState({ selectedType: '', attTypeText: '', isTypeSelected: false });
    } else {
      this.setState({
        selectedType: itemValue,
        attTypeText: this.types.find(value => value.Value === itemValue).Text,
        isTypeSelected: true
      });
    }
  }

  onReasonSelected = value => {
    if (value === '0') {
      this.setState({ selectedReason: '', isReasonSelected: false });
    } else {
      this.setState({ selectedReason: value, isReasonSelected: true });
    }
  }

  onPressSubmit =async () => {
    const {
      selectedType, startTime, endTime, selectedReason, date, attTypeText
    } = this.state;
    console.log('Att', attTypeText);
    const reason = selectedReason === 'Other' ? this.state.reason : selectedReason;

    if (selectedType === '' && startTime === '' && endTime === '' && reason === null) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please fill *Required fields details',
        modalType: 'E',
        isTypeSelected: false,
        isStartTime: false,
        isEndTime: false,
        isReasonSelected: false
      });
    } else if (selectedType === '' || selectedType === 0) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select Regularization type',
        modalType: 'E',
        isTypeSelected: false
      });
    } else if (startTime === '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select start time',
        modalType: 'E',
        isStartTime: false
      });
    } else if (endTime === '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select end time',
        modalType: 'E',
        isEndTime: false
      });
    } else {
      try {
        if (reason) {
          this.setState({ reqesting: true });
          const response = await regulariseAttendance(date, selectedType, attTypeText, startTime, endTime, reason, this.props.user);
          if (response.SuccessList) {
            this.setState({ reqesting: false });
            console.log('Reg', response.SuccessList);
            const msg = getMessage(response.SuccessList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type
              });
            } else if (response.SuccessList) {
              Alert.alert('', response.SuccessList.toString());
            } else {
              Alert.alert('', 'Your application has been submitted');
            }
          } else if (response.ErrorList) {
            this.setState({ reqesting: false });
            const msg = getMessage(response.ErrorList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type
              });
            } else if (response.SuccessList) {
              Alert.alert('', response.SuccessList.toString());
            } else {
              Alert.alert('', 'Failed to submit.');
            }
          }
          this.setState({ reqesting: false });
        } else {
          this.setState({ isReasonSelected: false });

          this.setState({
            isModalVisible: true,
            modalMessage: 'Please select/enter a valid reason',
            modalType: 'E'
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Network', error);
        this.setState({ reqesting: false });
      }
    }
  }

  render() {
    const {
      date, isTypeSelected
    } = this.state;
    const { secondaryColor } = this.props;
    if (this.state.loading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }
    Moment.locale('en');
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <MessageModal
          isVisible={this.state.isModalVisible}
          message={this.state.modalMessage}
          type={this.state.modalType}
          hideModal={() => this.setState({ isModalVisible: false })}
          onModalHide={() => this.onModalHide()}
        />
        <DateTimePicker
          isVisible={this.state.startDateTimePickerVisible}
          onConfirm={this.handleStartDatePicked}
          onCancel={this.hideStartDateTimePicker}
          mode="time"
          minuteInterval={5}
          is24Hour={false}
          date={new Date()}
        />

        <DateTimePicker
          isVisible={this.state.endDateTimePickerVisible}
          onConfirm={this.handleEndDatePicked}
          onCancel={this.hideEndDateTimePicker}
          mode="time"
          is24Hour={false}
          minuteInterval={5}
          date={new Date()}
        />

        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.singleCardLabel, { color: secondaryColor }]}>Regularization Type</Text>
            <Picker
              mode="dropdown"
              selectedValue={this.state.selectedType}
              style={styles.pickers}
              // enabled={this.item.AttStatus !== 'MissingPunches'}
              onValueChange={(itemValue) => this.onTypeSelected(itemValue)}
            >
              <Picker.Item label="Select Type" value="0" />
              {this.types.map(value => <Picker.Item key={value.Value} label={value.Text} value={value.Value} />)}
            </Picker>
          </View>
        </Card>
        {isTypeSelected ? null : <Text style={{ color: 'red', textAlign: 'right' }}>*Required</Text>}

        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>From Date</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                defaultValue={date}
                selectionColor={this.props.secondaryColor}
                value={date ? Moment(date).format('DD-MMM-YYYY') : ''}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>To Date</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                selectionColor={this.props.secondaryColor}
                defaultValue={date}
                value={date ? Moment(date).format('DD-MMM-YYYY') : ' '}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>Punch In Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                selectionColor={this.props.secondaryColor}
                underlineColor="transparent"
                numberOfLines={1}
                defaultValue={this.item.TimeIn === '00:00' ? this.item.TimeIn : this.tConv24(this.item.TimeIn)}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>Punch Out Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                selectionColor={this.props.secondaryColor}
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                defaultValue={this.item.TimeOut === '00:00' ? this.item.TimeOut : this.tConv24(this.item.TimeOut)}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards} onPress={this.showStartDateTimePicker}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>Start Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                placeholder="Start Time"
                selectionColor={this.props.secondaryColor}
                underlineColor="transparent"
                numberOfLines={1}
                defaultValue={this.state.startTime}
                value={this.state.startTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards} onPress={this.showEndDateTimePicker}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>End Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                placeholder="End Time"
                underlineColor="transparent"
                selectionColor={this.props.secondaryColor}
                numberOfLines={1}
                defaultValue={this.state.endTime}
                value={this.state.endTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '48%', marginEnd: 10, flex: 1 }}>
            {!this.state.isStartTime ? <Text style={{ color: 'red', textAlign: 'right' }}>*Required</Text> : null}
          </View>
          <View style={{ width: '48%', marginEnd: 3, flex: 1 }}>
            {!this.state.isEndTime ? <Text style={{ color: 'red', textAlign: 'right' }}>*Required</Text> : null}
          </View>
        </View>

        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.singleCardLabel, { color: secondaryColor }]}>Reason of Regularization</Text>
            <Picker
              mode="dropdown"
              selectedValue={this.state.selectedReason}
              style={styles.pickers}
              onValueChange={(itemValue) => this.onReasonSelected(itemValue)}
            >
              <Picker.Item label="Select Reason" value="0" />
              {this.reasons.map(value => <Picker.Item key={value.Value} label={value.Text} value={value.Value} />)}
            </Picker>
          </View>
        </Card>
        {
          this.state.selectedReason === 'Other'
            ? (
              <Card style={styles.cards}>
                <View style={styles.reasonView}>
                  <Text style={[styles.twoCardLabel, { color: secondaryColor }]}>Remarks</Text>
                  <TextInput
                    mode="flat"
                    underlineColor="transparent"
                    multiline
                    placeholder="Enter Reason"
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"
                    keyboardType="default"
                    autoFocus={false}
                    maxLength={250}
                    dense
                    selectionColor={this.props.secondaryColor}
                    value={this.state.reason}
                    onChangeText={reason => this.setState({ reason, isReasonSelected: true })}
                    numberOfLines={5}
                    style={styles.longText}
                  />
                </View>
              </Card>
            ) : null
        }

        {!this.state.isReasonSelected ? <Text style={{ color: 'red', textAlign: 'right' }}>*Required</Text> : null}

        <View style={styles.buttonContainer}>
          <Button
            loading={this.state.reqesting}
            disabled={this.state.reqesting}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            mode="contained"
            color={this.props.primaryColor}
            uppercase
            onPress={() => this.onPressSubmit()}
          >
            Submit
          </Button>
          <Button
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            mode="contained"
            disabled={this.state.reqesting}
            color={this.props.secondaryColor}
            uppercase
            onPress={() => this.props.navigation.goBack()}
          >
            Discard
          </Button>
        </View>

        {
  this.state.graphData && (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <LineChart
        data={this.state.graphData}
        withDots
        withHiddenDots
        withInnerLines={false}
        withOuterLines={false}
        withShadow
        width={Dimensions.get('window').height}
        height={220}
        fromZero
        chartConfig={chartConfig}
      />
    </ScrollView>
  )
}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  messages: state.messageData.messages,
});

export default connect(
  mapStateToProps,
)(AttendenceRegularizationScreen);
