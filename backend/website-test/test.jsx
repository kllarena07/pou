import React from 'react';
import Head from 'next/head';

class Home extends React.Component {
  static async getInitialProps(context) {
    const data = await fetch('https://api.example.com/posts').then((res) =>
      res.json()
    );

    return {
      posts: data,
    };
  }

  render() {
    const { posts } = this.props;

    return (
      <div>
        <Head>
          <title>Outdated Next.js Example</title>
        </Head>
        <h1>Outdated Next.js Example</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Home;