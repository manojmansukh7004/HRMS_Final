/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList, PermissionsAndroid, Dimensions, Platform,
} from 'react-native';
import { Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, Card } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import { connect } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { StackedBarChart } from 'react-native-chart-kit';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { getDynamicFieldsValues } from '../services/GetDynamicFieldsValues';
import { leaveApplicationService } from '../services/LeaveApplicationService';
import { onLeaveChange } from '../services/LeaveTypeChange';
import { absenceDaysService } from '../services/AbsenceDaysService';
import { uploadFile } from '../services/UploadFileService';
import FileItem from '../components/FileItem';

import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { getLeaveData } from '../services/GetLeaveData';

const chartConfig = {
  backgroundGradientFrom: 'white',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'white',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 4, // optional, default 3
  barPercentage: 0.9,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  decimalPlaces: 0,
};

const constantPadding = 10;
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    paddingLeft: constantPadding,
    paddingRight: constantPadding,
    paddingBottom: constantPadding,
    flexGrow: 1
  },
  graphStyle: {
    marginBottom: 50,
    marginTop: 30
  },
  appBar: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF9E9',
  },
  button: {
    width: '48%',
    height: 45,
    borderRadius: 12,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonContent: { height: 45 },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  twoCards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15,
    width: '48%'
  },
  cardLabel: {
    fontSize: 14,
    paddingStart: 8
  },
  startPadding: { paddingStart: 8, fontSize: 16 },
  reasonLabel: { paddingStart: 12, fontSize: 14 },
  pickers: { height: 30 },
  scrollView: { flex: 1, backgroundColor: '#F9F9F9' },
  horizontalContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  disabledText: {
    paddingStart: 8, fontSize: 16, color: 'gray', height: 20
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20
  },
  cardMenuSpasing: {
    flexDirection: 'column', paddingTop: 10, paddingBottom: 10, paddingStart: 5
  },
  dateLabel: {
    paddingStart: 8,
    fontSize: 14,
    color: '#F2721C'
  },
  dateContainer: {
    flexDirection: 'column', paddingStart: 5, paddingTop: 9, paddingBottom: 9
  },
  attachmentView: {
    flexDirection: 'column',
    paddingStart: 4,
    marginTop: 15,
    justifyContent: 'center'
  },
  reasonView: { paddingStart: 3, paddingTop: 10, paddingBottom: 10 },
  longText: { backgroundColor: 'white', fontSize: 16, marginEnd: 10, },
  requiredMessage: { color: 'red', textAlign: 'right', paddingEnd: 5 }
});

