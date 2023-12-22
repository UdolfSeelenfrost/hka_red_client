import {Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Button} from "react-native";
import * as React from "react";
import {useState, useEffect} from "react";

function SearchScreenComponent({ navigation }) {
    const [subreddits, setSubreddits] = useState([]);
    const [search, setSearch] = useState("")

    const fetchSubreddits = (searchTerm) => {

        const apiUrl = "https://www.reddit.com/subreddits/search.json?q=" + searchTerm;
        setSearch(searchTerm);
        fetch(apiUrl)
            .then(response => response.json())
            .then(json => json.data.children)
            .then(children => children.map(child =>
                ({
                    "display_name" : child.data.display_name,
                    "subscribers" : child.data.subscribers,
                    "title" : child.data.title,
                    "url" : child.data.url
                })
            ))
            .then(children => setSubreddits(children))
            .catch(error => {
                console.log(error)
            })
    }

    const ItemView = ({item}) => {

        return (
            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('Home', {
                    subredditName: item.display_name,
                });
            }}>
                <View style={styles.itemStyle}>
                    <Text style={styles.subName}>
                        {item.display_name}
                    </Text>
                    <Text >
                        {item.subscribers}{" subscribers"}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    onChangeText={(text) => fetchSubreddits(text)}
                    value={search}
                    placeholder={"Search here!"}
                />
                <FlatList
                    data={subreddits}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4d4c4c',
    },
    itemStyle: {
        padding: 10,
    },
    searchBar: {
        height: 50,
        borderWidth: 1,
        borderColor: "#1239ab",
        margin: 5,
        paddingLeft: 20,
        backgroundColor: "white",
        borderRadius: 10
    },
    subName: {
        fontWeight: "bold",
        fontSize: 15
    },
    button: {
        backgroundColor: '#ffffff',
        padding: 2,
        margin: 4
    }
});

export default SearchScreenComponent;