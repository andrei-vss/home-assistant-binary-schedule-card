# Home Assistant Binary Schedule Card

A custom Lovelace card that displays and edits a **168-bit weekly schedule**  
(24 hours × 7 days), stored inside an `input_text` entity.

Perfect for heating schedules, automation windows, presence simulation,  
or any binary weekly pattern.

---

## Features

- 24×7 grid (hours × days)
- Click to toggle each hour
- “Clear All” button
- Automatically initializes invalid schedules
- Works with any `input_text` entity of length 168
- Appears in Lovelace card picker

---

## Installation (HACS)

1. Go to **HACS → Frontend → Custom repositories**
2. Add repository:
   https://github.com/andrei-vss/home-assistant-binary-schedule-card
3. Install the card
4. Add resource automatically or manually:
```yaml
url: /hacsfiles/home-assistant-binary-schedule-card/home-assistant-binary-schedule-card.js
type: module
```
## Usage
```yaml
type: custom:binary-schedule-card
entity: input_text.fh_schedule_binary_input
```
## Entity Requirements
- Must be an input_text;
- Must contain 168 characters;
- Only "0" and "1" are used;

## License
### MIT