class LeaveApplication extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      fromDate: this.item ? `${this.item.Date.substring(4, 6)}/${this.item.Date.substring(6, 8)}/${this.item.Date.substring(0, 4)}` : '',
      toDate: this.item ? `${this.item.Date.substring(4, 6)}/${this.item.Date.substring(6, 8)}/${this.item.Date.substring(0, 4)}` : '',
      selectedDate: this.item ? `${this.item.Date.substring(4, 6)}/${this.item.Date.substring(6, 8)}/${this.item.Date.substring(0, 4)}` : '',
      reason: '',
      leavePeriodFrom: '',
      leavePeriodTo: '',
      leaveTypeSelected: '0',
      leaveTypeText: '',
      totalNoDays: this.item ? '1' : '0',
      strDynamicQuery: '',
      loading: true,
      absenceDaysLabel: '',
      leaveTypeList: [],
      leavePeriodFromValues: [],
      leavePeriodToValues: [],
      reqesting: false,
      file: [],
      isTypeSelected: true,
      isLeaveToEnabled: true,
      isDatePickerVisible: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
      isNotReason: true,
      isAttachmentRequired: false,
      graphData: null,
    };
    this.leaveTypes = [];
    this.leaveTypeData = [];
  }

  async componentDidMount() {
    const { user } = this.props;
    getDynamicFieldsData('5', '0', 'ESS_Leave', user)
      .then(dynamicFieldsData => {
        if (dynamicFieldsData) {
          const controlList = dynamicFieldsData.controlList[0];
          this.setState({
            absenceDaysLabel: controlList[5].FieldLabel,
          }, async () => {
            try {
              const leaveTypeRes = await getDynamicFieldsValues('4', '503', 'ESS_Leave', user);
              if (leaveTypeRes) {
                this.leaveTypes = leaveTypeRes.controlDataValues[0];
                this.setState({ leaveTypeList: leaveTypeRes.controlDataValues[0] }, async () => {
                  try {
                    const leavePeriodFromRes = await getDynamicFieldsValues('4', '504', 'ESS_Leave', user);
                    if (leavePeriodFromRes) {
                      this.setState({
                        leavePeriodFromValues: leavePeriodFromRes.controlDataValues[0],
                        leavePeriodFrom: leavePeriodFromRes.controlDataValues[0][0].Value
                      }, async () => {
                        try {
                          const leavePeriodToRes = await getDynamicFieldsValues('4', '526', 'ESS_Leave', user);
                          if (leavePeriodToRes) {
                            for (let i = 0; i < 2; i++) {
                              this.state.leavePeriodToValues.push(leavePeriodToRes.controlDataValues[0][i]);
                            }
                            this.setState({
                              // leavePeriodToValues: leavePeriodToRes.controlDataValues[0],
                              leavePeriodTo: leavePeriodToRes.controlDataValues[0][0].Value,
                              loading: false
                            });
                          }
                        } catch (errMsg2) {
                          console.log(errMsg2);
                        }
                      });
                    }
                  } catch (errMsg) {
                    console.log(errMsg);
                  }
                });
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
      }).catch(err => {
        console.log(err);
      });

    const leavedataResponse = await getLeaveData(this.props.user);
    const data = {
      labels: [],
      legend: ['Availed', 'Balance'],
      data: [],
      barColors: [this.props.primaryColor, this.props.secondaryColor]
    };

    leavedataResponse.leaveBalance[0].forEach((val) => {
      data.labels.push(val.LeaveQuotaText.replace('Leave', ''));
      const bal = parseFloat(val.BalanceLeave);
      const total = parseFloat(val.TotalLeave);
      const availed = total - bal;
      const arr = [availed <= 0 ? '' : availed, bal <= 0 ? '' : bal];
      data.data.push(arr);
    });
    console.log(leavedataResponse, data);
    this.setState({
      graphData: data
    });
  }

  showDatePicker = () => {
    if (this.state.leaveTypeSelected) {
      this.setState({ isDatePickerVisible: true });
    } else {
      this.setState({
        isTypeSelected: false,
      });
    }
  }

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  }

  handleDatePicked = date => {
    this.setState({
      selectedDate: Moment(date).format('MM/DD/YYYY'),
    });
    console.log('Selected Date', date.toString());
    this.hideDatePicker();
    this.validateLeavePeriod();
  }

    onPressSubmit=async () => {
      const {
        leaveTypeSelected, fromDate, toDate, leavePeriodFrom, leavePeriodTo, reason, leaveTypeText, totalNoDays, strDynamicQuery
      } = this.state;

      console.log('LeaveText', leaveTypeText);
      if (leaveTypeSelected && fromDate && toDate && leavePeriodFrom && leavePeriodTo && reason) {
        if (this.state.isAttachmentRequired) {
          if (Object.keys(this.state.file).length > 0) {
            this.setState({ reqesting: true });
            try {
              // const split = res1.SuccessList[0].split('$');
              // const files = [];
              // files.push(split[1]);
              const filesData = [];
              for (let x = 0; x < this.state.file.length; x++) {
                filesData.push({
                  FileCnt: x + 1,
                  FileName: this.state.file[x].name,
                  FileType: this.state.file[x].type,
                  FromDate: fromDate,
                  LeaveType: leaveTypeSelected,
                  EmpId: this.props.user.LoginEmpID
                });
              }
              console.log(filesData);

              const response = await leaveApplicationService(fromDate, toDate, reason, leavePeriodFrom, leavePeriodTo, leaveTypeSelected, leaveTypeText, totalNoDays, strDynamicQuery, this.props.user, filesData);
              console.log('LeaveSubmit', response);
              if (response) {
                if (response.SuccessList) {
                  this.setState({ reqesting: false });
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
                    Alert.alert('', 'Your Leave Application request has been submitted for approval');
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
                  }
                }
              } else {
                this.setState({ reqesting: false });
              }
            } catch (error) {
              console.log('error', error);
              this.setState({ reqesting: false });
            }
          } else {
            this.setState({
              isModalVisible: true,
              modalMessage: 'Please select a file.',
              modalType: 'E'
            });
          }
        } else {
          try {
            this.setState({ reqesting: true }, async () => {
              const response = await leaveApplicationService(fromDate, toDate, reason, leavePeriodFrom, leavePeriodTo, leaveTypeSelected, leaveTypeText, totalNoDays, strDynamicQuery, this.props.user, []);
              console.log('LeaveSubmit', response);
              if (response) {
                if (response.SuccessList) {
                  this.setState({ reqesting: false });
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
                    Alert.alert('', 'Your Leave Application request has been submitted for approval');
                  }
                } else {
                  this.setState({ reqesting: false });
                  console.log('Error', response.ErrorList.toString());
                  const msg = getMessage(response.ErrorList.toString(), this.props.messages);
                  if (msg) {
                    this.setState({
                      isModalVisible: true,
                      modalMessage: msg.message,
                      modalType: msg.type
                    });
                  } else if (response.ErrorList) {
                    Alert.alert('Error', response.ErrorList.toString());
                  } else {
                    Alert.alert('Error', 'Please select valid date.');
                  }
                }
              } else {
                this.setState({ reqesting: false });
              }
            });
          } catch {
            this.setState({ reqesting: false });
          }
        }
      } else if (!reason && !leaveTypeSelected) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Please select leave type and enter leave reason',
          modalType: 'E',
          isNotReason: false,
          isTypeSelected: false
        });
      } else if (!leaveTypeSelected) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Please select leave type',
          modalType: 'E',
          isTypeSelected: false
        });
      } else if (!reason) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Please enter leave reason',
          modalType: 'E',
          isNotReason: false,
        });
      }
    }

    onDiscard=() => {
      this.props.navigation.goBack();
    }

    onValueChange=async (itemValue) => {
      if (itemValue !== '0') {
        const response = await onLeaveChange(itemValue, this.props.user);
        if (response) {
          this.leaveTypeData = response.LeaveMinMax[0][0];
          console.log(this.leaveTypeData);
          if (this.leaveTypeData) {
            console.log('isAttchment', this.leaveTypeData.IsAttachmentRequired);
            if (this.leaveTypeData.IsAttachmentRequired === 'YES') {
              this.setState({ isAttachmentRequired: true });
            } else {
              this.setState({ isAttachmentRequired: false });
            }
          }
        } else if (response.ErrorData) {
          console.log(response.ErrorData);
        }

        this.setState({
          leaveTypeSelected: itemValue,
          isTypeSelected: true,
          leaveTypeText: this.leaveTypes.find(value => value.Value === itemValue).Text
        });
        if (this.state.totalNoDays <= 1) {
          this.setState({
            isLeaveToEnabled: false
          });
        }
        console.log('TypeSelected', this.state.leaveTypeSelected);
        this.validateLeavePeriod(itemValue, 'type');
      } else {
        this.setState({ leaveTypeSelected: '', isTypeSelected: false });
      }
    }

    onLeavePeriodFromValueChange=(value) => {
      this.validateLeavePeriod(value, 'fromPeriod');
    }

    onLeavePeriodToValueChange=(value) => {
      this.validateLeavePeriod(value, 'toPeriod');
    }

    uploadAttachment= async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'App need Storage Permission',
              message:
                'App needs access to your Storage ',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
              const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
              });
              console.log(results);
              const files = this.state.file;
              if (results) {
                files.push(...results);
                this.setState({ file: files });
                const res1 = await uploadFile(this.props.user, this.state.fromDate, this.state.leaveTypeSelected, results);
                console.log(res1);
                console.log(files);
              }
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
              } else {
                throw err;
              }
            }
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const results = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.allFiles],
          });
          console.log(results);
          const files = this.state.file;
          if (results) {
            files.push(...results);
            this.setState({ file: files });
            const res1 = await uploadFile(this.props.user, this.state.fromDate, this.state.leaveTypeSelected, results);
            console.log(res1);
            console.log(files);
          }
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
      }
    }

    removeFile = index => {
      const { file } = this.state;
      file.splice(index, 1);
      this.setState({ file });
    }

    onModalHide = () => {
      if (this.state.modalType === 'S') {
        this.props.navigation.goBack();
        this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
      }
    }

    validateLeavePeriod(value, type) {
      if (this.state.leaveTypeSelected === '0' || this.state.leaveTypeSelected === '') {
        if (type === 'fromPeriod') {
          this.setState({
            leavePeriodFrom: value,
            isTypeSelected: false
          });
        } else if (type === 'toPeriod') {
          this.setState({
            leavePeriodTo: value,
            isTypeSelected: false
          });
        }
      } else {
        if (type === 'fromPeriod') {
          if (value === '2') {
            this.setState({
              isLeaveToEnabled: false
            });
          } else if (value === '3') {
            // TODO: Disable third option in leave Period to dropdown
            this.setState({
              isLeaveToEnabled: true
            });
          }
          this.setState({
            leavePeriodFrom: value,
          });
        } else if (type === 'toPeriod') {
          this.setState({
            leavePeriodTo: value,
            isLeaveToEnabled: true
          });
        }
        this.toDateChange();
      }
    }

    async toDateChange() {
      const { leaveTypeSelected, fromDate, selectedDate } = this.state;
      const response = await absenceDaysService(leaveTypeSelected, fromDate, selectedDate, this.props.user);
      if (response.SuccessList) {
        const str = response.SuccessList[0].split('$');
        const absenceDays = str[1].toString();
        if (absenceDays !== 'NaN' || absenceDays !== '') {
          this.setState({
            totalNoDays: absenceDays,
            toDate: selectedDate
          });
          let periodFromDays = (this.state.leavePeriodFrom === '1') ? '1' : '0.5';
          let periodToDays = (this.state.leavePeriodTo === '1') ? '1' : '0.5';
          if (absenceDays === '1') {
            periodToDays = '0';
          } else {
            periodToDays = (periodToDays === '1') ? '0' : periodToDays;
          }
          periodFromDays = (periodFromDays === '1') ? '0' : periodFromDays;
          const totalDays = parseFloat(absenceDays) - parseFloat(periodFromDays) - parseFloat(periodToDays);
          console.log('ToatalDays', totalDays);
          this.setState({
            totalNoDays: totalDays.toString()
          });

          if (totalDays <= 1) {
            this.setState({
              isLeaveToEnabled: false
            });
          } else {
            // eslint-disable-next-line no-lonely-if
            if (this.state.leaveTypeSelected === '7201') {
              this.setState({
                isLeaveToEnabled: false
              });
            } else {
              // TODO Disable Third option in dropdown
              this.setState({
                isLeaveToEnabled: true,
              });
            }
          }
        }
      } else if (response.ErrorList) {
        // TODO : Show error message from messages list
        const msg = getMessage(response.ErrorList.toString(), this.props.messages);
        if (msg) {
          this.setState({
            isModalVisible: true,
            modalMessage: msg.message,
            modalType: msg.type
          });
        }
      }
    }

    render() {
      const {
        fromDate, toDate, leaveTypeList
      } = this.state;
      const { secondaryColor } = this.props;
      Moment.locale('en');
      return (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >

          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />
          <DateTimePicker
            isVisible={this.state.isDatePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDatePicker}
            date={new Date(toDate)}
          />
          {
            this.state.loading
              ? <ActivityIndicator color={this.props.secondaryColor} style={{ height: '100%' }} size="large" />
              : (
                <View style={{ flexDirection: 'column' }}>
                  {/* Leave Type */}
                  <Card style={styles.cards}>
                    <View style={styles.cardMenuSpasing}>
                      <Text style={[styles.cardLabel, { color: secondaryColor }]}>Leave Type</Text>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.leaveTypeSelected}
                        style={styles.pickers}
                        iosHeader="Leave Type"
                        onValueChange={(itemValue) => this.onValueChange(itemValue)}
                      >
                        <Picker.Item label="Select" value="0" />
                        {
                          leaveTypeList.map((value) => <Picker.Item key={value.Value} label={value.Text} value={value.Value} />)
                          }
                      </Picker>
                    </View>
                  </Card>
                  {this.state.isTypeSelected ? null
                    : <Text style={styles.requiredMessage}>*Required</Text>}
                  <View style={styles.horizontalContainer}>
                    <Card
                      style={styles.twoCards}
                      onPress={this.item ? null : this.fromDatepicker}
                    >
                      <View style={styles.cardMenuSpasing}>
                        <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                          From Date
                        </Text>
                        <Text style={[styles.startPadding, { color: 'gray' }]}>{fromDate ? Moment(this.state.fromDate).format('DD-MMM-YYYY') : ''}</Text>
                      </View>
                    </Card>

                    {/* To Date */}
                    <Card style={styles.twoCards} onPress={this.showDatePicker}>
                      <View style={styles.cardMenuSpasing}>
                        <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                          To Date
                        </Text>
                        <Text style={styles.startPadding}>{toDate ? Moment(this.state.toDate).format('DD-MMM-YYYY') : ''}</Text>
                      </View>
                    </Card>
                  </View>

                  {/* Leave Period From */}
                  <Card style={styles.cards}>
                    <View style={styles.cardMenuSpasing}>
                      <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                        Leave Period From
                      </Text>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.leavePeriodFrom}
                        style={styles.pickers}
                        onValueChange={(itemValue) => this.onLeavePeriodFromValueChange(itemValue)}
                      >
                        {
                            this.state.leavePeriodFromValues.map(value => <Picker.Item key={value.Value} label={value.Text} value={value.Value} />)
                          }
                      </Picker>
                    </View>
                  </Card>

                  {/* Leave Period To */}
                  <Card style={styles.cards}>
                    <View style={styles.cardMenuSpasing}>
                      <Text style={[styles.cardLabel, { color: this.props.secondaryColor }]}>
                        Leave Period To
                      </Text>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.leavePeriodTo}
                        style={[styles.pickers, {
                          color: !this.state.isLeaveToEnabled ? '#CCCCCC' : 'black'
                        }]}
                        enabled={this.state.isLeaveToEnabled}
                        onValueChange={(itemValue) => this.onLeavePeriodToValueChange(itemValue)}
                      >
                        {
                            this.state.leavePeriodToValues.map(value => <Picker.Item key={value.Value} label={value.Text} value={value.Value} />)
                          }
                      </Picker>
                    </View>
                  </Card>

                  {/* Absence Day's */}
                  <Card style={styles.cards}>
                    <View style={styles.cardMenuSpasing}>
                      <Text style={[styles.cardLabel, { color: secondaryColor }]}>{this.state.absenceDaysLabel}</Text>
                      <Text style={styles.disabledText}>{this.state.totalNoDays}</Text>
                    </View>
                  </Card>

                  {/* Reason */}
                  <Card style={styles.cards}>
                    <View style={styles.reasonView}>
                      <Text style={[styles.reasonLabel, { color: secondaryColor }]}>
                        Reason
                      </Text>
                      <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        multiline
                        textAlignVertical="top"
                        placeholder="250/250"
                        underlineColorAndroid="transparent"
                        autoFocus={false}
                        maxLength={250}
                        dense
                        selectionColor={this.props.secondaryColor}
                        onChangeText={(text) => this.setState({ reason: text, isNotReason: true })}
                        numberOfLines={5}
                        includeFontPadding={false}
                        style={styles.longText}
                      />
                    </View>
                  </Card>
                  {this.state.isNotReason ? null
                    : <Text style={styles.requiredMessage}>*Required</Text>}

                  {/* Upload Attachment */}
                  {
                    this.state.isAttachmentRequired
                      ? (
                        <View style={styles.attachmentView}>
                          <Text style={{ color: 'black' }}>
                            Upload Attachment
                          </Text>

                          <View flexDirection="row" marginTop={10}>
                            <TouchableOpacity onPress={() => this.uploadAttachment()}>
                              <Image style={{ height: 50, width: 50 }} source={require('../assets/images/ic_attachment.png')} />
                            </TouchableOpacity>

                            <FlatList
                              data={this.state.file}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ alignItems: 'center' }}
                              style={{ flex: 1 }}
                              renderItem={({ item, index }) => (
                                <FileItem item={item} onPress={() => this.removeFile(index)} />
                              )}
                            />
                          </View>
                        </View>
                      ) : null
                  }

                  {/* Submit/Discard */}
                  <View style={styles.buttonContainer}>

                    <Button
                      contentStyle={styles.buttonContent}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                      mode="contained"
                      uppercase
                      color={this.props.primaryColor}
                      loading={this.state.reqesting}
                      disabled={this.state.reqesting}
                      onPress={() => this.onPressSubmit()}
                    >
                      Submit
                    </Button>
                    <Button
                      contentStyle={styles.buttonContent}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                      mode="contained"
                      uppercase
                      disabled={this.state.reqesting}
                      color={this.props.secondaryColor}
                      onPress={() => this.onDiscard()}
                    >
                      Discard
                    </Button>
                  </View>
                </View>
              )
          }

          {
  this.state.graphData && (
    <StackedBarChart
      style={styles.graphStyle}
      data={this.state.graphData}
      width={Dimensions.get('window').width}
      height={220}
      chartConfig={chartConfig}
      withDots={false}
      withInnerLines={false}
      withOuterLines={false}
    />
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
)(LeaveApplication);
