
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.getParam('ID', ''),
      approved: this.props.navigation.getParam('Approved', ''),
      addresstype: '',
      address: '',
      city: '',
      pincode: '',
      state: '',
      country: '',
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
          TableName: 'MyProfile_AddressDetails$[0003AddressData]',
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

        const str = responseJson.controlDataValues[0][5].fieldValue;
        const res = str.split(' - ');
        const str1 = responseJson.controlDataValues[0][6].fieldValue;
        const res1 = str1.split(' - ');
        const str2 = responseJson.controlDataValues[0][7].fieldValue;
        const res2 = str2.split(' - ');
        this.setState(
          {
            addresstype: res[1],
            address: responseJson.controlDataValues[0][2].fieldValue,
            city: responseJson.controlDataValues[0][0].fieldValue,
            country: res2[1],
            state: res1[1],
            pincode: responseJson.controlDataValues[0][1].fieldValue,
            spinner: false,
          },

        );
      })
      .catch(() => {

      });
  }

  addressdetailedit() {
    this.props.navigation.navigate('Addressdetailedit', {
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
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF0F1', flex: 1
      }}
      >
        {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View style={{ width: wp('100%'), height: '100%', alignItems: 'center', }}>


            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

              <View style={{ width: wp('90%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>Address Type</Text>
                <Text style={styles.textStyle3}>{this.state.addresstype}</Text>
              </View>


            </View>

            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

              <View style={{ width: wp('90%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>Address</Text>
                <Text style={styles.textStyle3}>
                  {this.state.address}
                </Text>
              </View>

            </View>

            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

              <View style={{ width: wp('50%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>City</Text>
                <Text style={styles.textStyle3}>{this.state.city}</Text>
              </View>

              <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>Pin Code</Text>
                <Text style={styles.textStyle3}>{this.state.pincode}</Text>
              </View>

            </View>


            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25, }}>

              <View style={{ width: wp('50%'), marginLeft: 20 }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>State</Text>
                <Text style={styles.textStyle3}>{this.state.state}</Text>
              </View>


              <View style={{ width: wp('50%'), }}>
                <Text style={[styles.textStyle2, { color: secondaryColor }]}>Country</Text>
                <Text style={styles.textStyle3}>{this.state.country}</Text>
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
                onPress={() => this.addressdetailedit()}
              >
                EDIT
              </Button>
            ) : null }
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
  textStyle1: {
    color: '#000',
    fontSize: 18,
    marginLeft: 10,

  },
  textStyle2: {
    fontSize: 11,

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
    justifyContent: 'center',
    alignItems: 'center',
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
