
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Card } from 'react-native-paper';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BankName1: '',
      AccNo: '',
      AccType1: '',
      spinner: true,
      IsApproved: '',
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetMyProfileData();
  }


  bankview = () => {
    this.props.navigation.navigate('Bankdetailedit');
  };

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
        this.setState(
          {
            isLoading: false,
            spinner: false,
            dataSource: responseJson.ProfileData[0]['Bank Data'],

          },

        );
        this.setState(
          {
            BankName1: this.state.dataSource[0].BankName,
            AccNo: this.state.dataSource[0].AccNumber,
            AccType1: this.state.dataSource[0].AccType,
            IsApproved: this.state.dataSource[0].IsApproved,

          }
        );
      })

      .catch(() => {

      });
  }

  render() {
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
        {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>


            {
      this.state.dataSource ? (

        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Card style={styles.cards}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.bankview()}>
              <View style={{
                width: wp('94%'),
                height: 55,

                flexDirection: 'row',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3
              }}
              >
                <View style={{
                  width: 25, height: 25, backgroundColor: this.state.IsApproved == '0' ? '#f27420' : '#9E9E9E', justifyContent: 'center', alignItems: 'center', borderRadius: 63
                }}
                >
                  <MaterialIcons name="account-balance" size={20} color="#fff" />
                </View>
                <View style={{ width: wp('80%'), marginLeft: 5, flexDirection: 'row' }}>
                  <View style={{ width: wp('27%'), flexDirection: 'column' }}>
                    <Text style={{ color: '#000000', fontSize: 13, }}>{this.state.BankName1}</Text>

                  </View>
                  <View style={{ width: wp('30%'), flexDirection: 'column' }}>
                    <Text style={{
                      color: '#000000', fontSize: 13, fontWeight: 'bold',
                    }}
                    >
                      {this.state.AccNo}

                    </Text>

                  </View>
                  <View style={{ width: wp('15%'), flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={{ color: '#000000', fontSize: 13, }}>{this.state.AccType1}</Text>

                  </View>

                </View>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

      ) : <Text style={{ fontSize: 15, marginTop: 30 }}>No Records Found</Text>
}
          </View>
        )
}
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
  cards: {
    elevation: 3,
    height: 55,
    width: wp('94%'),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,

  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,

  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  }
});

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});


export default connect(
  mapStateToProps,
)(App);
