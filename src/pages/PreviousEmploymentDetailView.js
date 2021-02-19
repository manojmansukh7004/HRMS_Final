
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      id: this.props.navigation.getParam('ID', ''),
      approved: this.props.navigation.getParam('Approved', ''),
      fromdate: '',
      todate: '',
      organizationname: '',
      industry: '',
      role: '',
      annualctc: '',
      workcontract: '',
      workpattern: '',
      location: '',
      spinner: true,


    };
  }

  componentDidMount() {
    this.GetDynamicFieldsData();
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
          TableName: 'MyProfile_PrevEmpDetails$[0023PrevEmploymentData]',
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
        // alert(JSON.stringify(responseJson.controlDataValues[0][1].fieldValue));

        const str = responseJson.controlDataValues[0][6].fieldValue;
        const res = str.split(' - ');
        const str1 = responseJson.controlDataValues[0][7].fieldValue;
        const res1 = str1.split(' - ');
        const str2 = responseJson.controlDataValues[0][8].fieldValue;
        const res2 = str2.split(' - ');


        this.setState(
          {
            fromdate: responseJson.controlDataValues[0][0].fieldValue,
            todate: responseJson.controlDataValues[0][1].fieldValue,
            organizationname: responseJson.controlDataValues[0][2].fieldValue,
            role: responseJson.controlDataValues[0][3].fieldValue,
            ctc: responseJson.controlDataValues[0][4].fieldValue,
            location: responseJson.controlDataValues[0][5].fieldValue,
            workcontract: res[1],
            workpattern: res1[1],
            industry: res2[1],
            spinner: false,
          },

        );
      })
      .catch(() => {

      });
  }

  edit() {
    this.props.navigation.navigate('Previousemploymentedit', {
      ID: this.state.id,
      visible: 'false',
      callHome: this.proFun.bind(this),

    });
  }

  proFun() {
    const { params } = this.props.navigation.state;
    params.callHome();
    this.props.navigation.goBack();
  }

  render() {
    const { secondaryColor } = this.props;
    return (
      <View style={{
        width: wp('100%'), height: hp('100%'), alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF0F1',
      }}
      >

        {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


              <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>From Date</Text>
                  <Text style={styles.textStyle3}>{this.state.fromdate}</Text>
                </View>


                <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>To Date</Text>
                  <Text style={styles.textStyle3}>{this.state.todate}</Text>
                </View>

              </View>


              <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Organization Name</Text>
                  <Text style={styles.textStyle3}>{this.state.organizationname}</Text>
                </View>


                <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Industry</Text>
                  <Text style={styles.textStyle3}>{this.state.industry}</Text>
                </View>

              </View>


              <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Role</Text>
                  <Text style={styles.textStyle3}>{this.state.role}</Text>
                </View>


                <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Annual CTC</Text>
                  <Text style={styles.textStyle3}>{this.state.ctc}</Text>
                </View>

              </View>


              <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Work Contract</Text>
                  <Text style={styles.textStyle3}>{this.state.workcontract}</Text>
                </View>


                <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Work Pattern</Text>
                  <Text style={styles.textStyle3}>{this.state.workpattern}</Text>
                </View>

              </View>


              <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

                <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                  <Text style={[styles.textStyle2, { color: secondaryColor }]}>Location</Text>
                  <Text style={styles.textStyle3}>{this.state.location}</Text>
                </View>


              </View>
              {this.state.approved == '1' ? (
                <Button
                  loading={this.state.spinner}
                  disabled={this.state.spinner}
                  contentStyle={{ height: 45, backgroundColor: secondaryColor }}
                  icon="pencil"
                  style={styles.button}
                  labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                  mode="contained"
                  uppercase={false}
                  onPress={() => this.edit()}
                >
                  EDIT
                </Button>
              ) : null }


            </View>


          </ScrollView>

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
  textStyle1: {
    color: '#000',
    fontSize: 18,
    marginLeft: 10,


  },
  textStyle2: {
    color: '#e96a31',
    fontSize: 12,


  },
  textStyle3: {
    color: '#000',
    fontSize: 14,
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

  },
  cards: {
    elevation: 3,
    borderRadius: 5,

  },
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
