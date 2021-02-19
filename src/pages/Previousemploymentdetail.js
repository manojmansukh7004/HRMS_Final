/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Card, FAB } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Swipeable from 'react-native-gesture-handler/Swipeable';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      second: true,
      loading: false,
      NameHolder: '',
      IdHolder: '',
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      spinner: true,
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetMyProfileData();
  }


    previousemploymentview = (id, approved) => {
      this.props.navigation.navigate('PreviousEmploymentDetailView', {
        ID: id, Visible: 'true', callHome: this.proFun.bind(this), Approved: approved
      });
    };


      addpreviousemployment = () => {
        this.props.navigation.navigate('Previousemploymentedit', { ID: '0', Visible: 'true', callHome: this.proFun.bind(this), });
      };

      edit(id) {
        this.props.navigation.navigate('Previousemploymentedit', { ID: id, Visible: 'false', callHome: this.proFun.bind(this), });
      }

      proFun() {
        this.setState({ spinner: true, },);
        this.GetMyProfileData();
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
          // this._retrive_Data();
            this.setState(
              {
                isLoading: false,
                loading: false,
                dataSource: responseJson.ProfileData[0]['Prev Employment Data'],
              },

            );
            this.setState(
              {
                spinner: false,
              }
            );
          })
          .catch(() => {

          });
      }

    renderItem=({ item }) => {
      const renderLeftActions = (progress, dragX) => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {item.IsApproved == '1' ? (
            <TouchableOpacity

              activeOpacity={0.5}
              onPress={() => this.edit(item.Id,)}
            >
              <View style={{
                width: 40, height: 70, flexDirection: 'column', backgroundColor: '#EFF0F150', alignItems: 'center', justifyContent: 'center'
              }}
              >
                <SimpleLineIcon name="pencil" color="black" size={20} />

              </View>
            </TouchableOpacity>
          ) : (
            <View style={{
              width: 70, height: 70, flexDirection: 'column', backgroundColor: '#EFF0F150', alignItems: 'center', justifyContent: 'center', marginTop: 10
            }}
            >
              <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, }}>Under Approval</Text>
            </View>
          ) }
        </View>
      );
      return (
        <Swipeable
          renderRightActions={renderLeftActions}
        >
          <Card style={styles.cards}>

            <View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.previousemploymentview(item.Id, item.IsApproved)}
              >
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
                    width: 25, height: 25, backgroundColor: item.IsApproved == '1' ? '#9E9E9E' : '#f27420', justifyContent: 'center', alignItems: 'center', borderRadius: 63
                  }}
                  >
                    <MaterialIcons name="work" size={20} color="#fff" />
                  </View>
                  <View style={{
                    width: wp('80%'), alignItems: 'center', marginLeft: 5, flexDirection: 'row'
                  }}
                  >
                    <View style={{ width: wp('35%'), flexDirection: 'column', }}>
                      <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 12, }}>{item.Organization }</Text>

                    </View>
                    <View style={{ width: wp('25%'), flexDirection: 'column', }}>
                      <Text style={{ color: '#000000', fontSize: 12, }}>
                        {item.FromDate}
                        {' '}
                        -
                        {'\n'}
                        {item.ToDate}
                      </Text>

                    </View>


                    <View style={{ width: wp('20%'), flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ color: '#000000', fontSize: 12 }}>
                        {item.Location}
                        {' '}
                      </Text>
                    </View>

                  </View>
                </View>
              </TouchableOpacity>
            </View>

          </Card>
        </Swipeable>


      );
    }

    render() {
      return (
        <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
          {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
            {
      this.state.dataSource ? (null) : <Text style={{ fontSize: 15, marginTop: 30 }}>No Records Found</Text>
}

            <FlatList
              showsVerticalScrollIndicator={false}

              data={this.state.dataSource}

              renderItem={this.renderItem}

              keyExtractor={(item, index) => index.toString()}
            />

          </View>
        )
}
          <FAB
            style={[styles.fab, { backgroundColor: this.props.secondaryColor }]}
            icon="plus"
            onPress={() => this.addpreviousemployment()}
          />
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
    fontFamily: 'Nunito-BoldItalic',

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
  },
  fab: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0,
    alignSelf: 'flex-end',
    marginBottom: 40
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
)(App);
