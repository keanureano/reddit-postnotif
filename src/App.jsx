import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
function App() {
  const [query, setQuery] = useState({
    subreddit: "forhire",
    search: "hiring web",
  });

  const [posts, setPosts] = useState([]);

  const getPosts = (subreddit, search) => {
    axios
      .get(
        `https://www.reddit.com/r/${subreddit}/search.json?q=${search}&restrict_sr=1&sort=new&limit=100`
      )
      .then((result) => {
        const newPosts = result.data.data.children.map((post) => post.data);
        const filteredPosts = newPosts.filter((post) =>
          /hiring/i.test(post.title)
        );
        console.log(filteredPosts);
        setPosts(filteredPosts);
      });
  };

  useEffect(() => {
    getPosts(query.subreddit, query.search);
  }, []);

  return (
    <div className="App">
      <div className="posts">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function Post({ post }) {
  const truncate = (text, maxLength) => {
    if (text.length < maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };
  const date = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).fromNow();
  };
  return (
    <div>
      <h3>{truncate(post.title, 200)}</h3>
      <h4>r/{post.subreddit}</h4>
      <h5>{date(post.created_utc)}</h5>
      <p>{truncate(post.selftext, 500)}</p>
      <a href={`https://www.reddit.com${post.permalink}`}>link</a>
    </div>
  );
}

export default App;
