import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function HomeScreen({ route, navigation }) {
  const { subredditName } = route.params;
  const [posts, setPosts] = useState([]);

  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [downvotedPosts, setDownvotedPosts] = useState([]);

  useEffect(() => {
    fetchPosts(subredditName);
  }, [subredditName]);

  const ItemView = ({ item }) => {
    const isUpvoted = (item) => {
      if (upvotedPosts.includes(item.name)) {
        setUpvotedPosts(upvotedPosts.filter((post) => post !== item.name));
        return;
      }

      if (downvotedPosts.includes(item.name)) {
        setDownvotedPosts(downvotedPosts.filter((post) => post !== item.name));
      }

      setUpvotedPosts((upvotedPosts) => [...upvotedPosts, item.name]);
    };

    const isDownvoted = (item) => {
      if (downvotedPosts.includes(item.name)) {
        setDownvotedPosts(downvotedPosts.filter((post) => post !== item.name));
        return;
      }

      if (upvotedPosts.includes(item.name)) {
        setUpvotedPosts(upvotedPosts.filter((post) => post !== item.name));
      }

      setDownvotedPosts((downvotedPosts) => [...downvotedPosts, item.name]);
    };

    const handlePostClick = () => {
      navigation.navigate("Detail", {
        currentPost: item,
      });
    };

    return (
      <View>
        <TouchableOpacity onPress={handlePostClick}>
          <View style={styles.postContainer}>
            <View style={styles.postTopPartContainer}>
              <View style={styles.postTextContainer}>
                <Text style={styles.authorAge}>
                  u/{item.author} • {item.created}h
                </Text>
                <Text style={styles.Title}>{item.title}</Text>
              </View>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              ></Image>
            </View>
            <View style={styles.postBottomPartContainer}>
              <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => isUpvoted(item)}>
                  <MaterialCommunityIcons
                    name="arrow-up-circle-outline"
                    color={
                      upvotedPosts.includes(item.name) ? "#e00c0c" : "#000000"
                    }
                    size={28}
                  />
                </Pressable>
                <Text style={{ paddingTop: 4 }}>{item.score}</Text>
                <Pressable onPress={() => isDownvoted(item)}>
                  <MaterialCommunityIcons
                    name="arrow-down-circle-outline"
                    color={
                      downvotedPosts.includes(item.name) ? "#e00c0c" : "#000000"
                    }
                    size={28}
                  />
                </Pressable>
              </View>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="comment-outline"
                  color={"#000000"}
                  size={28}
                />
                <Text style={{ paddingTop: 4 }}>{item.num_comments}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchPosts = (subredditName) => {
    const apiUrl =
      "https://r-3l7bazumfq-ey.a.run.app/" + subredditName.toLowerCase();

    fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => json.children)
      .then((children) =>
        children.map((child) => ({
          author: child.author,
          title: child.title,
          subreddit: child.subreddit,
          score: child.score,
          permalink: child.permalink,
          num_comments: child.num_comments,
          subreddit_id: child.subreddit_id,
          created: Math.trunc(
            (Date.now() / 1000 - parseFloat(child.created)) / 60 / 60
          ),
          thumbnail:
            "https://b.thumbs.redditmedia.com/bPmSoIk89dnWGWKrUmbzPfmgF4HA0yMJ6jDV2knTp7U.jpg",
          name: child.name,
        }))
      )
      .then((children) => setPosts(children))
      .catch((error) => {
        console.log(error);
      });

  };

  const ItemSeperatorView = () => {
    return <View style={styles.itemSeparator} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>This is a header</Text>
        <FlatList
          data={posts}
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
    backgroundColor: "white",
  },
  Title: {},
  authorAge: {
    color: "#575656",
  },
  thumbnail: {
    flex: 1,
    paddingLeft: 5,
    height: 80,
    width: 80,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5,
  },
  itemSeparator: {
    height: 1.5,
    width: "100%",
    backgroundColor: "#645d5d",
  },
  postTextContainer: {
    flex: 3,
  },
  postTopPartContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
  },
  postBottomPartContainer: {
    paddingTop: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  postContainer: {
    padding: 10,
  },
});

export default HomeScreen;
