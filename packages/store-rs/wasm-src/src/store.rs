use crate::{
    base::IStore,
    event::{Event, EventUpdate, Note},
    filter::{Filter, TicksRangeFilter},
};

fn get_filter_by_track_ids_fn(track_ids: Option<Vec<String>>) -> impl Fn(&Event) -> bool {
    move |event: &Event| match event {
        Event::Note(note) => {
            if let Some(track_ids) = &track_ids {
                return track_ids.contains(&note.track_id);
            }

            true
        }
    }
}

fn get_filter_by_ticks_range_fn(ticks_range: Option<TicksRangeFilter>) -> impl Fn(&Event) -> bool {
    move |event: &Event| match event {
        Event::Note(note) => {
            if let Some(ticks_range) = &ticks_range {
                if ticks_range.with_in_duration {
                    return (note.ticks >= ticks_range.start && note.ticks <= ticks_range.end)
                        || note.ticks + note.duration > ticks_range.start;
                }

                return note.ticks >= ticks_range.start && note.ticks <= ticks_range.end;
            }

            true
        }
    }
}

pub struct Store {
    events: Vec<Event>,
}

impl IStore for Store {
    fn get_events(&self, filter: Option<Filter>) -> Vec<Event> {
        let events = self.events.clone();

        if filter.is_none() {
            return events;
        }

        assert!(filter.is_some());
        let filter = filter.unwrap();

        events
            .into_iter()
            .filter(get_filter_by_track_ids_fn(filter.track_ids))
            .filter(get_filter_by_ticks_range_fn(filter.ticks_range))
            .collect()
    }

    fn add_event(&mut self, event: Event) {
        self.events.push(event);
    }

    fn add_events(&mut self, events: Vec<Event>) {
        self.events.extend(events);
    }

    fn update_event(&mut self, event: EventUpdate) {
        let event_id = event.get_id();
        let event_index = self.events.iter().enumerate().find_map(|(index, event)| {
            if event.get_id() == event_id {
                Some(index)
            } else {
                None
            }
        });

        if event_index.is_none() {
            panic!("Event with id {} not found", event_id)
        }

        assert!(event_index.is_some());
        let event_index = event_index.unwrap();

        let current_event = self.events.get(event_index).unwrap();
        let new_event = match (current_event, event) {
            (Event::Note(current_event), EventUpdate::NoteUpdate(event)) => Event::Note(Note {
                id: event.id,
                ticks: event.ticks.unwrap_or(current_event.ticks),
                duration: event.duration.unwrap_or(current_event.duration),
                velocity: event.velocity.unwrap_or(current_event.velocity),
                note_number: event.note_number.unwrap_or(current_event.note_number),
                track_id: event.track_id.unwrap_or(current_event.track_id.clone()),
            }),
        };

        self.events[event_index] = new_event;
    }

    fn update_events(&mut self, events: Vec<EventUpdate>) {
        for event in events {
            self.update_event(event);
        }
    }

    fn remove_event(&mut self, event_id: String) {
        let event_index = self.events.iter().enumerate().find_map(|(index, event)| {
            if event.get_id() == event_id {
                Some(index)
            } else {
                None
            }
        });

        if event_index.is_none() {
            panic!("Event with id {} not found", event_id)
        }

        assert!(event_index.is_some());
        let event_index = event_index.unwrap();
        self.events.remove(event_index);
    }

    fn remove_events(&mut self, event_ids: Vec<String>) {
        for event_id in event_ids {
            self.remove_event(event_id);
        }
    }
}
