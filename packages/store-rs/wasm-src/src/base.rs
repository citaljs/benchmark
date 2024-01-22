use crate::{
    event::{Event, EventUpdate},
    filter::Filter,
};

pub trait IStore {
    fn get_events(&self, filter: Option<Filter>) -> Vec<Event>;
    fn add_event(&mut self, event: Event);
    fn add_events(&mut self, events: Vec<Event>);
    fn update_event(&mut self, event: EventUpdate);
    fn update_events(&mut self, events: Vec<EventUpdate>);
    fn remove_event(&mut self, event_id: String);
    fn remove_events(&mut self, event_ids: Vec<String>);
}
