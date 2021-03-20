/* eslint-disable max-len */
import React, { Component, } from 'react';
import {
    Text, View, StyleSheet, Image, FlatList, Alert, PermissionsAndroid, Platform,
    TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { Card } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const RNFS = require('react-native-fs');

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around'
    },
    flex: {
        flex: 1,
    },
    textGray: {
        color: 'gray',
        fontSize: 12
    },
    textType: {
        color: 'black',
        fontSize: 14
    },
    containerFiles: {
        flex: 2,
        marginTop: 2,
        height: 80,
    },
    text: {
        color: '#4a4a4a',
        fontSize: 15,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#e4e4e4',
        marginLeft: 10,
    },
    leftAction: {
        backgroundColor: '#388e3c',
        justifyContent: 'center',
        flex: 1,
    },
    rightAction: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        margin: 1,
        padding: 10
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
    },
    containerFile: {
        padding: 5,
        height: 50,
        width: 40,
        margin: 2
    },
    image: {
        height: 30,
        width: 30
    },
    textFileName: {
        fontSize: 10
    },
    icon: {
        position: 'absolute',
        top: 0,
        right: 0,
    }

});

class SundryExpenseHistoryItem extends Component {
    state = {
        isExpanded: false,
    };

    onPress = () => {
        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded,
        }));
    }
    getColor = (status) => {
        if (status === 'Approved') {
            return {
                color: '#ADDB31'
            };
        } if (status === 'Rejected') {
            return {
                color: '#E76E54'
            };
        }
        return {
            color: '#75B9EE'
        };
    }

    render() {
        const RightActions = ({ progress, dragX, onPress }) => {
            const scale = dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            });
            return (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity onPress={() => this.props.onPressEdit(this.props.item)}>
                        <View style={styles.rightAction}>
                            <SimpleLineIcon name="pencil" color="black" size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.onPressDelete(this.props.item)}>
                        <View style={styles.rightAction}>
                            <EvilIcons name="trash" color="black" size={32} />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        };

        return (

            <Swipeable
                onSwipeableLeftOpen={() => { }}
                renderRightActions={(progress, dragX) => (
                    <RightActions progress={progress} dragX={dragX} onPress={() => { }} />
                )}
            >
                <Card elevation={2} style={styles.container} onPress={this.onPress}>

                    <View style={styles.row}>
                        <View style={styles.flex}>
                            <Text style={styles.textGray}>Expense Date</Text>
                            <Text style={styles.textType}>{this.props.item.ExpenseDate}</Text>
                        </View>

                        <View style={styles.flex}>
                            <Text style={styles.textGray}>Expense Type</Text>
                            <Text style={styles.textType}>{this.props.item.ExpenseTypeName}</Text>
                        </View>

                        <View style={styles.flex}>
                            <Text style={styles.textGray}>Expense Amount</Text>
                            <Text style={styles.textType}>{this.props.item.ExpenseAmount}</Text>
                        </View>

                    </View>

                    {
                        this.state.isExpanded
                            ? (
                                <View style={{ marginTop: 8 }}>
                                    <Text style={styles.textGray}>Description</Text>
                                    <Text style={styles.textType}>{this.props.item.Description}</Text>

                                    <View style={[styles.row, { marginTop: 8 }]}>
                                        <View style={styles.flex}>
                                            <Text style={styles.textGray}>No of Bills</Text>
                                            <Text style={styles.textType}>{this.props.item.NoofBills}</Text>
                                        </View>
                                        <View style={styles.flex}>
                                            <Text style={styles.textGray}>Assigned To :</Text>
                                            <Text style={styles.textType}>{this.props.item.AssignedTo}</Text>
                                        </View>
                                        <View style={styles.flex}>
                                            <SimpleLineIcon name={"note"} color="white" size={20} />
                                        </View>
                                    </View>
                                </View>
                            ) : null
                    }

                </Card>
            </Swipeable>

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
)(SundryExpenseHistoryItem);
