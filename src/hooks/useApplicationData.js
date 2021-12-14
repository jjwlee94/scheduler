import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  const bookInterview = (id, interview) => {
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    const day = {
      ...state.days.find((day) => day.name === state.day),
      spots: state.days[dayIndex].spots - 1,
    };
    const days = state.days;
    days[dayIndex] = day;

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState((prev) => ({ ...prev, appointments, days }));
    });
  };

  const cancelInterview = (id) => {
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    const day = {
      ...state.days.find((day) => day.name === state.day),
      spots: state.days[dayIndex].spots + 1,
    };
    const days = state.days;
    days[dayIndex] = day;

    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`api/appointments/${id}`, appointments[id]).then(() => {
      setState((prev) => ({ ...prev, appointments, days }));
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((res) => {
      setState((prev) => ({
        ...prev,
        days: res[0].data,
        appointments: res[1].data,
        interviewers: res[2].data,
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
