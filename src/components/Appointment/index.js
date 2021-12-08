import React from "react";

import "components/Appointment/styles.scss";

export default function Appointment(props) {
  return (
    <>
      {!props.time && (
        <article className="appointment"> No Appointment</article>
      )}
      {props.time && (
        <article className="appointment">Appointment at {props.time}</article>
      )}
    </>
  );
}
