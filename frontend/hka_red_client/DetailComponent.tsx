import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";

interface Comment {
  score: number;
  author: string;
  permalink: string;
  parent_id: string;
  body: string;
}

function DetailComponent({ route, navigation }) {
  const { currentPost } = route.params;
  const [upvotedPosts, setUpvotedPosts] = useState([]);

  const [downvotedPosts, setDownvotedPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments(currentPost.subreddit, currentPost.name.slice(3));
  }, [currentPost]);

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
  const fetchComments = (subredditName: string, subreddit_id: string) => {
    const apiUrl =
      "https://r-3l7bazumfq-ey.a.run.app/" +
      subredditName.toLowerCase() +
      "/comments/" +
      subreddit_id;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => json.children)
      .then((children) =>
        children.map(
          (child) =>
            ({
              score: child.score,
              author: child.author,
              permalink: child.permalink,
              parent_id: child.parent_id,
              body: child.body,
            } as Comment)
        )
      )
      .then((children) => setComments(children))
      .catch((error) => {
        console.log(error);
      });
  };

  const ItemSeperatorView = () => {
    return <View style={styles.itemSeparator} />;
  };

  const CommentView = ({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons name="account" color={"#000000"} size={25} />
          <Text style={styles.commentAuthor}>{item.author}</Text>
        </View>
        <Text>{item.body}</Text>

        <View style={{ flexDirection: "row-reverse" }}>
          <MaterialCommunityIcons
            name="comment-outline"
            color={"#000000"}
            size={28}
          />
          <Text style={{ paddingTop: 4 }}>{currentPost.num_comments}</Text>
          <Pressable onPress={() => isUpvoted(currentPost)}>
            <MaterialCommunityIcons
              name="arrow-up-circle-outline"
              color={
                upvotedPosts.includes(currentPost.name) ? "#e00c0c" : "#000000"
              }
              size={28}
            />
          </Pressable>
          <Text style={{ paddingTop: 4 }}>{item.score}</Text>
          <Pressable onPress={() => isDownvoted(currentPost)}>
            <MaterialCommunityIcons
              name="arrow-down-circle-outline"
              color={
                downvotedPosts.includes(currentPost.name)
                  ? "#e00c0c"
                  : "#000000"
              }
              size={28}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.postTopPartContainer}>
        <Text>{currentPost.subreddit}</Text>
        <Text style={styles.authorAge}>
          u/{currentPost.author} • {currentPost.created}h
        </Text>
        <Text style={styles.title}>{currentPost.title}</Text>
        <Image
          source={{ uri: currentPost.thumbnail }}
          style={styles.thumbnail}
        ></Image>
      </View>
      <View style={styles.postBottomPartContainer}>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => isUpvoted(currentPost)}>
            <MaterialCommunityIcons
              name="arrow-up-circle-outline"
              color={
                upvotedPosts.includes(currentPost.name) ? "#e00c0c" : "#000000"
              }
              size={28}
            />
          </Pressable>
          <Text style={{ paddingTop: 4 }}>{currentPost.score}</Text>
          <Pressable onPress={() => isDownvoted(currentPost)}>
            <MaterialCommunityIcons
              name="arrow-down-circle-outline"
              color={
                downvotedPosts.includes(currentPost.name)
                  ? "#e00c0c"
                  : "#000000"
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
          <Text style={{ paddingTop: 4 }}>{currentPost.num_comments}</Text>
        </View>
      </View>
      <View style={styles.commentContainer}>
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeperatorView}
          renderItem={CommentView}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  authorAge: {
    color: "#575656",
  },
  itemSeparator: {
    height: 3,
    width: "100%",
    backgroundColor: "#645d5d",
  },
  title: {
    fontSize: 25,
  },
  thumbnail: {
    paddingTop: 10,
    alignSelf: "center",
    height: 150,
    width: 150,
    borderColor: "#000000",
  },
  postTopPartContainer: {
    width: "100%",
    height: "30%",
  },
  postBottomPartContainer: {
    width: "100%",
    paddingTop: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    height: "10%",
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "60%",
  },
  commentAuthor: {
    fontSize: 18,
  },
});

export default DetailComponent;
