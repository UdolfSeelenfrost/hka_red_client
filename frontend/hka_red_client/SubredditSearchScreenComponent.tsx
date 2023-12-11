import {Text, View, StyleSheet, FlatList, TextInput} from "react-native";
import * as React from "react";
import {useState, useEffect} from "react";
import searchScreenComponent from "./SearchScreenComponent";

type Subreddit = {
    display_name: string;
    subscribers: number;
    title: string;
    url: string;
}

function SearchScreenComponent() {
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


        console.log(subreddits)

    }

    const ItemView = ({item}) => {
        return (
            <Text style={styles.itemStyle}>
                {item.display_name}{", "}{item.subscribers}
            </Text>
        )
    }

    const ItemSeperatorView = () => {
        return (
            <View
                style={{height: 1.5, width: "100%", backgroundColor: "#0035ea"}}
            />
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
                    ItemSeparatorComponent={ItemSeperatorView}
                    renderItem={ItemView}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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
        backgroundColor: "white"

    }
});

export default SearchScreenComponent;