import React, { useState } from 'react';
import { connect } from 'react-redux';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAlt';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FeedWidget from './components/feedWidget';

import './App.css';

const FeedConfigList = [
  {
    'route': 'merryjane',
    'url': 'https://merryjane.com/feed/all.rss',
    'image': 'logos/merry-jane-logo.png'
  },
  {
    'route': 'hightimes',
    'url': 'https://hightimes.com/news/feed/',
    'image': 'logos/high-times-logo.png'
  },
  {
    'route': 'cannalaw',
    'url': 'https://www.cannalawblog.com/feed/',
    'image': 'logos/canna-law-blog-log.png'
  },
  // {
  //   'route': 'leafly',
  //   'url': 'https://www.leafly.com/feed',
  //   'image': 'logos/leafly-logo.png'
  // },
  // {
  //   'route': 'cannabisculture',
  //   'url': 'https://www.cannabisculture.com/feed/',
  //   'image': 'logos/cannabis-culture-logo.png'
  // },
  {
    'route': 'marijuanadaily',
    'url': 'https://mjbizdaily.com/feed/',
    'image': 'logos/marijuana-daily-logo.png'
  },
  // {
  //   'route': 'freshtoast',
  //   'url': 'https://thefreshtoast.com/feed/',
  //   'image': 'logos/fresh-toast-logo.png'
  // },
  {
    'route': 'medicalmarijuana',
    'url': 'https://www.medicalmarijuanainc.com/feed/',
    'image': 'logos/medical-marijuana-logo.png'
  },
  {
    'route': 'grizzle',
    'url': 'https://grizzle.com/marijuana/feed/',
    'image': 'logos/grizzle-logo.png'
  },
  {
    'route': 'liwts',
    'url': 'https://www.liwts.org/feed/',
    'image': 'logos/liwts-logo.png'
  },
  {
    'route': 'cannabist2',
    'url': 'https://www.thecannabist.co/feed/',
    'image': 'logos/cannabist2-logo.png'
  },
  {
    'route': 'cannabisnet',
    'url': 'https://cannabis.net/rss/blog',
    'image': 'logos/cannabis-net-log.png'
  },
  {
    'route': 'marijuana',
    'url': 'https://www.marijuana.com/feed/',
    'image': 'logos/marijuana-com-logo.png'
  },
];

function App(props) {

  const [main, setMain] = useState(true);
  const [feedUrl, setFeedUrl] = useState(FeedConfigList);
  const [active, setActive] = useState('');
  const [rightBarOpen, setRightBar] = useState('');
  const [contentBarOpen, setContenttBar] = useState('');

  const menuClick = () => {
    setRightBar('rightBarOpen');
    setContenttBar('contentBarOpen');
  }

  return (
    <div className="App">
      <div className="content">
        <div className={`sidebar ` + rightBarOpen}>
          {rightBarOpen !== 'rightBarOpen' ? (
            <div className="logo">
              <img src="logos/WeedFeed.png" onClick={() => { setFeedUrl(FeedConfigList); setMain(true); setActive(''); }} alt="" />
            </div>
          ) : (
              <div className="close" onClick={() => { setRightBar(''); setContenttBar(''); }} >
                <img src="logos/close-icon.png" alt="" />
              </div>
            )}
          <div className="feedurl">
            <ul className="navbar-nav mr-auto">
              {
                FeedConfigList.map((feed, index) => {
                  return (
                    <li className="nav-link" key={index} onClick={() => { setRightBar(''); setContenttBar(''); setActive(feed.url); }}>
                      {active === feed.url ? (
                        <ArrowRightIcon />
                      ) : (null)}

                      <img src={feed.image} onClick={() => { setFeedUrl(feed.url); setMain(false) }} alt="" />
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
        <div className="mainbar">
          {rightBarOpen !== 'rightBarOpen' ? (
            <div className="topbar">
              <span><img src="logos/top-logo.png" alt="" /></span>
              <span><img src="logos/top-text-logo.png" alt="" /></span>
              <span><img src="logos/top-menu-icon.png" onClick={menuClick} alt="" /></span>
            </div>
          ) : (null)}
          <div className={`contentbar ${contentBarOpen}`}>
            <FeedWidget {...props} feedurl={feedUrl} main={main} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div >
  );
}
const mapStateToProps = (state) => ({
  feed: state.feed
});

export default connect(mapStateToProps)(App);