import Fetch from 'isomorphic-fetch';
import Error from 'next/error';
import StoryList from '../components/StoryList';
import Layout from '../components/Layout';
import Link from 'next/link';

class Index extends React.Component {
    static async getInitialProps({req, res, query}) {
        let stories;
        let page;
        try {
            page = Number(query.page) || 1;
            const res = await Fetch(
                `https://node-hnapi.herokuapp.com/news?page=${page}`,
            );
            stories = await res.json();
        } catch (err) {
            stories = [];
        }
        return {stories, page};
    }

    componentDidMount() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(registration => {
                    console.log(
                        'service worker registration successful',
                        registration,
                    );
                })
                .catch(err => {
                    console.warn(
                        'service worker registration failed',
                        err.message,
                    );
                });
        }
    }

    render() {
        const {stories, page} = this.props;
        if (stories.length === 0) {
            return <Error statusCode='503' />;
        }
        return (
            <Layout
                title='Hacker Next'
                description='A hacker news clone made with Next js'
            >
                <StoryList stories={stories} />
                <footer>
                    {page <= 1 ? null : (
                        <Link href={`/?page=${page <= 1 ? 1 : page - 1}`}>
                            <a className='previous'>
                                Previous page ({page <= 1 ? 1 : page - 1})
                            </a>
                        </Link>
                    )}

                    <Link href={`/?page=${page + 1}`}>
                        <a className='next'>Next page ({page + 1})</a>
                    </Link>
                </footer>

                <style jsx>{`
                    footer {
                        padding: 1em;
                        display: flex;
                        justify-content: space-between;
                    }
                    footer a {
                        text-decoration: none;
                        display: inline-block;
                        padding: 8px 16px;
                    }

                    footer a:hover {
                        /* background-color: #ddd; */
                        color: black;
                    }

                    footer .previous {
                        background-color: #f1f1f1;
                        color: black;
                    }

                    footer .previous:hover {
                        filter: brightness(85%);
                    }

                    footer .next {
                        background-color: #4caf50;
                        color: black;
                    }
                    footer .next:hover {
                        filter: brightness(85%);
                    }
                `}</style>
            </Layout>
        );
    }
}

export default Index;
