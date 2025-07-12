# Todo

A todo app that I actually use.

## Features

- Resilliant against network failure because some corporate networks are terrible
  - Able to work offline using local storage, syncs when network is available
- Super user oriented
  - Data entry, navigation, etc. done by keyboard
  - Command palette (is this necessary?)

## Todo style

- Tasks grouped into important/urgent matrix
- Tasks have a title
  - Optional description, due date, tags
  - Should they have priority? How would that work with important/urgent?
- Tasks have a blocked status. If the status is blocked, a reason must be provided.

## Keyboard commands

- Tab to go to next todo, shift + tab to go to previous todo
- E to edit todo title
- Q to mark as done
- A to add todo
- D to edit todo description
- F to edit todo due date
- T to edit todo tags
- I to edit todo importance
- U to edit todo urgency
- B to set todo as blocked
- C to clear editing state
- X to delete todo

## Ordering todos

1. Important & Urgent
2. Important & Not Urgent
3. Not Important & Urgent
4. Not Important & Not Urgent

## Tags

- Primarily meant to be a filtering mechanism, but maybe could be used for grouping as well.
- Immediate use case: What do I need to do for this person/project/thing?

## Due Date

- Should help with urgency, though maybe urgency shouldn't be completely derived from due date.
  - Maybe if there is no urgency, one can be derived from due date. Otherwise, use what's set. How can we visually distinguish between derived and set urgency? Different shades? Slight transparency?
- How to select? Input is probably best, but date picker should be available. Need to make sure it's easy to navigate with keyboard.

## Conversation Topics

- Meant to help me keep track of things I need to talk to people about
- Should be a different view than todo. Either different "page" or drawer or something
- List organized by person
- Each person has a list of topics. Same title/description as a todo. Can be marked as done, blocked (?)
- Items should be able to be organized manually. No importance/urgency. Maybe use a drag and drop library so it's mobile friendly and has the keyboard support baked in.
