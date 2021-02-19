
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Card, FAB } from 'react-native-paper';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      scrollEnabled: true,
      swipeclose: true,
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetMyProfileData();
  }


 addnext = () => {
   this.props.navigation.navigate('Familydetailedit', {
     ID: '0',
     RELATION: '',
     NAME: '',
     BIR: '',
     GEN: '',
     callHome: this.proFun.bind(this),
     visible: 'true',

   });
 };

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
       this.setState(
         {
           isLoading: false,
           loading: false,
           dataSource: responseJson.ProfileData[0]['Family Data'],
           spinner: false,
         },

       );
     })
     .catch(() => {

     });
 }

 edit(id, relation, name, bir, gen) {
   this.props.navigation.navigate('Familydetailedit', {
     ID: id,
     RELATION: relation,
     NAME: name,
     BIR: bir,
     GEN: gen,
     callHome: this.proFun.bind(this),
     visible: 'false',

   });
   this.setState({ swipeclose: false, },);
 }

    renderItem=({ item }) => {
      const renderLeftActions = (progress, dragX) => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {item.IsApproved == '1' ? (
            <TouchableOpacity

              activeOpacity={0.5}
              onPress={() => this.edit(item.Id, item.MemberRelation, item.MemberName, item.MemberGender, item.MemberDOB)}
            >
              <View style={{
                width: 40, height: 70, flexDirection: 'column', backgroundColor: '#EFF0F150', alignItems: 'center', justifyContent: 'center', marginTop: 10
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
              <View style={{
                width: wp('94%'), height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
              }}
              >

                <View style={{
                  width: 25, height: 25, backgroundColor: item.IsApproved == '0' ? '#f27420' : '#9E9E9E', justifyContent: 'center', alignItems: 'center', borderRadius: 63
                }}
                >
                  <MaterialIcons name="people" size={20} color="#fff" />
                </View>
                <View style={{ width: wp('80%'), marginLeft: 5, flexDirection: 'row' }}>
                  <View style={{ width: wp('15%'), flexDirection: 'column' }}>
                    <Text style={{ color: '#00000050', fontSize: 10, }}>Relation</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, }}>{item.MemberRelation}</Text>
                  </View>
                  <View style={{ width: wp('22%'), flexDirection: 'column' }}>
                    <Text style={{ color: '#00000050', fontSize: 10, }}>Name</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, }}>{item.MemberName}</Text>
                  </View>
                  <View style={{ width: wp('17%'), flexDirection: 'column' }}>
                    <Text style={{ color: '#00000050', fontSize: 10, }}>Gender</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, }}>{item.MemberGender}</Text>
                  </View>
                  <View style={{ width: wp('25%'), flexDirection: 'column' }}>
                    <Text style={{ color: '#00000050', fontSize: 10, }}>Date of Birth</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, }}>{item.MemberDOB}</Text>
                  </View>

                </View>

              </View>
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
            onPress={() => this.addnext()}
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
    height: 70,
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
    // backgroundColor:'#fff'
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
