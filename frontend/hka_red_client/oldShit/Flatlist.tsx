import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

const FlatListBasics = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    {key: 'Devin'},
                    {key: 'Dan'},
                    {key: 'Dominic'},
                    {key: 'Jackson'},
                    {key: 'James'},
                    {key: 'Joel'},
                    {key: 'John'},
                    {key: 'Jillian'},
                    {key: 'Jimmy'},
                    {key: 'Julie'},
                    {key: 'sd'},
                    {key: 'Juasdasdlie'},
                    {key: 'Julasdasie'},
                    {key: 'Juasdfflie'},
                    {key: 'Julfdsfsdie'},
                    {key: 'Julgfdgdie'},
                    {key: 'Jusdfasdlie'},
                    {key: 'Jucdrgelie'},
                    {key: 'Julfsdfasdagwe4sdfie'},
                    {key: 'Julfsdfasdsdfie'},
                    {key: 'Julfsdfewfw123sdfie'},
                    {key: 'Julfsdfe4tsdfie'},
                    {key: 'Julfsdf345t34tu6sdfie'},
                    {key: 'hthtz'},

                ]}
                renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
            />
        </View>
    );
};

export default FlatListBasics;