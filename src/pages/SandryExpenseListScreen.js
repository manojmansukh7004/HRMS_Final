/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  FlatList, View, StyleSheet, ActivityIndicator, Dimensions, Alert, Text
} from 'react-native';
import { Button, FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getSundryData } from '../services/GetSundryData';
import SandryExpenseItem from '../components/SandryExpenseItem';
import { deleteExpense } from '../services/DeleteExpense';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { submitSandryExpense } from '../services/SubmitSundryExpense';
import expenseList, { getExpenseByText } from '../config/SandryExpenseList';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0,
    alignSelf: 'flex-end',
    marginBottom: 30
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  activityIndicator: {
    height: '100%',
    width: '100%',
  },
  button: {
    width: Dimensions.get('window').width - 40,
    height: 45,
    borderRadius: 12,
    margin: 20,
    bottom: 0,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonContent: { height: 45 },
});

class SandryExpenseListScreen extends Component {
  state={
    data: {},
    loading: true,
    isModalVisible: false,
    modalType: '',
    reqesting: false,
    listData: [],
  };

  async componentDidMount() {
    this.getSundryData();
  }

  getSundryData=async () => {
    this.setState({ loading: true });
    const response = await getSundryData(this.props.user);
    console.log(response);
    const listData = response.SavedData[0];
    listData.forEach((data, i) => {
      const files = [];
      response.SavedAttachments[0].forEach(attachment => {
        if (data.SundryId === attachment.SundryId) {
          files.push(attachment);
        }
        listData[i].attachments = files;
      });
    });
    this.setState({ data: response, loading: false, listData });
  }

  delete = async (item) => {
    Alert.alert(
      'Are you sure?',
      'Do you want to delete expense',
      [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            const response = await deleteExpense(this.props.user, item.SundryId);
            if (response && response.SuccessList) {
              this.getSundryData();
              const msg = getMessage(response.SuccessList.toString(), this.props.messages);
              if (msg) {
                this.setState({
                  isModalVisible: true,
                  modalMessage: msg.message,
                  modalType: msg.type,
                  listData: []
                });
              }
            }
          }
        },
      ],
      { cancelable: false },
    );
  }

  shouldRefresh = (data) => {
    if (data && data.refresh) {
      this.getSundryData();
    }
  }

  onPressSubmit =async () => {
    const expenseEligibility = [];

    this.state.data.NonWelfareEligibility[0].forEach((value, i) => {
      expenseEligibility.push({
        ClaimType: this.state.data.NonWelfareEligibility[0][i].ClaimType,
        EligibilityAmt: this.state.data.NonWelfareEligibility[0][i].EligibilityAmt
      });
    });

    let totalClaimedAmt = 0;
    this.state.data.SavedData[0].forEach((value, i) => {
      const claimAmt = this.state.data.SavedData[0][i].ExpenseAmount;
      totalClaimedAmt += parseFloat(claimAmt);
    });
    let totalBudget = '0';
    let usedAmt = '0';
    if (this.state.data.BudgetBalance[0].length) {
      totalBudget = this.state.data.BudgetBalance[0][0].TotalExpensesBudget;
      usedAmt = this.state.data.BudgetBalance[0][0].UsedBudget;
    }
    this.setState({ reqesting: true });
    const response = await submitSandryExpense(this.props.user, this.state.data.SavedData[0], expenseEligibility, totalClaimedAmt, totalBudget, usedAmt);
    console.log('expenseSubmit', response);
    if (response && response.SuccessList) {
      const str = response.SuccessList[0];
      const res = str.split('#');
      const msg = getMessage(res[0].toString(), this.props.messages);
      if (msg) {
        this.setState({
          isModalVisible: true,
          modalMessage: msg.message,
          modalType: msg.type,
          reqesting: false
        });
      }
    } else {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Something went wrong.',
        modalType: 'E',
        reqesting: false
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View><ActivityIndicator size="large" color={this.props.secondaryColor} style={styles.activityIndicator} /></View>
      );
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => {}}
          />

          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <SandryExpenseItem
                item={item}
                onPressEdit={i => {
                  const type = getExpenseByText(i.ExpenseTypeName);
                  this.props.navigation.navigate('CreateSandryExpense', {
                    data: this.state.data,
                    shouldRefresh: this.shouldRefresh,
                    item: i,
                    type
                  });
                }}
                onPressDelete={i => this.delete(i)}
                date={item.ExpenseDate}
                type={item.ExpenseTypeName}
                amount={item.ExpenseAmount}
                description={item.Description}
                bills={item.NoofBills}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', margin: 10 }}>No expense found.</Text>}
          />

          {
          this.state.listData.length > 0 && (
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
          )
}
        </KeyboardAwareScrollView>
        <FAB
          style={[styles.fab, { backgroundColor: this.props.secondaryColor }]}
          icon="plus"
          onPress={() => this.props.navigation.navigate('CreateSandryExpense', { data: this.state.data, shouldRefresh: this.shouldRefresh, })}
        />
      </View>
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
)(SandryExpenseListScreen);
