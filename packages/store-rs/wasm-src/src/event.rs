#[derive(Clone, Debug)]
pub struct Note {
    pub id: String,
    pub ticks: u32,
    pub duration: u32,
    pub velocity: u32,
    pub note_number: u32,
    pub track_id: String,
}

#[derive(Clone, Debug)]
pub struct NoteUpdate {
    pub id: String,
    pub ticks: Option<u32>,
    pub duration: Option<u32>,
    pub velocity: Option<u32>,
    pub note_number: Option<u32>,
    pub track_id: Option<String>,
}

#[derive(Clone, Debug)]
pub enum Event {
    Note(Note),
}

impl Event {
    pub fn get_id(&self) -> String {
        match self {
            Event::Note(note) => note.id.clone(),
        }
    }
}

#[derive(Clone, Debug)]
pub enum EventUpdate {
    NoteUpdate(NoteUpdate),
}

impl EventUpdate {
    pub fn get_id(&self) -> String {
        match self {
            EventUpdate::NoteUpdate(note_update) => note_update.id.clone(),
        }
    }
}
