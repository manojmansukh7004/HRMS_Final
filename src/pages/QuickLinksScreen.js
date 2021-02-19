import React, { Component } from 'react';
import {
  View, Platform, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import MessageModal from '../components/MessageModal';


const styles = StyleSheet.create({
  webViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (Platform.OS) === 'ios' ? 20 : 0
  },
  activityIndicator: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class QuickLinksScreen extends Component {
  static navigationOptions=({ navigation }) => ({
    title: navigation.getParam('title'),
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.uri = this.props.navigation.getParam('uri');
  }

  hideSpinner=() => {
    this.setState({ isLoading: false });
  }

  showSpinner=() => {
    this.setState({ isLoading: true });
  }


  render() {
    return (

      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: this.uri }}
          style={styles.webViewStyle}
          javaScriptEnabled
          onLoadStart={() => this.showSpinner()}
          onLoad={() => this.hideSpinner()}
        />
        {
        this.state.isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color={this.props.secondaryColor} />
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
  messages: state.messageData.messages
});

export default connect(mapStateToProps,)(QuickLinksScreen);
