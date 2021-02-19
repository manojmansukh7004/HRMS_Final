/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import {
  Text, View, FlatList, ActivityIndicator, RefreshControl, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import ListItem from '../components/ExpenseHistoryItem';
import { getSundryData } from '../services/GetSundryData';

const styles = StyleSheet.create({
  list: { marginBottom: 10, height: '100%' },
  listContainer: { paddingBottom: 20, marginBottom: 30 },
  emptyContainer: {
    justifyContent: 'center', height: '100%', width: '100%', marginTop: 20
  },
  emptyListItem: { alignSelf: 'center', fontSize: 16 },
  indicator: { height: '100%', width: '100%', justifyContent: 'center' },
});

class ExpenseHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    };
    this.expenseData = [];
  }

  async componentDidMount() {
    this.getSundryData();
  }

  getSundryData=async () => {
    const response = await getSundryData(this.props.user);
    console.log('sundry', response.SubmittedData);
    if (response) {
      this.expenseData = response.SubmittedData[0];
      this.setState({ isLoading: false, refreshing: false });
    } else {
      this.setState({ isLoading: false, refreshing: false });
    }
  }

  refresh=() => {
    this.setState({ refreshing: true });
    this.getSundryData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }
    return (
      <View>
        <View>
          <FlatList
            data={this.expenseData}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            refreshControl={(
              <RefreshControl
                colors={[this.props.secondaryColor]}
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
              />
            )}
            renderItem={({ item, index }) => (
              <ListItem
                item={item}
                index={index}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyListItem}>No Records Found....</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }
}

const mapStateTOProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user
});

export default connect(
  mapStateTOProps,
)(ExpenseHistoryScreen);
