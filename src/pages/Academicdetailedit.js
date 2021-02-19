
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-paper';
import Moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Checkbox from 'react-native-modest-checkbox';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MessageModal from '../components/MessageModal';
import getMessage from '../config/GetMessage';

let typeofcontact = [];
let typeofcontact1 = [];
let typeofcontact2 = [];
let typeofcontact3 = [];
let typeofcontact4 = [];
class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setDate(today.getDate());
    Moment.locale('en');
    const dt = today;
    const hi = Moment(dt).format('DD MMM YYYY');
    this.state = {
      id: this.props.navigation.getParam('ID', ''),
      visible: this.props.navigation.getParam('visible', ''),
      fromdate: hi,
      todate: hi,
      degreetype: '',
      institutionname: '',
      qualificationtype: '',
      modeoflearning: '',
      branchofstudy: '',
      duration: '',
      yearmonth: '',
      passingyear: '',
      percentage: '',
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      dataSource3: [],
      dataSource4: [],
      second: true,
      loading: false,
      degreeholder: '0',
      qualificationholder: '0',
      modeoflearningholder: '0',
      yearholder: '0',
      branchholder: '0',
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      check: false,
      startdate: '',
      enddate: '',
      fromrequired: false,
      torequired: false,
      instrequired: false,
      durationrequired: false,
      yearrequired: false,
      percentrequired: false,
      degreerequired: false,
      qualificationtyperequired: false,
      modeoflearningrequired: false,
      branchrequired: false,
      yearmonthrequired: false,
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetDynamicFieldsData();
  }


    onValueChange=async (itemValue) => {
      if (itemValue !== '0') {
        this.setState({ degreeholder: itemValue, degreerequired: false });
      } else {
        this.setState({ degreeholder: '', degreerequired: true });
      }
    }

      onValueChange1=async (itemValue) => {
        if (itemValue !== '0') {
          this.setState({ qualificationholder: itemValue, qualificationtyperequired: false });
        } else {
          this.setState({ qualificationholder: '', qualificationtyperequired: true });
        }
      }

          onValueChange2=async (itemValue) => {
            if (itemValue !== '0') {
              this.setState({ modeoflearningholder: itemValue, modeoflearningrequired: false });
            } else {
              this.setState({ modeoflearningholder: '', modeoflearningrequired: true });
            }
          }

          onValueChange3=async (itemValue) => {
            if (itemValue !== '0') {
              this.setState({ branchholder: itemValue, branchrequired: false });
            } else {
              this.setState({ branchholder: '', branchrequired: true });
            }
          }

          onValueChange4=async (itemValue) => {
            if (itemValue !== '0') {
              this.setState({ yearholder: itemValue, yearmonthrequired: false });
            } else {
              this.setState({ yearholder: '', yearmonthrequired: true });
            }
          }

          showDateTimePicker = () => {
            this.setState({ isDateTimePickerVisible: true });
          };

         hideDateTimePicker = () => {
           this.setState({ isDateTimePickerVisible: false });
         };

         handleDatePicked = date => {
           Moment.locale('en');
           const dt = date;
           const hi = Moment(dt).format('DD MMM YYYY');

           this.setState({ fromdate: hi, fromrequired: false });
           this.hideDateTimePicker();
         };

        showDateTimePicker1 = () => {
          this.setState({ isDateTimePickerVisible1: true });
        };

         hideDateTimePicker1 = () => {
           this.setState({ isDateTimePickerVisible1: false });
         };

         handleDatePicked1 = date => {
           Moment.locale('en');
           const dt = date;
           const hi = Moment(dt).format('DD MMM YYYY');

           this.setState({ todate: hi, torequired: false });
           this.hideDateTimePicker1();
         };

         checkbox = () => {
           if (this.state.check) {
             this.setState({ check: false });
           } else {
             this.setState({ check: true });
           }
         };

         validate = () => {
           // alert("this.state.Name1")

           if (this.state.fromdate == '' || this.state.todate == '' || this.state.institutionname == '' || this.state.duration == '' || this.state.passingyear == '' || this.state.percentage == '' || this.state.degreeholder == '' || this.state.degreeholder == '0' || this.state.qualificationholder == '' || this.state.qualificationholder == '0' || this.state.modeoflearningholder == '' || this.state.modeoflearningholder == '0' || this.state.branchholder == '' || this.state.branchholder == '0' || this.state.yearholder == '' || this.state.yearholder == '0') {
             this.setState({
               isModalVisible: true,
               modalMessage: 'Please enter all values',
               modalType: 'E',
               loadingApprove: false
             });
             if (this.state.fromdate == '') { this.setState({ fromrequired: true, }); }
             if (this.state.todate == '') { this.setState({ torequired: true, }); }
             if (this.state.institutionname == '') { this.setState({ instrequired: true, }); }
             if (this.state.duration == '') { this.setState({ durationrequired: true, }); }
             if (this.state.passingyear == '') { this.setState({ yearrequired: true, }); }
             if (this.state.percentage == '') { this.setState({ percentrequired: true, }); }
             if (this.state.degreeholder == '' || this.state.degreeholder == '0') { this.setState({ degreerequired: true, }); }
             if (this.state.qualificationholder == '' || this.state.qualificationholder == '0') { this.setState({ qualificationtyperequired: true, }); }
             if (this.state.modeoflearningholder == '' || this.state.modeoflearningholder == '0') { this.setState({ modeoflearningrequired: true, }); }
             if (this.state.branchholder == '' || this.state.qualificationholder == '0') { this.setState({ branchrequired: true, }); }
             if (this.state.yearholder == '' || this.state.modeoflearningholder == '0') { this.setState({ yearmonthrequired: true, }); }
           } else {
             if (this.state.visible == 'true') {
               this.add();
             } else {
               this.update();
             }

             this.setState({
               fromrequired: false, torequired: false, organisationrequired: false, rolerequired: false, ctcrequired: false, locationrequired: false
             });
           }
         }

             onModalHide = () => {
               if (this.state.modalType === 'S') {
                 const { params } = this.props.navigation.state;
                 params.callHome();
                 this.props.navigation.goBack();
               }
             }

       update = () => {
         this.setState({ spinner: true, });
         const from = this.state.fromdate;
         const date1 = from.split(' ');
         const expiry = this.state.todate;
         const date2 = expiry.split(' ');
         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
         for (var j = 0; j < months.length; j++) {
           if (date1[1] == months[j]) {
             date1[1] = months.indexOf(months[j]) + 1;
           }
         }
         if (date1[1] < 10) {
           date1[1] = `0${date1[1]}`;
         }
         for (var j = 0; j < months.length; j++) {
           if (date2[1] == months[j]) {
             date2[1] = months.indexOf(months[j]) + 1;
           }
         }
         if (date2[1] < 10) {
           date2[1] = `0${date2[1]}`;
         }
         const formattedDate = `${date1[2]}-${date1[1]}-${date1[0]}`;
         const formattedDate1 = `${date2[2]}-${date2[1]}-${date2[0]}`;

         this.setState({ startdate: formattedDate, enddate: formattedDate1 }, () => {
           this.updateacademic();
         });
       };

       add = () => {
         this.setState({ spinner: true, });
         this.setState({ spinner: true, });
         const from = this.state.fromdate;
         const date1 = from.split(' ');
         const expiry = this.state.todate;
         const date2 = expiry.split(' ');
         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
         for (var j = 0; j < months.length; j++) {
           if (date1[1] == months[j]) {
             date1[1] = months.indexOf(months[j]) + 1;
           }
         }
         if (date1[1] < 10) {
           date1[1] = `0${date1[1]}`;
         }
         for (var j = 0; j < months.length; j++) {
           if (date2[1] == months[j]) {
             date2[1] = months.indexOf(months[j]) + 1;
           }
         }
         if (date2[1] < 10) {
           date2[1] = `0${date2[1]}`;
         }
         const formattedDate = `${date1[2]}-${date1[1]}-${date1[0]}`;
         const formattedDate1 = `${date2[2]}-${date2[1]}-${date2[0]}`;

         this.setState({ startdate: formattedDate, enddate: formattedDate1 }, () => {
           this.addacademic();
         });
       };


       addacademic() {
         const myarray = {
           loginDetails:
         {
           LoginEmpID: this.props.user.LoginEmpID,
           LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
         },
           infoTypeData:
         {
           CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
           StartDate: this.state.enddate,
           EndDate: this.state.startdate,
           EmpId: this.props.user.LoginEmpID,
           Id: '0',
           DegreeType: this.state.degreeholder,
           InstituteName: this.state.institutionname,
           QualificationType: this.state.qualificationholder,
           ModeOfLearning: this.state.modeoflearningholder,
           BranchOfStudy: this.state.branchholder,
           Duration: this.state.duration,
           DurationYOM: this.state.yearholder,
           PassingYear: this.state.passingyear,
           Percentage: this.state.percentage,
           IsHighest: this.state.check,
           Action: 'add'
         }
         };

         return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateIdentityData`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(myarray),
         })
           .then((response) => response.json())
           .then((responseJson) => {
             if (responseJson) {
               if (responseJson.SuccessList) {
                 const str = responseJson.SuccessList[0];
                 const res = str.split('#');
                 const msg = getMessage(res[0].toString(), this.props.messages);
                 this.setState({
                   isModalVisible: true,
                   modalMessage: msg.message,
                   modalType: msg.type,
                   loadingApprove: false
                 });
               } else if (responseJson.ErrorList) {
                 const msg = getMessage(responseJson.ErrorList.toString(), this.props.messages);
                 this.setState({
                   isModalVisible: true,
                   modalMessage: msg.message,
                   modalType: msg.type,
                   loadingApprove: false
                 });
               }
             } else {

             }

             this.setState({ spinner: false, },);
           })
           .catch(() => {
             this.setState({ spinner: false, },);
           });
       }

       updateacademic() {
         const myarray = {
           loginDetails:
            {
              LoginEmpID: this.props.user.LoginEmpID,
              LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
            },
           infoTypeData:
           {
             CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
             StartDate: this.state.startdate,
             EndDate: this.state.enddate,
             EmpId: this.props.user.LoginEmpID,
             Id: this.state.id,
             DegreeType: this.state.degreeholder,
             InstituteName: this.state.institutionname,
             QualificationType: this.state.qualificationholder,
             ModeOfLearning: this.state.modeoflearningholder,
             BranchOfStudy: this.state.branchholder,
             Duration: this.state.duration,
             DurationYOM: this.state.yearholder,
             PassingYear: this.state.passingyear,
             Percentage: this.state.percentage,
             IsHighest: this.state.check,
             Action: 'update'
           }
         };

         return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateAcademicData`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(myarray),
         })
           .then((response) => response.json())
           .then((responseJson) => {
             if (responseJson) {
               if (responseJson.SuccessList) {
                 const str = responseJson.SuccessList[0];
                 const res = str.split('#');
                 const msg = getMessage(res[0].toString(), this.props.messages);
                 this.setState({
                   isModalVisible: true,
                   modalMessage: msg.message,
                   modalType: msg.type,
                   loadingApprove: false
                 });
               } else if (responseJson.ErrorList) {
                 const msg = getMessage(responseJson.ErrorList.toString(), this.props.messages);
                 this.setState({
                   isModalVisible: true,
                   modalMessage: msg.message,
                   modalType: msg.type,
                   loadingApprove: false
                 });
               }
             } else {

             }

             this.setState({ spinner: false, },);
             // alert(msg)
           })
           .catch(() => {
             this.setState({ spinner: false, },);
             // ToastAndroid.show("Updated1", ToastAndroid.SHORT);
           });
       }

       GetDynamicFieldsData() {
         const myarray = {
           loginDetails:
                {
                  LoginEmpID: this.props.user.LoginEmpID,
                  LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
                },
           dynamicFieldsData:
                {
                  Action: '5',
                  FieldId: this.state.id,
                  TableName: 'MyProfile_AcademicDetails$[0022AcademicsData]',
                  EmployeeId: this.props.user.LoginEmpID,
                }
         };

         return fetch(`${this.props.user.baseUrl}/CommonFunc/GetDynamicFieldsData`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(myarray),
         })
           .then((response) => response.json())
           .then((responseJson) => {
             // alert(JSON.stringify(responseJson));
             if (this.state.visible == 'true') {

             } else {
               var str = responseJson.controlDataValues[0][8].fieldValue;
               var res = str.split(' - ');
               const str1 = responseJson.controlDataValues[0][10].fieldValue;
               const res1 = str1.split(' - ');
               const str2 = responseJson.controlDataValues[0][7].fieldValue;
               const res2 = str2.split(' - ');
               const str3 = responseJson.controlDataValues[0][9].fieldValue;
               const res3 = str3.split('  - ');
               const str4 = responseJson.controlDataValues[0][11].fieldValue;
               const res4 = str4.split(' - ');
               if (responseJson.controlDataValues[0][4].fieldValue == 'True') {
                 this.setState({ higherqualification: 'Yes' },);
               } else {
                 this.setState({ higherqualification: 'No' },);
               }

               this.setState(
                 {
                   fromdate: responseJson.controlDataValues[0][2].fieldValue,
                   todate: responseJson.controlDataValues[0][3].fieldValue,
                   degreeholder: res2[0],
                   institutionname: responseJson.controlDataValues[0][0].fieldValue,
                   qualificationholder: res1[0],
                   modeoflearningholder: res[0],
                   branchholder: res3[0],
                   yearholder: res4[0],
                   duration: responseJson.controlDataValues[0][1].fieldValue,
                   passingyear: responseJson.controlDataValues[0][5].fieldValue,
                   percentage: responseJson.controlDataValues[0][6].fieldValue,
                   yearmonth: responseJson.controlDataValues[0][11].fieldValue,
                 },

               );
             }

             for (var i = 0; i < responseJson.controlList[0].length; i++) {
               if (responseJson.controlList[0][i].DBField == 'DegreeID') {
                 var id = responseJson.controlList[0][i].FieldId;
                 typeofcontact = [];
                 for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                   if (id == responseJson.dropdownList[0][i].FieldId) {
                     var str = responseJson.dropdownList[0][i].FieldValues;
                     var res = str.split('$');
                     typeofcontact.push({ Degree: res[0], Degreeid: res[1] });
                   }
                 }
               }
             }
             for (var i = 0; i < responseJson.controlList[0].length; i++) {
               if (responseJson.controlList[0][i].DBField == 'ModeOfLearning') {
                 var id = responseJson.controlList[0][i].FieldId;
                 typeofcontact1 = [];
                 for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                   if (id == responseJson.dropdownList[0][i].FieldId) {
                     var str = responseJson.dropdownList[0][i].FieldValues;
                     var res = str.split('$');
                     typeofcontact1.push({ Mode: res[0], Modeid: res[1] });
                   }
                 }
               }
             }
             for (var i = 0; i < responseJson.controlList[0].length; i++) {
               if (responseJson.controlList[0][i].DBField == 'BranchOfStudyID') {
                 var id = responseJson.controlList[0][i].FieldId;
                 typeofcontact2 = [];
                 for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                   if (id == responseJson.dropdownList[0][i].FieldId) {
                     var str = responseJson.dropdownList[0][i].FieldValues;
                     var res = str.split('$');
                     typeofcontact2.push({ Branch: res[0], Branchid: res[1] });
                   }
                 }
               }
             }
             for (var i = 0; i < responseJson.controlList[0].length; i++) {
               if (responseJson.controlList[0][i].DBField == 'QualId') {
                 var id = responseJson.controlList[0][i].FieldId;
                 typeofcontact3 = [];
                 for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                   if (id == responseJson.dropdownList[0][i].FieldId) {
                     var str = responseJson.dropdownList[0][i].FieldValues;
                     var res = str.split('$');
                     typeofcontact3.push({ Qualification: res[0], Qualificationid: res[1] });
                   }
                 }
               }
             }
             for (var i = 0; i < responseJson.controlList[0].length; i++) {
               if (responseJson.controlList[0][i].DBField == 'DurationUOM') {
                 var id = responseJson.controlList[0][i].FieldId;
                 typeofcontact4 = [];
                 for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                   if (id == responseJson.dropdownList[0][i].FieldId) {
                     var str = responseJson.dropdownList[0][i].FieldValues;
                     var res = str.split('$');
                     typeofcontact4.push({ Year: res[0], Yearid: res[1] });
                   }
                 }
               }
             }
             this.setState({
               dataSource1: typeofcontact1, dataSource4: typeofcontact4, dataSource3: typeofcontact3, dataSource2: typeofcontact2, dataSource: typeofcontact, spinner: false,
             },);
           })
           .catch(() => {

           });
       }

       render() {
         const { secondaryColor } = this.props;
         const {
           fromdate, todate
         } = this.state;
         return (
              <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  date={new Date(fromdate)}
                />
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible1}
                  onConfirm={this.handleDatePicked1}
                  onCancel={this.hideDateTimePicker1}
                  date={new Date(todate)}
                />
                <MessageModal
                  isVisible={this.state.isModalVisible}
                  message={this.state.modalMessage}
                  type={this.state.modalType}
                  hideModal={() => this.setState({ isModalVisible: false })}
                  onModalHide={() => this.onModalHide()}
                />
                <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>

                      <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={this.showDateTimePicker}>
                  <Card style={styles.cards}>
                    <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>From Date</Text>
                    {this.state.fromdate === '' ? (
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>Select</Text>
                  ) : <Text style={{ color: '#000000', marginLeft: 10, fontSize: 14, }}>{this.state.fromdate}</Text>}
                  </View>
                  </Card>
                </TouchableOpacity>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.fromrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={this.showDateTimePicker1}>
                  <Card style={styles.cards}>
                    <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>To Date</Text>
                    {this.state.todate === '' ? (
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>Select</Text>
                  ) : <Text style={{ color: '#000000', marginLeft: 10, fontSize: 14, }}>{this.state.todate}</Text>}

                  </View>
                  </Card>
                </TouchableOpacity>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.torequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>

            </View>

                      <View style={{
              width: wp('100%'), height: 60, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('94%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('94%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>Degree Type</Text>
                    <Picker
                    style={{ height: 30 }}
                    selectedValue={this.state.degreeholder}
                    mode="dropdown"
                    onValueChange={(itemValue) => this.onValueChange(itemValue)}
                  >
                    <Picker.Item label="Select" value="0" />
                    { this.state.dataSource.map((item, key) => (
               <Picker.Item label={item.Degree} value={item.Degreeid} key={key} />))}

                  </Picker>

                  </View>
                </Card>
                <View style={{ width: wp('94%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.degreerequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>


            </View>
                      <View style={{
              width: wp('100%'), height: 80, marginTop: 24, flexDirection: 'column', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('94%'), height: 80, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('94%'), height: 80, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column',
                  }}
                  >
                    <Text style={{
                    color: secondaryColor, marginLeft: 10, marginTop: 10, fontSize: 11
                  }}
                  >
                    Institute Name

             </Text>
                    <TextInput
                    style={{
              marginLeft: 5, fontSize: 14, height: 65, justifyContent: 'center',
            }}

                    placeholder="Enter Institution Name"
                    multiline
                    onChangeText={(text) => this.setState({ institutionname: text, instrequired: false })}
                    value={this.state.institutionname}
                  />

                  </View>
                </Card>
              </View>
              <View style={{ width: wp('94%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                {this.state.instrequired ? (
                  <Text style={{
                    color: 'red', textAlign: 'right', paddingEnd: 5, marginTop: 5
                  }}
                  >
                    *Required

                </Text>
                )
                  : null }
              </View>

            </View>
                      <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>Qualification Type</Text>
                    <Picker
                    style={{ height: 30 }}
                    selectedValue={this.state.qualificationholder}
                    mode="dropdown"
                    onValueChange={(itemValue) => this.onValueChange1(itemValue)}
                  >
                    <Picker.Item label="Select" value="0" />
                    { this.state.dataSource3.map((item, key) => (
            <Picker.Item label={item.Qualification} value={item.Qualificationid} key={key} />))}

                  </Picker>

                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.qualificationtyperequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >

                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>Mode Of Learning</Text>
                    <Picker
                    style={{ height: 30 }}
                    selectedValue={this.state.modeoflearningholder}
                    mode="dropdown"
                    onValueChange={(itemValue) => this.onValueChange2(itemValue)}
                  >
                    <Picker.Item label="Select" value="0" />
                    { this.state.dataSource1.map((item, key) => (
            <Picker.Item label={item.Mode} value={item.Modeid} key={key} />))}

                  </Picker>

                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.modeoflearningrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>

            </View>


                      <View style={{
              width: wp('100%'), height: 60, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Branch Of Study</Text>
                    <Picker
                    style={{ height: 30 }}
                    selectedValue={this.state.branchholder}
                    mode="dropdown"
                    onValueChange={(itemValue) => this.onValueChange3(itemValue)}
                  >
                    <Picker.Item label="Select" value="0" />
                    { this.state.dataSource2.map((item, key) => (
            <Picker.Item label={item.Branch} value={item.Branchid} key={key} />))}

                  </Picker>

                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.branchrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <View style={{
                    width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{
            color: secondaryColor, marginLeft: 10, marginTop: 10, marginBottom: 8, height: 50, fontSize: 11,
          }}
          >
            Duration

              </Text>

                    <TextInput
            style={{
               marginLeft: 8, fontSize: 14, width: 150, height: 100, position: 'absolute'
             }}
            keyboardType="numeric"
            placeholder="Enter Duration"
            onChangeText={(text) => this.setState({ duration: text, durationrequired: false })}
            value={this.state.duration}
          />

                  </View>
                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.durationrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>

            </View>

                      <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>Year/Month</Text>
                    <Picker
                    style={{ height: 30 }}
                    selectedValue={this.state.yearholder}
                    mode="dropdown"
                    onValueChange={(itemValue) => this.onValueChange4(itemValue)}
                  >
                    <Picker.Item label="Select" value="0" />
                    { this.state.dataSource4.map((item, key) => (
            <Picker.Item label={item.Year} value={item.Yearid} key={key} />))}

                  </Picker>
                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.yearmonthrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <View style={{
                    width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{
            color: secondaryColor, marginLeft: 10, marginTop: 10, marginBottom: 8, height: 50, fontSize: 11,
          }}
          >
            Passing Year

              </Text>

                    <TextInput
            style={{
               marginLeft: 8, fontSize: 14, width: 150, height: 100, position: 'absolute'
             }}
            keyboardType="numeric"
            placeholder="Enter Year"
            onChangeText={(text) => this.setState({ passingyear: text, yearrequired: false })}
            value={this.state.passingyear}
          />

                  </View>
                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.yearrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>

            </View>

                      <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <View style={{
                    width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{
            color: secondaryColor, marginLeft: 10, marginTop: 10, marginBottom: 8, height: 50, fontSize: 11,
          }}
          >
            Percentage

              </Text>

                    <TextInput
            style={{
                      marginLeft: 8, fontSize: 14, width: 150, height: 100, position: 'absolute'
                    }}
            keyboardType="numeric"
            placeholder="Enter Percentage"
            onChangeText={(text) => this.setState({ percentage: text, percentrequired: false })}
            value={this.state.percentage}
          />

                  </View>
                  </View>
                </Card>
                <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  {this.state.percentrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                    : null }
                </View>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >

                <View style={{
                  width: wp('43%'), height: 55, borderRadius: 5, flexDirection: 'column', justifyContent: 'center',
                }}
                >
                  <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11 }}>Highest Qualification</Text>

                  <Checkbox
                    checked={this.state.check}
                    onChange={() => this.checkbox()}
                    label=""
                  />
                </View>


              </View>

            </View>

                      {this.state.visible === 'true' ? (
              <Button
                loading={this.state.spinner}
                disabled={this.state.spinner}
                contentStyle={{ height: 45, }}
                icon="arrow-right-bold-box"
                style={styles.button}
                color={this.props.primaryColor}
                labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                mode="contained"
                uppercase={false}
                onPress={() => this.validate()}
              >
                ADD
              </Button>
            ) : (
              <Button
                loading={this.state.spinner}
                disabled={this.state.spinner}
                contentStyle={{ height: 45 }}
                icon="arrow-right-bold-box"
                style={styles.button}
                color={this.props.primaryColor}
                labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                mode="contained"
                uppercase={false}
                onPress={() => this.validate()}
              >
                UPDATE
              </Button>
            ) }


                    </View>
                  </ScrollView>
                </View>

              </View>
         );
       }
}

const styles = StyleSheet.create({

  ImageStyle1: {
    width: 20,
    height: 25,
    marginLeft: 10,

  },
  textStyle1: {
    color: '#000',
    fontSize: 20,
    justifyContent: 'center',


  },
  button: {
    width: '94%',
    height: 45,
    borderRadius: 12,
    zIndex: 5,
    marginBottom: 60,
    marginTop: 20
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

  },
  requiredMessage: { color: 'red', textAlign: 'right', paddingEnd: 5 }
});

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  messages: state.messageData.messages,
});


export default connect(
  mapStateToProps,
)(App);
