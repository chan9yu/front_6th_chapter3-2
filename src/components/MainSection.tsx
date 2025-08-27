import { useCalendarView } from '../hooks/useCalendarView';
import { useSearch } from '../hooks/useSearch';
import type { Event } from '../types';
import { EventList } from './EventList';
import { EventView } from './EventView';

type MainSectionProps = {
  deleteEvent: (id: string) => Promise<void>;
  editEvent: (event: Event) => void;
  events: Event[];
  notifiedEvents: string[];
};

export function MainSection({ deleteEvent, editEvent, events, notifiedEvents }: MainSectionProps) {
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  return (
    <>
      <EventView
        currentDate={currentDate}
        filteredEvents={filteredEvents}
        holidays={holidays}
        navigate={navigate}
        notifiedEvents={notifiedEvents}
        setView={setView}
        view={view}
      />
      <EventList
        deleteEvent={deleteEvent}
        editEvent={editEvent}
        filteredEvents={filteredEvents}
        notifiedEvents={notifiedEvents}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
}
