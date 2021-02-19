/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  FlatList, View, ActivityIndicator, StyleSheet, RefreshControl, Text,
} from 'react-native';
import { connect } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import { getCompletedTasks } from '../services/InboxCompletedTasksService';
import CompletedTasksItem from '../components/CompletedTasksItem';
import { setCompletedTasks } from '../redux/actions/user';


const styles = StyleSheet.create({
  contianer: {

  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  }
});

class CompletedTasksScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tasks: this.props.completedTasks,
      refreshing: false,
    };
    this.tasks = this.props.completedTasks;
  }

  async componentDidMount() {
    this.getTasks();
  }

  getTasks =async () => {
    const response = await getCompletedTasks(this.props.user);
    this.setState({
      tasks: response.CompletedTasks[0],
      loading: false,
      refreshing: false,
    });
    this.props.setCompletedTasks(response.CompletedTasks[0]);
    // eslint-disable-next-line prefer-destructuring
    this.tasks = response.CompletedTasks[0];
  }

  refresh= () => {
    this.setState({ refreshing: true, query: '' });
    this.getTasks();
  }

  onChangeText = text => {
    this.setState({ query: text });
    if (text.length > 0) {
      const tasks = this.tasks.filter(i => i.Name.toLowerCase().includes(text.toLowerCase())
      || i.ProcessText.toLowerCase().includes(text.toLowerCase())
      || i.ApproverAction.toLowerCase().includes(text.toLowerCase())
      || i.ApproverComments.toLowerCase().includes(text.toLowerCase())
      || i.InitiatedDate.toLowerCase().includes(text.toLowerCase())
      || i.ActionTakenOn.toLowerCase().includes(text.toLowerCase()));
      this.setState({ tasks });
    } else {
      this.setState({ tasks: this.props.completedTasks });
    }
  }

  render() {
    return (
      <View>
        {
          this.state.loading ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
            : (

              <View>
                <View>
                  <Searchbar
                    placeholder="Search"
                    selectionColor={this.props.secondaryColor}
                    inputStyle={
                      {
                        padding: 0,
                        fontSize: 16,
                        margin: 0,
                        alignSelf: 'center',
                        elevation: 0
                      }
                    }
                    style={{
                      margin: 10,
                      borderRadius: 4,
                      backgroundColor: '#E5E5E5',
                      height: 40,
                      elevation: 0,
                      marginTop: 20
                    }}
                    onChangeText={query => this.onChangeText(query)}
                    value={this.state.query}
                  />
                </View>
                <FlatList
                  data={this.state.tasks}
                  style={{ marginBottom: 70 }}
                  contentContainerStyle={{ paddingBottom: 70, }}
                  refreshControl={(
                    <RefreshControl
                      colors={[this.props.secondaryColor]}
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.refresh()}
                    />
                  )}
                  renderItem={({ item }) => (
                    <CompletedTasksItem
                      item={item}
                    />
                  )}
                  ListEmptyComponent={() => <Text style={{ margin: 10 }}>No tasks found.</Text>}
                  keyExtractor={item => item.id}
                />
              </View>

            )
        }
      </View>
    );
  }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  completedTasks: state.user.completedTasks
});


const mapDispatchToProps = dispatch => ({
  setCompletedTasks: tasks => {
    dispatch(setCompletedTasks(tasks));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedTasksScreen);
