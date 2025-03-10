import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Details from './Details';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List: React.FC<RouterProps> = ({ navigation }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </View>
    );
  };

export default List