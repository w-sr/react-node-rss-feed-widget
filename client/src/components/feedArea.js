import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import './feedWidget.css'

const useStyles = makeStyles(theme => ({
  card: {
    width: 345,
    height: 500,
    border: 'solid 1px #979797',
    "&:hover": {
      opacity: 0.7
    }
  },
}));

function FeedArea(
  feedContent
) {
  const classes = useStyles();

  const oncli = () => {
    window.open(feedContent.feedContent.url);
  }

  return (
    <div className={classes.card} onClick={oncli}>
      <div className="title">
        <p>{feedContent.feedContent.title}</p>
      </div>
      <div className="source">
        <p>{feedContent.feedContent.publisher}</p>
      </div>
      <div className="image-div">
        <img src={feedContent.feedContent.image} className="image" alt="" />
      </div>
      <div className="description">
        <p>{feedContent.feedContent.description}</p>
      </div>
      <div className="date">
        {feedContent.feedContent.date ? (
          <p>{feedContent.feedContent.date.split('T')[0]}</p>
        ) : (
            null
          )}
      </div>
    </div>
  );
}

export default FeedArea;
