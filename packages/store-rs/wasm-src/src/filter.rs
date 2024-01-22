pub struct Filter {
    pub ticks_range: Option<TicksRangeFilter>,
    pub track_ids: Option<Vec<String>>,
}

pub struct TicksRangeFilter {
    pub start: u32,
    pub end: u32,
    pub with_in_duration: bool,
}
