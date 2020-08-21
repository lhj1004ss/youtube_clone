import React, { useState, useEffect } from "react";
import Axios from "axios";

function Subscribe(props) {
  let variable = {
    userTo: props.userTo,
  };

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    Axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("failed to get the number of subscribers");
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/subscribe/subscribed", subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("failed to get subscribed information");
        }
      }
    );
  }, []);

  const onSubscribe = () => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    if (Subscribed) {
      // already subcribed to unsubscribe
      Axios.post("/api/subscribe/unSubscribe", subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("failed to cancel unsubscribe ");
          }
        }
      );
    } else {
      // no subscribed yet to subscribed
      Axios.post("/api/subscribe/subscribe", subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("failed to subcribe");
          }
        }
      );
    }
  };

  return (
    <div>
      <button
        style={{
          background: `${Subscribed ? "gray" : "red"}`,
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          textTransform: "uppercase",
          fontSize: "1rem",
          borderRadius: "4px",
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
