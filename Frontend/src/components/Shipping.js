import React, { useEffect } from 'react';
import axios from 'axios';
import fetch from 'node-fetch';
import config from '../config';
// import { getAuthorized } from '../api/shipping';

function Shipping() {
  // const access_token = useRef('')

  useEffect(() => {
    const gettingFedexApproval = async () => {
      try {
        // console.log(`http://${config.server_host}:${config.server_port}/fedexShipping`);
        // ToDo: change this such that it only fetch every 30 minutes or smth
        fetch(
          `http://${config.server_host}:${config.server_port}/fedexShipping`,
        )
          .then((res) => res.json()) // return a json
          .then((myJson) => myJson.access_token)
          // get the json and set to the ref value
          // ToDo: this definitely requires some refactoring
          .then(async (myX) => {
            try {
              // const headers = {
              //   'Content-Type': 'application/json',
              // };
              const res = await axios.post(
                `http://${config.server_host}:${config.server_port}/createLabel`,
                {
                  access_token: myX,
                },
              );
              // console.log(
              //   res.data.transactionShipments[0].pieceResponses[0]
              //     .packageDocuments[0].url,
              // );
              return res;
            } catch (err) {
              // console.log('my error is', err);
              return err;
            }
          });
      } catch (err) {
        // console.log('my error is', err);
      }
    };
    gettingFedexApproval();
  }, []);
  return (
    <div>
      <p>I am shipping</p>
    </div>
  );
}

export default Shipping;
