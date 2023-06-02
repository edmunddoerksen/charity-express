import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { getNotifications } from '../api/getNotification';
import auth from '../utils/auth';

function Notification({ show, setShowNotif }) {
  setShowNotif(show);
  const [batchOfIndex, setBatchOfIndex] = useState(0);
  const [notifsData, setNotifsData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  /* This notif is styled in index.css file identified by the id myNotifBox
      ToDo: we will default the fetch API to fetch 5 notifications every time we call the API.
  */
  // initial fetch. run on first render

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getNotifications(batchOfIndex, auth.getUserId());
        setNotifsData([...notifsData, ...response]);
        setBatchOfIndex(batchOfIndex + 10);
        return response;
      } catch (err) {
        return err;
      }
    };
    getData();
  }, [show]);

  const fetchNextBatchOfData = async () => {
    // console.log(notifsData.length);
    /* Suppose we have 500 notifications for a user,
    we only want to show the most recent 200 notifications */
    if (notifsData.length >= 23) {
      setHasMore(false);
      return;
    }
    // console.log('my batch of index is ', batchOfIndex)
    const response = await getNotifications(batchOfIndex, auth.getUserId());
    // console.log('i was in infinite scroll', response)
    setNotifsData([...notifsData, ...response]);
    setBatchOfIndex(batchOfIndex + 10);
  };

  return (
    <div
      className="rounded shadow-sm text-black text-sm"
      id="myNotifBox"
      style={{ display: show ? 'block' : 'none' }}
    >
      <h2 className="text-base p-3 text-center" data-testid="notifications">
        Notifications
      </h2>

      {/*  <div className="absolute">
        {notifsData.map((obj) => (
          <div
            key={obj.message}
            className="flex flex-col justify-center p-2 bg-white
            border-b-2 border-black hover:bg-slate-200"
          >
            <div className="flex">
              <span className="mr-1">
                From user
                {obj.recipientID}
              </span>
              <p className="">
                On
                {obj.timeStamp}
              </p>
            </div>

            <p>{obj.message}</p>
          </div>
        ))}
        <a
          href="/"
          className="absolute bottom-0 left-28 text-blue-500 underline "
        >
          <p className="">See more</p>
        </a>
      </div>
       */}
      {/* Experimenting */}
      <div id="scrollableDiv" style={{ height: 500, overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={notifsData ? notifsData.length : 0}
          next={() => {
            fetchNextBatchOfData();
          }}
          hasMore={hasMore}
          loader={(
            <div className="text-center">
              <h4>Loading hard...</h4>
            </div>
          )}
          scrollableTarget="scrollableDiv"
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          {notifsData
            && notifsData.map((obj) => (
              <div
                key={obj.message}
                className="flex flex-col justify-center p-2 bg-white  border-b-2 border-black hover:bg-slate-200"
              >
                <div className="flex">
                  <span className="mr-1">
                    From user
                    {' '}
                    {obj.senderID}
                  </span>
                  <p className="text-md">
                    On
                    {' '}
                    {new Date(obj.timeStamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p>{obj.message}</p>
                </div>
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

Notification.propTypes = {
  show: PropTypes.bool,
  setShowNotif: PropTypes.func,
};

Notification.defaultProps = {
  show: PropTypes.bool,
  setShowNotif: () => null,
};

export default Notification;
