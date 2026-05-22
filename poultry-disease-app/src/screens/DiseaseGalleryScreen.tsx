import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiseaseGalleryScreen = () => (
  <View style={styles.container}>
    <Text>Disease Gallery Screen</Text>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
export default DiseaseGalleryScreen;
