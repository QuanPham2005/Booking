import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import "../styles/calendar.css";

export default function Calendar({ events = [], highlightedDates = [], onEventClick }) {
  // Support old prop `highlightedDates` (array of yyyy-mm-dd strings)
  const fcEvents =
    events && events.length > 0
      ? events
      : highlightedDates.map((d, i) => ({ id: `h-${i}`, title: "Đã đặt", start: d }));

  const handleEventClick = (clickInfo) => {
    // forward to parent if provided
    if (typeof onEventClick === "function") {
      onEventClick(clickInfo.event);
    }
    // avoid FullCalendar's default navigation
    clickInfo.jsEvent.preventDefault();
  };

  return (
    <div className="fc-calendar-container bg-white dark:bg-slate-800 rounded-lg shadow-md border dark:border-gray-700 p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
        events={fcEvents}
        eventClick={handleEventClick}
        height="auto"
        contentHeight="auto"
        dayMaxEventRows={2}
        nowIndicator={false}
        selectable={false}
        displayEventTime={false}
        dayCellClassNames={(arg) => {
          // Highlight days with events
          const hasEvent = fcEvents.some(evt => {
            const eventDate = new Date(evt.start).toDateString();
            const cellDate = arg.date.toDateString();
            return eventDate === cellDate;
          });
          return hasEvent ? 'fc-day-booked' : '';
        }}
      />
    </div>
  );
}