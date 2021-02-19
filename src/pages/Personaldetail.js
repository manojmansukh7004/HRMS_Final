/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import Moment from 'moment';
import { Button } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

let typeofcontact = [];
let typeofcontact1 = [];
let typeofcontact2 = [];
class Personaldetail extends Component {
  constructor(props) {
    super(props);

    this.state = {

      FirstName: '',
      MidName: '',
      LastName: '',
      NameShown1: '',
      BirthDate1: '',
      Gender1: '',
      Nationality1: '',
      BloodGroup1: '',
      MaritialStatus: '',
      Blood: '',
      birth: '',
      startdate: '',
      enddate: '',
      genderid: '',
      nationid: '',
      spinner: true,

    };
  }


  componentDidMount() {
    this.GetMyProfileData();
  }


  personaldetailedit = () => {
    this.props.navigation.navigate('Personaldetailedit', {
      FNAME: this.state.FirstName,
      MNAME: this.state.MidName,
      LNAME: this.state.LastName,
      GEN: this.state.Gender1,
      MARS: this.state.MaritialStatus,
      NATION: this.state.Nationality1,
      NAMESH: this.state.NameShown1,
      BG: this.state.BloodGroup1,
      callHome: this.proFun.bind(this),
      BloodGr: this.state.Blood,
      Birth: this.state.birth,
      Start: this.state.startdate,
      End: this.state.enddate,
      Genderid: this.state.genderid,
      Nationid: this.state.nationid,
    });
  };

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
    FieldId: '0',
    TableName: 'MyProfile_BasicInfo$[0002PersonalData]#InfoType',
    EmployeeId: this.props.user.LoginEmpID
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
        for (let i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'BloodGroup') {
            const id = responseJson.controlList[0][i].FieldId;
            typeofcontact = [];
            for (let i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                const str = responseJson.dropdownList[0][i].FieldValues;
                const res = str.split('$');
                typeofcontact.push({ Blood: res[0], Bloodid: res[1] });
              }
            }
          }
        }

        for (let i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'Gender') {
            const id = responseJson.controlList[0][i].FieldId;
            typeofcontact1 = [];
            for (let i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                const str = responseJson.dropdownList[0][i].FieldValues;
                const res = str.split('$');
                typeofcontact1.push({ Gender: res[0], Genderid: res[1] });
              }
            }
          }
        }


        for (let i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'Nationality') {
            const id = responseJson.controlList[0][i].FieldId;
            typeofcontact2 = [];
            for (let i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                const str = responseJson.dropdownList[0][i].FieldValues;
                const res = str.split('$');
                typeofcontact2.push({ Nation: res[0], Nationid: res[1] });
              }
            }
          }
        }

        for (let i = 0; i < typeofcontact.length; i++) {
          if (this.state.BloodGroup1 == typeofcontact[i].Bloodid) {
            this.setState({ Blood: typeofcontact[i].Blood },);
          }
        }
        for (let i = 0; i < typeofcontact1.length; i++) {
          if (this.state.Gender1 == typeofcontact1[i].Gender) {
            this.setState({ genderid: typeofcontact1[i].Genderid },);
          }
        }
        for (let i = 0; i < typeofcontact2.length; i++) {
          if (this.state.Nationality1 == typeofcontact2[i].Nation) {
            this.setState({ nationid: typeofcontact2[i].Nationid },);
          }
        }


        this.setState({ dataSource: typeofcontact, spinner: false, },);
      })
      .catch(() => {

      });
  }

  GetMyProfileData() {
    const myarray = {
      loginDetails:
        {
          LoginEmpID: this.props.user.LoginEmpID,
          LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
        }
    };

    return fetch(`${this.props.user.baseUrl}/MyProfile/GetMyProfileData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myarray),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          spinner: false,
          dataSource: responseJson.ProfileData[0]['Personal Data'],
        },);
        const str = this.state.dataSource[0].GBDAT;
        const res = str.slice(0, 4);
        const res1 = str.substring(4, 6);
        const res2 = str.substring(6, 8);
        const date = `${res}-${res1}-${res2}`;
        const str1 = this.state.dataSource[0].BEGDA;
        const res3 = str1.slice(0, 4);
        const res4 = str1.substring(4, 6);
        const res5 = str1.substring(6, 8);
        const date1 = `${res3}-${res4}-${res5}`;
        const str2 = this.state.dataSource[0].ENDDA;
        const res6 = str2.slice(0, 4);
        const res7 = str2.substring(4, 6);
        const res8 = str2.substring(6, 8);
        const date2 = `${res6}-${res7}-${res8}`;
        Moment.locale('en');
        const dt = date;
        const start = Moment(dt).format('DD MMM YYYY');
        this.setState(
          {

            FirstName: this.state.dataSource[0].VORNA,
            MidName: this.state.dataSource[0].MIDNM,
            LastName: this.state.dataSource[0].NACHN,
            Gender1: this.state.dataSource[0].GESCH,
            MaritialStatus: this.state.dataSource[0].FAMST,
            Nationality1: this.state.dataSource[0].NATIO,
            BloodGroup1: this.state.dataSource[0].BloodGroup,
            NameShown1: `${this.state.dataSource[0].VORNA} ${this.state.dataSource[0].NACHN}`,
            BirthDate1: start,
            birth: date,
            startdate: date1,
            enddate: date2,
            genderid: '',

          }, () => {
            this.GetDynamicFieldsData();
          }
        );
      })
      .catch(() => {

      });
  }

  proFun() {
    this.GetMyProfileData();
  }

  render() {
    const { secondaryColor } = this.props;
    return (
      <View style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF0F1',
      }}
      >
        {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


                <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                  <View style={{ width: wp('40%'), justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>First Name</Text>
                    <Text style={styles.textStyle3}>{this.state.FirstName}</Text>
                  </View>


                  <View style={{ width: wp('60%'), justifyContent: 'center', }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Middle Name</Text>
                    <Text style={styles.textStyle3}>{this.state.MidName}</Text>
                  </View>

                </View>


                <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 40 }}>

                  <View style={{ width: wp('40%'), justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Last Name</Text>
                    <Text style={styles.textStyle3}>{this.state.LastName}</Text>
                  </View>


                  <View style={{ width: wp('60%'), justifyContent: 'center', }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Name Shown</Text>
                    <Text style={styles.textStyle3}>{this.state.NameShown1}</Text>
                  </View>

                </View>


                <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 40 }}>

                  <View style={{ width: wp('40%'), justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Birth Date</Text>
                    <Text style={styles.textStyle3}>{this.state.BirthDate1}</Text>
                  </View>


                  <View style={{ width: wp('60%'), justifyContent: 'center', }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Gender</Text>
                    <Text style={styles.textStyle3}>{this.state.Gender1}</Text>
                  </View>

                </View>


                <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 40 }}>

                  <View style={{ width: wp('40%'), justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Nationality</Text>
                    <Text style={styles.textStyle3}>{this.state.Nationality1}</Text>
                  </View>


                  <View style={{ width: wp('60%'), justifyContent: 'center', }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Blood Group</Text>
                    <Text style={styles.textStyle3}>{this.state.Blood}</Text>
                  </View>

                </View>


                <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 40 }}>

                  <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={[styles.textStyle2, { color: secondaryColor }]}>Maritial Status</Text>
                    <Text style={styles.textStyle3}>{this.state.MaritialStatus}</Text>
                  </View>

                </View>

                <Button
                  icon="pencil"
                  contentStyle={{ height: 45, backgroundColor: secondaryColor }}
                  style={styles.button}
                  labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                  mode="contained"
                  uppercase={false}
                  onPress={() => this.personaldetailedit()}
                >
                  EDIT
                </Button>

              </View>

            </ScrollView>
          </View>
        )
}

      </View>

    );
  }
}


const styles = StyleSheet.create({

  ImageStyle: {
    width: 25,
    height: 30,
    marginLeft: 7,


  },
  button: {
    width: '90%',
    height: 45,
    borderRadius: 12,
    zIndex: 5,
    marginBottom: 60,
    marginTop: 20
  },
  textStyle1: {
    color: '#000',
    fontSize: 18,
    marginLeft: 10,


  },
  textStyle2: {
    fontSize: 12,


  },
  textStyle3: {
    color: '#000',
    fontSize: 14,

  },
  activityIndicator: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});


export default connect(
  mapStateToProps,
)(Personaldetail);
