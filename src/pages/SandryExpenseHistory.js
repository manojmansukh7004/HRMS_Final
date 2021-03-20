/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  FlatList, View, ActivityIndicator, StyleSheet, RefreshControl, Text,
} from 'react-native';
import { connect } from 'react-redux';
import ListItem from '../components/SundryExpenseHistoryItem';
import { SundryExpenseHistory } from '../services/SandryExpenseHistory';


const styles = StyleSheet.create({
  indicator: { height: '100%', width: '100%', justifyContent: 'center' },
  list: { marginBottom: 10, height: '100%' },
  listContainer: { paddingBottom: 20, marginBottom: 30 },
  emptyContainer: {
    justifyContent: 'center', height: '100%', width: '100%', marginTop: 20
  },
  emptyListItem: { alignSelf: 'center', fontSize: 16 }
});

class SandryExpenseHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    };
    this.historyData = [];
    this.historyDataRev = [];
  }

  async componentDidMount() {
    this.getHistory();
  }

  getHistory=async () => {
    const response = await SundryExpenseHistory(this.props.user);
    if (response) {
      this.historyData = response.SubmittedData[0];
      this.setState({ isLoading: false, refreshing: false });
    } else {
      this.setState({ isLoading: false, refreshing: false });
    }
  }

  refresh=() => {
    this.setState({ refreshing: true });
    this.getHistory();
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
            data={this.historyData}
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
                console.log("itemvvvvvvv",item),
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

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});

export default connect(
  mapStateToProps,
)(SandryExpenseHistory);
