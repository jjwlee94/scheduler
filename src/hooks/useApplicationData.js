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

  const fetchFreeSpots = (appointments) => {
    const appIDs = state.days.filter((day) => day.name === state.day);
    const todayApp = appIDs[0].appointments;
    const emptyApp = todayApp.filter(
      (app) => !appointments[app].interview
    ).length;
    return emptyApp;
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [...state.days];
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    days[dayIndex].spots = fetchFreeSpots(appointments);

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState((prev) => ({ ...prev, appointments, days }));
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [...state.days];
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    days[dayIndex].spots = fetchFreeSpots(appointments);

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
