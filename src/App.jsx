import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
function App() {
  const [subreddit, setSubreddit] = useState("forhire");
  const [query, setQuery] = useState("hiring web");
  const [restrictSubreddit, setRestrictSubreddit] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async (subreddit, query, restrictSubreddit) => {
    let result;
    if (restrictSubreddit) {
      result = await axios.get(
        `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=1&sort=new&limit=1000`
      );
    } else {
      result = await axios.get(
        `https://www.reddit.com/search.json?q=${query}&sort=new&limit=1000`
      );
    }
    const newPosts = result.data.data.children.map((post) => post.data);
    const filteredPosts = newPosts.filter((post) => /hiring/i.test(post.title));
    setPosts(filteredPosts);
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
    <div className="px-10 md:px-40">
      <form className="py-5">
        <input
          className="mb-2 mr-5 font-semibold transition duration-75 border-0 rounded-lg shadow-sm md:mb-0 bg-slate-700 shadow-slate-500 hover:bg-slate-500"
          type="text"
          value={subreddit}
          onChange={subredditHandler}
        />
        <input
          className="mb-2 mr-5 font-semibold transition duration-75 border-0 rounded-lg shadow-sm md:mb-0 bg-slate-700 shadow-slate-500 hover:bg-slate-500"
          type="text"
          value={query}
          onChange={queryHandler}
        />
        <p className="inline-block mr-1 font-semibold text-slate-300">
          Restrict Subreddit
        </p>
        <input
          className="mr-5 rounded bg-slate-700"
          type="checkbox"
          checked={restrictSubreddit}
          onChange={restrictSubredditHandler}
        />
        <button
          className="px-4 py-1 font-semibold rounded-full shadow-sm bg-slate-400 text-slate-900 hover:bg-slate-200 shadow-slate-500"
          onClick={submitHandler}
        >
          Submit
        </button>
      </form>
      <Posts posts={posts} />
    </div>
  );
}

function Posts({ posts }) {
  if (posts.length == 0) {
    return (
      <div class="grid h-screen place-items-center">
        <p className="mb-40 text-4xl font-thin text-slate-300">
          Loading Posts...
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
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
    <a
      className="p-4 break-words transition duration-75 rounded-lg shadow-sm bg-slate-700 hover:scale-105 hover:bg-slate-600 shadow-slate-500"
      href={`https://www.reddit.com${post.permalink}`}
      target="_blank"
    >
      <p className="mb-1 text-sm text-slate-300">
        r/{post.subreddit} {date(post.created_utc)}
      </p>
      <p className="mb-5 text-xl font-semibold">{truncate(post.title, 200)}</p>
      <p>{truncate(post.selftext, 500)}</p>
    </a>
  );
}

export default App;
