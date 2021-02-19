/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable import/no-duplicates */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text, View, StyleSheet, Image, TouchableOpacity, FlatList, PermissionsAndroid, TextInput, Alert, Platform,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FileItem from '../components/FileItem';
import ExpenseListModal from '../components/ExpenseListModal';
import SandryOptionsModal from '../components/SandryOptionsModal';
import VehicleTypeModal from '../components/SandryOptionsModal';
import ModeOfTravelModal from '../components/SandryOptionsModal';
import expenseList from '../config/SandryExpenseList';
import { saveSundryExpense } from '../services/SaveSundryExpense';
import { saveSundryAttachments } from '../services/SaveSundryAttachments';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 10, height: '100%'
  },
  labels: {
    fontSize: 14,
    color: '#F2721C',
    includeFontPadding: false,
  },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 12,
  },
  button: {
    width: '48%',
    height: 45,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 80
  },
  buttonLabels: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  cardMenuSpasing: {
    flexDirection: 'column', paddingTop: 7, paddingStart: 3
  },
  cardContainer: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingStart: 10,
    color: 'black',
    paddingBottom: 7,
    paddingEnd: 10
  },
  inputCardContainer: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingStart: 8,
    color: 'black',
    paddingEnd: 10
  },
  cardLabel: {
    fontSize: 14,
    paddingStart: 10,
  },
  inputBackground: {
    backgroundColor: 'white', marginEnd: 10, fontSize: 16, marginLeft: 5, height: 40, includeFontPadding: false
  },

  multilineInput: {
    backgroundColor: 'white', marginEnd: 10, fontSize: 16, marginLeft: 5, includeFontPadding: false
  },
  attachmentView: {
    flexDirection: 'column',
    paddingStart: 4,
    marginTop: 15,
    justifyContent: 'center'
  },
  buttonContent: { height: 45 },
  requiredMessage: { color: 'red', textAlign: 'right', paddingEnd: 5 }
});

class CreateSandryExpenseScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.type = this.props.navigation.getParam('type');
    this.data = this.props.navigation.getParam('data');
    const date = new Date();
    let pb = null;
    if (this.item) {
      date.setFullYear(Number(this.item.ExpenseDate.substring(6, 10)));
      date.setMonth(Number(this.item.ExpenseDate.substring(3, 5)) - 1);
      date.setDate(Number(this.item.ExpenseDate.substring(0, 2)));
      pb = this.item.PaidBy === 'Company' ? { FieldValues: 'Company$4' } : { FieldValues: 'Self$3' };
    }
    this.state = {
      expenseModalVisible: false,
      paidByModalVisible: false,
      expenseType: this.type ? this.type : expenseList[1],
      expenseDate: this.item ? Moment(date).format('DD-MMM-YYYY') : '',
      isDatePickerVisible: false,
      description: this.item ? this.item.Description : '',
      expenseAmt: this.item ? this.item.ExpenseAmount : '',
      fromPlace: this.item ? this.item.FromLocation : '',
      toPlace: this.item ? this.item.ToLocation : '',
      modaOfTravel: '',
      modaOfTravelModalVisible: false,
      paidBy: this.item ? pb : '',
      expensePlace: this.item ? this.item.ExpensePlace : '',
      noOfBills: this.item ? this.item.NoofBills : '',
      kmUsed: this.item ? this.item.UsedKM : '',
      files: this.item ? this.item.attachments : [],
      typeOfVehicle: '',
      typeOfVehicleModalVisible: false,
      phoneNumber: '',
      billToDate: this.item ? this.item.ToDate : '',
      billFromDate: this.item ? this.item.FromDate : '',
      isModalVisible: false,
      modalType: '',
      reqesting: false,
      isTypeSelected: true,
      isExpenseDate: true,
      isExpenseAmt: true,
      isNumBill: true,
      isExpensePlace: true,
      isDescription: true,
      isPaidBy: true,
      isFromPlace: true,
      isToPlace: true,
      isKmUsed: true,
      isTypeOfVehicle: true,
      isModeOfTravel: true,
      isAttachment: true
    };
    this.modeOfTravelModal = [];
    this.typeOfVehicle = [];
    console.log(this.item);
    this.deletedFiles = [];
  }

  async componentDidMount() {
    const response = await getDynamicFieldsData('5', '0', 'SundryExp$[ESS_EXP_tbl_SundryClaimsTemp]', this.props.user);
    const data = response.dropdownList[0];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      if (data[i].FieldId === 1754) {
        this.modeOfTravelModal.push(data[i]);
      } else if (data[i].FieldId === 1820) {
        this.typeOfVehicle.push(data[i]);
      }
    }
    console.log(data);
    if (this.item) {
      const { ModeOfTravel, TypeOfVehicle } = this.item;
    }
  }

  onModalHide = () => {
    this.setState({
      expenseModalVisible: false,
    });
  }

  handleDatePicked = date => {
    this.setState({
      expenseDate: Moment(date).format('DD-MMM-YYYY'),
      isExpenseDate: true
    });
    this.setState({ isDatePickerVisible: false });
  }

  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true });
    }
  }

  onExpenseItemSelected = item => {
    this.setState({
      expenseModalVisible: false,
      expenseType: item,
      isTypeSelected: true,
      isExpenseDate: true,
      isExpenseAmt: true,
      isNumBill: true,
      isExpensePlace: true,
      isDescription: true,
      isPaidBy: true,
      isFromPlace: true,
      isToPlace: true,
      isKmUsed: true,
      isTypeOfVehicle: true,
      isModeOfTravel: true,
      isAttachment: true
    });
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
            const { files } = this.state;
            if (results) {
              files.push(...results);
              this.setState({ files, isAttachment: true });
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
        const { files } = this.state;
        if (results) {
          files.push(...results);
          this.setState({ files, isAttachment: true });
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
    const { files } = this.state;
    if (files[index].FileType) {
      const delFile = {
        FileName: files[index].FileName,
      };
      this.deletedFiles.push(delFile);
    }
    files.splice(index, 1);
    this.setState({ files });
  }

  onPressSave =() => {
    console.log(this.state.expenseType);
    const validate = this.validate();
    if (validate.isValid) {
      this.saveExpense();
    } else {
      this.setState({
        isModalVisible: true,
        modalMessage: validate.message,
        modalType: 'E',
      });
    }
  }

  validate = () => {
    const {
      expenseDate, expenseAmt, noOfBills, expensePlace, description, paidBy, fromPlace, toPlace, kmUsed, typeOfVehicle, modaOfTravel, files
    } = this.state;
    const { value } = this.state.expenseType;
    if (value === 'CL25$75' || value === 'CL03$75' || value === 'CL04$75' || value === 'CL05$75'
    || value === 'CL06$75' || value === 'CL13$75' || value === 'CL14$75' || value === 'CL16$75'
    || value === 'CL20$75' || value === 'CL21$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || expensePlace.trim() === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isExpensePlace: expensePlace.trim() !== '',
          isDescription: description.trim() !== '',
          isPaidBy: paidBy !== '',
          isAttachment: files.length !== 0
        });
        return {
          isValid: false,
          message: 'Please fill *Required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }
    if (value === 'CL19$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isDescription: description.trim() !== '',
          isAttachment: files.length !== 0,
          isPaidBy: paidBy !== ''
        });
        return {
          isValid: false,
          message: 'Please fill *Required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }

    if (value === 'CL15$75' || value === 'CL07$75' || value === 'CL08$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || fromPlace === '' || toPlace === '' || kmUsed === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isFromPlace: fromPlace !== '',
          isToPlace: toPlace !== '',
          isKmUsed: kmUsed !== '',
          isDescription: description.trim() === '',
          isPaidBy: paidBy !== '',
          isAttachment: files.length !== 0
        });
        return {
          isValid: false,
          message: 'Please fill *Required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }

    if (value === 'CL10$75' || value === 'CL12$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || fromPlace === '' || toPlace === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isFromPlace: fromPlace !== '',
          isToPlace: toPlace !== '',
          isDescription: description.trim() !== '',
          isPaidBy: paidBy !== '',
          isAttachment: files.length !== 0
        });
        return {
          isValid: false,
          message: 'Please fill *Required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }

    if (value === 'CL09$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || fromPlace === '' || toPlace === '' || typeOfVehicle === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isFromPlace: fromPlace !== '',
          isToPlace: toPlace !== '',
          isTypeOfVehicle: typeOfVehicle !== '',
          isDescription: description.trim() !== '',
          isPaidBy: paidBy !== '',
          isAttachment: files.length !== 0
        });
        return {
          isValid: false,
          message: 'Please fill *Required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }
    if (value === 'CL11$75' || value === 'CL01$75' || value === 'CL02$75') {
      if (expenseDate === '' || expenseAmt === '' || noOfBills === '' || fromPlace === '' || toPlace === '' || modaOfTravel === '' || description.trim() === '' || paidBy === '' || files.length === 0) {
        this.setState({
          isExpenseDate: expenseDate !== '',
          isExpenseAmt: expenseAmt !== '',
          isNumBill: noOfBills !== '',
          isFromPlace: fromPlace !== '',
          isToPlace: toPlace !== '',
          isModeOfTravel: modaOfTravel !== '',
          isDescription: description.trim() !== '',
          isPaidBy: paidBy !== '',
          isAttachment: files.length !== 0
        });
        return {
          isValid: false,
          message: 'Please fill required fields'
        };
      }
      return {
        isValid: true,
        message: ''
      };
    }
    return null;
  }

  saveExpense =async () => {
    this.setState({ reqesting: true });
    try {
      const payload = {
        ExpenseType: this.state.expenseType.value.split('$')[0],
        ExpenseDate: this.state.expenseDate,
        ExpensePlace: this.state.expensePlace,
        FromLocation: this.state.fromPlace,
        ToLocation: this.state.toPlace,
        UsedKM: this.state.kmUsed,
        Description: this.state.description,
        TypeOfVehicle: this.state.typeOfVehicle,
        NoofBills: this.state.noOfBills,
        ParkingTax: '0',
        SundryId: this.item ? this.item.SundryId : '0',
        ExpenseCategory: '',
        ExpAmtCalculatedConv: 0,
        TotalExpAmount: 0,
        ModeOfTravel: this.state.modaOfTravel ? this.state.modaOfTravel.FieldValues.split('$')[1] : '',
        Currency: this.data.Currency[0],
        ExpenseAmount: this.state.expenseAmt,
        PaidBy: this.state.paidBy ? this.state.paidBy.FieldValues.split('$')[1] : '',
        TransactionID: this.data.TransactionID[0],
        BtnFlag: this.item ? '2' : '',
        SubProcessId: this.state.expenseType ? this.state.expenseType.value.split('$')[1] : '',
        ConvVehicleType: '',
        TotalClaimedAmt: this.state.expenseAmt,
        TotalBudgetAmt: this.data.BudgetBalance[0][0] ? this.data.BudgetBalance[0][0].TotalExpensesBudget : '0',
        UsedBudgetAmt: this.data.BudgetBalance[0][0] ? this.data.BudgetBalance[0][0].UsedBudget : '0'
      };
      const response = await saveSundryExpense(this.props.user, payload, this.deletedFiles.length ? this.deletedFiles : []);
      if (response.SuccessList) {
        const fdata = new FormData();
        let filesToUpload = false;
        for (let x = 0; x < this.state.files.length; x++) {
          if (this.state.files[x].type) {
            fdata.append('file', this.state.files[x]);
            filesToUpload = true;
          }
        }
        if (filesToUpload) {
          fdata.append('EmpId', '');
          fdata.append('FromDate', '01-01-2019');
          fdata.append('loginEmpID', this.props.user.LoginEmpID);
          fdata.append('loginEmpCompanyCodeNo', this.props.user.LoginEmpCompanyCodeNo);
          fdata.append('expenseTypeCode', this.state.expenseType.value.split('$')[0]);
          fdata.append('expenseDate', this.state.expenseDate);
          fdata.append('formId', response.SuccessList[0].split('#')[1]);
          const responseUploadFiles = await saveSundryAttachments(this.props.user, fdata);
          console.log(fdata);
          console.log(responseUploadFiles);
        }
      }

      if (response && response.SuccessList) {
        const msg = getMessage('S$Save', this.props.messages);
        if (msg) {
          this.setState({
            isModalVisible: true,
            modalMessage: msg.message,
            modalType: msg.type,
            reqesting: false
          });
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
        } else if (response.ErrorList) {
          Alert.alert('Error', response.ErrorList.toString());
        }
      }
      console.log(response);
      console.log(payload);
    } catch (error) {
      console.log(error);
      this.setState({
        isModalVisible: true,
        modalMessage: 'Something went wrong.',
        modalType: 'E',
        reqesting: false
      });
    }
  }

  render() {
    const { secondaryColor } = this.props;
    const { value } = this.state.expenseType;
    const {
      isExpenseDate, isExpenseAmt, isNumBill, isExpensePlace, isDescription, isPaidBy, isFromPlace, isToPlace, isKmUsed, isTypeOfVehicle, isModeOfTravel, isAttachment
    } = this.state;
    return (
      <View style={{
        height: '100%', backgroundColor: '#F9F9F9', flexDirection: 'column', flex: 1
      }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="always"
          style={styles.container}
          showsVerticalScrollIndicator
        >
          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />
          <ExpenseListModal
            isVisible={this.state.expenseModalVisible}
            hideModal={() => this.setState({ expenseModalVisible: false })}
            onModalHide={() => this.onModalHide()}
            onExpenseItemSelected={item => this.onExpenseItemSelected(item)}
          />

          <SandryOptionsModal
            isVisible={this.state.paidByModalVisible}
            hideModal={() => this.setState({ paidByModalVisible: false })}
            onModalHide={() => this.onModalHide()}
            onItemSelected={item => this.setState({ paidBy: item, isPaidBy: true })}
            data={[{ FieldValues: 'Self$3' }, { FieldValues: 'Company$4' }]}
          />

          <VehicleTypeModal
            isVisible={this.state.typeOfVehicleModalVisible}
            hideModal={() => this.setState({ typeOfVehicleModalVisible: false })}
            onModalHide={() => this.onModalHide()}
            onItemSelected={item => this.setState({ typeOfVehicle: item, isTypeOfVehicle: true })}
            data={this.typeOfVehicle}
          />

          <ModeOfTravelModal
            isVisible={this.state.modaOfTravelModalVisible}
            hideModal={() => this.setState({ modaOfTravelModalVisible: false })}
            onModalHide={() => this.onModalHide()}
            onItemSelected={item => this.setState({ modaOfTravel: item, isModeOfTravel: true })}
            data={this.modeOfTravelModal}
          />
          <DateTimePicker
            isVisible={this.state.isDatePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={() => this.setState({ isDatePickerVisible: false })}
            mode="date"
          />

          <Card style={styles.cards} onPress={this.item ? () => {} : () => this.setState({ expenseModalVisible: true })}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                Expense Type
              </Text>
              <Text style={styles.cardContainer}>{this.state.expenseType.text}</Text>
            </View>
          </Card>
          {this.state.isTypeSelected ? null
            : <Text style={styles.requiredMessage}>*Required</Text>}

          {value === '0' ? null
            : (
              <View>
                <Card style={styles.cards} onPress={() => this.setState({ isDatePickerVisible: true })}>
                  <View style={styles.cardMenuSpasing}>
                    <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                      Expense Date
                    </Text>
                    <Text style={styles.cardContainer}>{this.state.expenseDate ? this.state.expenseDate : 'Select date'}</Text>
                  </View>
                </Card>
                {isExpenseDate ? null
                  : <Text style={styles.requiredMessage}>*Required</Text>}

                <Card style={styles.cards}>
                  <View style={styles.cardMenuSpasing}>
                    <Text style={[styles.cardLabel, { color: secondaryColor }]}>Expense Amount</Text>
                    <TextInput
                      mode="flat"
                      underlineColor="transparent"
                      multiline={false}
                      keyboardType="decimal-pad"
                      placeholder="Enter Expense Amount"
                      underlineColorAndroid="transparent"
                      dense
                      numberOfLines={1}
                      value={this.state.expenseAmt}
                      selectionColor={this.props.secondaryColor}
                      onChangeText={(text) => this.setState({ expenseAmt: text, isExpenseAmt: true })}
                      style={styles.inputBackground}
                    />
                  </View>
                </Card>
                {isExpenseAmt ? null
                  : <Text style={styles.requiredMessage}>*Required</Text>}

                <Card style={styles.cards}>
                  <View style={styles.cardMenuSpasing}>
                    <Text style={[styles.cardLabel, { color: secondaryColor }]}>No. of Bills</Text>
                    <TextInput
                      mode="flat"
                      underlineColor="transparent"
                      multiline={false}
                      keyboardType="number-pad"
                      textAlignVertical="top"
                      placeholder="Enter No. of Bills"
                      underlineColorAndroid="transparent"
                      dense
                      numberOfLines={1}
                      value={this.state.noOfBills}
                      selectionColor={this.props.secondaryColor}
                      onChangeText={(text) => this.setState({ noOfBills: text, isNumBill: true })}
                      style={styles.inputBackground}
                    />
                  </View>
                </Card>
                {isNumBill ? null
                  : <Text style={styles.requiredMessage}>*Required</Text>}

                {
                  (value === 'CL25$75' || value === 'CL13$75'
                  || value === 'CL14$75' || value === 'CL16$75'
                  || value === 'CL20$75' || value === 'CL21$75'
                  || value === 'CL05$75' || value === 'CL04$75'
                  || value === 'CL03$75' || value === 'CL06$75') && (
                  <View>
                    <Card style={styles.cards}>
                      <View style={styles.cardMenuSpasing}>
                        <Text style={[styles.cardLabel, { color: secondaryColor }]}>Expense Place</Text>
                        <TextInput
                          mode="flat"
                          underlineColor="transparent"
                          multiline={false}
                          textAlignVertical="top"
                          placeholder="Enter Expense Place"
                          underlineColorAndroid="transparent"
                          dense
                          numberOfLines={1}
                          value={this.state.expensePlace}
                          selectionColor={this.props.secondaryColor}
                          onChangeText={(text) => this.setState({ expensePlace: text, isExpensePlace: true })}
                          style={styles.inputBackground}
                        />
                      </View>
                    </Card>
                    {isExpensePlace ? null
                      : <Text style={styles.requiredMessage}>*Required</Text>}
                  </View>
                  )
                }

                {
                  (value === 'CL11$75' || value === 'CL01$75' || value === 'CL02$75') && (
                    <View>
                      <Card style={styles.cards} onPress={() => this.setState({ modaOfTravelModalVisible: true })}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                            Mode Of Travel
                          </Text>
                          <Text style={styles.cardContainer}>{this.state.modaOfTravel ? this.state.modaOfTravel.FieldValues.split('$')[0] : 'Select'}</Text>
                        </View>
                      </Card>
                      {isModeOfTravel ? null
                        : <Text style={styles.requiredMessage}>*Required</Text>}
                    </View>
                  )
                }

                {
                  (value === 'CL15$75' || value === 'CL01$75'
                  || value === 'CL02$75' || value === 'CL07$75'
                  || value === 'CL08$75' || value === 'CL09$75'
                  || value === 'CL10$75' || value === 'CL11$75'
                  || value === 'CL12$75') && (
                    <View>
                      <Card style={styles.cards}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                            From Place
                          </Text>
                          <TextInput
                            mode="flat"
                            underlineColor="transparent"
                            multiline={false}
                            textAlignVertical="top"
                            placeholder="From Place"
                            underlineColorAndroid="transparent"
                            dense
                            value={this.state.fromPlace}
                            selectionColor={this.props.secondaryColor}
                            onChangeText={(text) => this.setState({ fromPlace: text, isFromPlace: true })}
                            style={styles.inputBackground}
                          />
                        </View>
                      </Card>
                      {isFromPlace ? null
                        : <Text style={styles.requiredMessage}>*Required</Text>}

                      <Card style={styles.cards}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                            To Place
                          </Text>
                          <TextInput
                            mode="flat"
                            underlineColor="transparent"
                            multiline={false}
                            textAlignVertical="top"
                            placeholder="To Place"
                            underlineColorAndroid="transparent"
                            dense
                            value={this.state.toPlace}
                            selectionColor={this.props.secondaryColor}
                            onChangeText={(text) => this.setState({ toPlace: text, isToPlace: true })}
                            style={styles.inputBackground}
                          />
                        </View>
                      </Card>
                      {isToPlace ? null
                        : <Text style={styles.requiredMessage}>*Required</Text>}
                    </View>
                  )
                }

                {
                  (value === 'CL15$75' || value === 'CL07$75'
                  || value === 'CL08$75') && (
                    <View>
                      <Card style={styles.cards}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>KM Used</Text>
                          <TextInput
                            mode="flat"
                            underlineColor="transparent"
                            multiline={false}
                            keyboardType="decimal-pad"
                            textAlignVertical="top"
                            placeholder="KM Used"
                            underlineColorAndroid="transparent"
                            dense
                            numberOfLines={1}
                            value={this.state.kmUsed}
                            selectionColor={this.props.secondaryColor}
                            onChangeText={(text) => this.setState({ kmUsed: text, isKmUsed: true })}
                            style={styles.inputBackground}
                          />
                        </View>
                      </Card>
                      {isKmUsed ? null
                        : <Text style={styles.requiredMessage}>*Required</Text>}
                    </View>
                  )
                }

                {/* {
                  (value === 'CL17$75') && (
                    <Card style={styles.cards}>
                      <View style={styles.cardMenuSpasing}>
                        <Text style={[styles.cardLabel, { color: secondaryColor }]}>Phone Number</Text>
                        <TextInput
                          mode="flat"
                          underlineColor="transparent"
                          multiline={false}
                          keyboardType="decimal-pad"
                          textAlignVertical="top"
                          placeholder="Phone Number"
                          underlineColorAndroid="transparent"
                          dense
                          numberOfLines={1}
                          value={this.state.phoneNumber}
                          selectionColor={this.props.secondaryColor}
                          onChangeText={(text) => this.setState({ phoneNumber: text })}
                          style={styles.inputBackground}
                        />
                      </View>
                    </Card>
                  )
                } */}
                {
                  value === 'CL09$75' && (
                    <View>
                      <Card style={styles.cards} onPress={() => this.setState({ typeOfVehicleModalVisible: true })}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                            Type of Vehicle
                          </Text>
                          <Text style={styles.cardContainer}>{this.state.typeOfVehicle ? this.state.typeOfVehicle.FieldValues.split('$')[0] : 'Select'}</Text>
                        </View>
                      </Card>
                      {isTypeOfVehicle ? null
                        : <Text style={styles.requiredMessage}>*Required</Text>}
                    </View>
                  )
                }
                <Card style={styles.cards}>
                  <View style={styles.cardMenuSpasing}>
                    <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                      Description
                    </Text>
                    <TextInput
                      mode="flat"
                      underlineColor="transparent"
                      multiline
                      textAlignVertical="top"
                      placeholder="Enter Description"
                      underlineColorAndroid="transparent"
                      dense
                      value={this.state.description}
                      selectionColor={this.props.secondaryColor}
                      onChangeText={(text) => this.setState({ description: text, isDescription: true })}
                      numberOfLines={4}
                      maxLength={250}
                      style={styles.multilineInput}
                    />
                  </View>
                </Card>
                {isDescription ? null
                  : <Text style={styles.requiredMessage}>*Required</Text>}

                <Card style={styles.cards} onPress={() => this.setState({ paidByModalVisible: true })}>
                  <View style={styles.cardMenuSpasing}>
                    <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                      Paid By
                    </Text>
                    <Text style={styles.cardContainer}>{this.state.paidBy ? this.state.paidBy.FieldValues.split('$')[0] : 'Select'}</Text>
                  </View>
                </Card>
                {isPaidBy ? null
                  : <Text style={styles.requiredMessage}>*Required</Text>}

                {/* {
                  (value === 'CL17$75' || value === 'CL18$75') && (
                    <View>
                      <Card style={styles.cards} onPress={() => this.setState({ isDatePickerVisible: true })}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                                    Bill From Date
                          </Text>
                          <Text style={styles.cardContainer}>{this.state.billFromDate}</Text>
                        </View>
                      </Card>

                      <Card style={styles.cards} onPress={() => this.setState({ isDatePickerVisible: true })}>
                        <View style={styles.cardMenuSpasing}>
                          <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                                    Bill To Date
                          </Text>
                          <Text style={styles.cardContainer}>{this.state.billToDate}</Text>
                        </View>
                      </Card>
                    </View>
                  )
                } */}

                <View style={styles.attachmentView}>
                  <Text style={{ color: 'black', }}>Upload Attachment</Text>
                  <View flexDirection="row" marginTop={10}>
                    <TouchableOpacity onPress={() => this.uploadAttachment()}>
                      <Image style={{ height: 50, width: 50 }} source={require('../assets/images/ic_attachment.png')} />
                    </TouchableOpacity>

                    <FlatList
                      data={this.state.files}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ alignItems: 'center' }}
                      style={{ flex: 1 }}
                      renderItem={({ item, index }) => (
                        <FileItem item={item} isEditing={this.item} onPress={() => this.removeFile(index)} />
                      )}
                      keyExtractor={item => item.id}
                    />
                  </View>
                  {isAttachment ? null
                    : <Text style={styles.requiredMessage}>*Required</Text>}
                </View>

                <View style={styles.buttonContainer}>

                  <Button
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                    labelStyle={styles.buttonLabels}
                    mode="contained"
                    uppercase
                    color={this.props.primaryColor}
                    loading={this.state.reqesting}
                    disabled={this.state.reqesting}
                    onPress={() => this.onPressSave()}
                  >
                    {this.item ? 'Update' : 'Save'}
                  </Button>
                  <Button
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                    labelStyle={styles.buttonLabels}
                    mode="contained"
                    uppercase
                    disabled={this.state.reqesting}
                    color={this.props.secondaryColor}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    Discard
                  </Button>
                </View>
              </View>
            )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  messages: state.messageData.messages,
});

export default connect(
  mapStateToProps,
)(CreateSandryExpenseScreen);
