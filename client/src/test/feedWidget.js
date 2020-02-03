import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css';

import FeedArea from './feedArea';
import './feedWidget.css'
import axios from 'axios';

class FeedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      route: 'true',
      pending: 'true',
      data: [],
      paged: 1,
    }

    this.trackScrolling = this.trackScrolling.bind(this);
  }

  compare(a, b) {
    const dataA = a.date;
    const dateB = b.date;

    let comparison = 0;
    if (dataA < dateB) {
      comparison = 1;
    } else if (dataA > dateB) {
      comparison = -1;
    }
    return comparison;
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling() {
    const wrappedElement = document.getElementById('feed-area-image');
    if (this.isBottom(wrappedElement)) {
      const currentPaged = this.state.paged + 1;
      this.setState({
        paged: currentPaged
      })

      if (Array.isArray(this.props.feedurl)) {
        const feedList = this.props.feedurl.map((url) => {
          return url.url + '?paged=' + this.state.paged + 1;
        })

        for (var i = 0; i < feedList.length; i++) {
          try {
            axios.post('/api/feed', { url: feedList[i] })
              .then(({ data: { data: feedData } }) => {
                let { data } = this.state;
                data = [...data, ...feedData];
                this.setState({
                  pending: false,
                  data
                })
              })
              .catch(err => {
                console.log(err)
              })
          } catch (error) {
            console.log("error", error)
          }
        }
      } else {
        try {
          this.setState({
            pending: true,
          })
          axios.post('/api/feed', { url: this.props.feedurl + '?paged=' + this.state.paged + 1 })
            .then(({ data: { data: feedData } }) => {
              let { data } = this.state;
              data = [...data, ...feedData];
              this.setState({
                pending: false,
                data
              })
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  };

  componentDidMount() {
    const { feedurl, main } = this.props;
    this.setState({
      route: main,
      data: [],
    })

    document.addEventListener('scroll', this.trackScrolling);

    if (main) {
      const feedList = feedurl.map((url) => {
        return url.url;
      })

      for (var i = 0; i < feedList.length; i++) {
        try {
          axios.post('/api/feed', { url: feedList[i] })
            .then(({ data: { data: feedData } }) => {
              let { data } = this.state;
              data = [...data, ...feedData];
              this.setState({
                pending: false,
                data
              })
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  }

  componentDidUpdate(preProps) {

    const { feedurl, main } = this.props;
    if (feedurl !== preProps.feedurl) {
      this.setState({
        route: main,
        data: [],
        paged: 1
      })

      if (main) {
        const feedList = feedurl.map((url) => {
          return url.url;
        })

        for (var i = 0; i < feedList.length; i++) {
          try {
            this.setState({ pending: true })
            axios.post('/api/feed', { url: feedList[i] })
              .then(({ data: { data: feedData } }) => {
                let { data } = this.state;
                data = [...data, ...feedData];
                this.setState({
                  pending: false,
                  data
                })
              })
              .catch(err => {
                console.log(err)
              })
          } catch (error) {
            console.log("error", error)
          }
        }
      } else {
        try {
          this.setState({
            pending: true,
          })
          axios.post('/api/feed', { url: feedurl })
            .then(({ data: { data: feedData } }) => {
              let { data } = this.state;
              data = [...data, ...feedData];
              this.setState({
                pending: false,
                data
              })
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  render() {
    this.state.data.sort(this.compare);

    return (
      <div className="feed-area-image" id="feed-area-image" onScroll={this.trackScrolling}>
        {this.state.pending ? (
          <div className="image-area">
            <img src="logos/loading-gif1.gif" alt="" />
          </div>
        ) : (
            <div className="row">
              {this.state.data && this.state.data.map((feed) => {
                return (
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-4 feed-area">
                    <FeedArea
                      feedContent={feed}
                    />
                  </div>
                )
              })}
            </div>
          )}
      </div>
    )
  }
}

FeedWidget.propTypes = {
  urlList: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  urlList: state.feed
});

export default connect(mapStateToProps)(FeedWidget);
