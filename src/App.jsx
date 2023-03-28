import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
function App() {
  const [subreddit, setSubreddit] = useState("forhire");
  const [query, setQuery] = useState("hiring web");
  const [restrictSubreddit, setRestrictSubreddit] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = (subreddit, query, restrictSubreddit) => {
    axios
      .get(
        `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=${Number(
          restrictSubreddit
        )}&sort=new&limit=1000`
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

  const subredditHandler = (e) => {
    setSubreddit(e.target.value);
  };

  const queryHandler = (e) => {
    setQuery(e.target.value);
  };

  const restrictSubredditHandler = (e) => {
    setRestrictSubreddit(e.target.checked);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getPosts(subreddit, query, restrictSubreddit);
  };

  useEffect(() => {
    getPosts(subreddit, query, restrictSubreddit);
  }, []);

  return (
    <div>
      <form>
        <input type="text" value={subreddit} onChange={subredditHandler} />
        <input type="text" value={query} onChange={queryHandler} />
        <input
          type="checkbox"
          checked={restrictSubreddit}
          onChange={restrictSubredditHandler}
        />
        <button onClick={submitHandler}>Submit</button>
      </form>
      <div>
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
      <a href={`https://www.reddit.com${post.permalink}`} target="_blank">
        link
      </a>
    </div>
  );
}

export default App;
