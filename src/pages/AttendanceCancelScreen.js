/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Text, View, ScrollView, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { connect } from 'react-redux';
import Moment from 'moment';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { cancelPullOutAtt } from '../services/AttCancelPullOutService';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F9F9F9',
    flexGrow: 1
  },
  button: {
    height: 45,
    width: '48%',
    borderRadius: 12
  },

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
  cardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 12
  },
  twoCardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 12
  },
  buttonContent: { height: 45 },
  buttonLabel: { color: 'white', fontSize: 16, textAlign: 'center' },
  pickers: { height: 20 },
  horizontalContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  errorMsg: { color: 'red', textAlign: 'right', marginEnd: 10 },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20
  },
  cardMenuSpasing: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 3
  },
  twoCardsMenuSpacing: {
    flexDirection: 'column',
    paddingStart: 3,
    paddingTop: 10,
    paddingBottom: 10
  },
  twoCards: {
    width: '48%',
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  // longText: { backgroundColor: 'white', fontSize: 16, marginEnd: 10 },
  longText: {
    color: 'gray', fontSize: 16, paddingStart: 12, paddingEnd: 12
  },
  reasonView: { paddingStart: 6, paddingTop: 10, paddingBottom: 10 },
  inputBackground: { backgroundColor: 'white', marginEnd: 10 },
});

class AttendanceCancelScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      regType: '',
      fromDate: '',
      toDate: '',
      punchInTime: '',
      punchOutTime: '',
      startTime: '00:00',
      endTime: '00:00',
      cancelReason: '',
      regularizationReason: '',
      noOfDays: '',
      loading: true,
      requesting: false,
      isError: false,
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    try {
      const resData = await getDynamicFieldsData('5', this.item.ProcessIdFromTable, 'ESS_Attendance_Cancellation$[2002AttendanceData]', user);
      const attCancelData = resData.controlDataValues[0];
      for (let i = 0; i < attCancelData.length; i++) {
        if (attCancelData[i].fieldDB === 'AttendanceCode') {
          this.setState({ regType: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'StartDate') {
          this.setState({ fromDate: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'EndDate') {
          this.setState({ toDate: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'AbsenceDays') {
          this.setState({ noOfDays: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'Remarks') {
          this.setState({ regularizationReason: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'StartTime') {
          this.setState({ startTime: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'EndTime') {
          this.setState({ endTime: attCancelData[i].fieldValue });
        } else if (attCancelData[i].fieldDB === 'PunchInTime') {
          this.setState({ punchInTime: attCancelData[i].fieldValue ? attCancelData[i].fieldValue : '00:00' });
        } else if (attCancelData[i].fieldDB === 'PunchOutTime') {
          this.setState({ punchOutTime: attCancelData[i].fieldValue ? attCancelData[i].fieldValue : '00:00' });
        }
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  }

  onPressSubmit =async () => {
    Moment.locale('en');
    try {
      const date = Moment(this.state.fromDate).format('YYYY-MM-DD');
      console.log(date);
      if (this.state.cancelReason) {
        this.setState({ requesting: true });
        const response = await cancelPullOutAtt(this.props.user, this.item.UwlId, date);
        if (response.SuccessList) {
          const msg = getMessage(response.SuccessList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type,
              requesting: false
            });
          } else if (response.SuccessList) {
            Alert.alert('', response.SuccessList.toString());
          } else {
            Alert.alert('', 'Your application has been submitted');
          }
        } else if (response.ErrorList) {
          const msg = getMessage(response.ErrorList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type,
              requesting: false
            });
          } else if (response.SuccessList) {
            Alert.alert('', response.SuccessList.toString());
          } else {
            Alert.alert('', 'Failed to submit application');
          }
        }
        this.setState({ requesting: false });
      } else {
        this.setState({
          isError: true
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      this.setState({ requesting: false });
    }
  }

  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
    }
  }

  render() {
    Moment.locale('en');
    const {
      regType, fromDate, toDate, punchInTime, punchOutTime, startTime, endTime, regularizationReason, noOfDays
    } = this.state;

    const {secondaryColor}=this.props;
    if (this.state.loading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <MessageModal
          isVisible={this.state.isModalVisible}
          message={this.state.modalMessage}
          type={this.state.modalType}
          hideModal={() => this.setState({ isModalVisible: false })}
          onModalHide={() => this.onModalHide()}
        />
        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.cardLabel,{color:secondaryColor}]}>Regularization Type</Text>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              includeFontPadding={false}
              editable={false}
              disabled
              value={regType}
              selectionColor={this.props.secondaryColor}
              style={styles.cardContainer}
            />
          </View>
        </Card>
        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>From Date</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                selectionColor={this.props.secondaryColor}
                value={fromDate ? Moment(fromDate).format('DD-MMM-YYYY') : ''}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>To Date</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                selectionColor={this.props.secondaryColor}
                underlineColor="transparent"
                numberOfLines={1}
                value={toDate ? Moment(toDate).format('DD-MMM-YYYY') : ''}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>Punch In Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                selectionColor={this.props.secondaryColor}
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                value={punchInTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>Punch Out Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                selectionColor={this.props.secondaryColor}
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                value={punchOutTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <View style={styles.horizontalContainer}>
          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>Start Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                disabled
                underlineColor="transparent"
                numberOfLines={1}
                defaultValue={startTime}
                selectionColor={this.props.secondaryColor}
                value={startTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>

          <Card style={styles.twoCards}>
            <View style={styles.twoCardsMenuSpacing}>
              <Text style={[styles.twoCardLabel,{color:secondaryColor}]}>End Time</Text>
              <TextInput
                editable={false}
                mode="flat"
                underlineColor="transparent"
                numberOfLines={1}
                selectionColor={this.props.secondaryColor}
                disabled
                defaultValue={endTime}
                value={endTime}
                style={styles.cardContainer}
              />
            </View>
          </Card>
        </View>

        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.cardLabel,{color:secondaryColor}]}>No. Of Days</Text>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              autoFocus={false}
              includeFontPadding={false}
              editable={false}
              selectionColor={this.props.secondaryColor}
              disabled
              value={noOfDays}
              style={styles.cardContainer}
            />
          </View>
        </Card>

        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.cardLabel,{color:secondaryColor}]}>Reason for Regularization</Text>
            <Text
              multiline
              includeFontPadding={false}
              style={styles.longText}
            >
              {regularizationReason}
            </Text>
          </View>
        </Card>

        {/* Reason of Cancellation  */}
        <Card style={styles.cards}>
          <View style={styles.cardMenuSpasing}>
            <Text style={[styles.cardLabel,{color:secondaryColor}]}>Reason for Cancellation</Text>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              multiline
              placeholder="Enter Cancellation Reason"
              maxLength={250}
              numberOfLines={5}
              dense
              selectionColor={this.props.secondaryColor}
              keyboardType="default"
              includeFontPadding={false}
              underlineColorAndroid="transparent"
              value={this.state.cancelReason}
              onChangeText={cancelReason => this.setState({ cancelReason })}
              style={styles.inputBackground}
            />
          </View>
        </Card>
        {
          this.state.isError ? <Text style={styles.errorMsg}>*Required</Text> : null
        }

        <View style={styles.buttonContainer}>
          <Button
            loading={this.state.requesting}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            mode="contained"
            disabled={this.state.requesting}
            uppercase
            color={this.props.primaryColor}
            onPress={() => this.onPressSubmit()}
          >
            Submit
          </Button>
          <Button
            color={this.props.secondaryColor}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={this.state.requesting}
            mode="contained"
            uppercase
            onPress={() => this.props.navigation.goBack()}
          >
            Discard
          </Button>
        </View>
      </ScrollView>
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
)(AttendanceCancelScreen);
