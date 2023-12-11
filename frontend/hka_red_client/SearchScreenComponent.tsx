import {Text, View, StyleSheet, FlatList, TextInput} from "react-native";
import * as React from "react";
import {useState, useEffect} from "react";

function SearchScreenComponent() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [search, setSearch] = useState("")


    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {

        const apiUrl = "https://jsonplaceholder.typicode.com/posts";

        fetch(apiUrl)
            .then(response => response.json())
            .then((posts) => {
                setPosts(posts);
                setFilteredPosts(posts);
            })
            .catch(error => {
                console.log(error)
            })

        console.log(posts.map(post => post.id.toString() + ", "));
    }

    const searchFilter = (text) => {
        if(text) {
            const textData = text.toUpperCase();

            const newPosts = posts.filter((post) => {
                const postData = post.title ? post.title.toUpperCase() : ''.toUpperCase();
                return postData.indexOf(textData) > -1;
            })

            setFilteredPosts(newPosts);
            setSearch(text);
        }
        else {
            setFilteredPosts(posts);
        }
        setSearch(text);
    }


    const ItemView = ({item}) => {
        return (
            <Text style={styles.itemStyle}>
                {item.id}{". "}{item.title.toUpperCase()}
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
                    onChangeText={(text) => searchFilter(text)}
                    value={search}
                    placeholder={"Search here!"}
                />
                <FlatList
                    data={filteredPosts}
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