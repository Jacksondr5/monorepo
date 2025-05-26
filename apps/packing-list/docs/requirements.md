# Functional Requirements

**1. Item Management**
1.1. The system must allow users to Create, Read, Update, and Delete (CRUD) items in a master list.
1.2. Each item must have at least a unique name.
1.3. Items should support optional categorization (e.g., 'Clothing', 'Toiletries', 'Electronics', 'Documents').
1.4. Items must support **association with predefined attributes (tags)** relevant to packing rules. Users will select applicable tags from a managed list (e.g., via checkboxes/dropdowns). Example tag categories and values:
1.5. The system must persist the master item list and associated attributes.

**1.6. Luggage Management**
1.6.1. The system must allow users to Create, Read, Update, and Delete (CRUD) luggage entries.
1.6.2. Each luggage entry must have a unique name (e.g., 'Red Carry-on', 'Large Black Suitcase').
1.6.3. Each luggage entry must specify its capacity in maximum number of days it typically supports.
1.6.4. Each luggage entry must be associated with one or more **predefined travel mode tags** (e.g., selecting 'Carry-on', 'Checked Bag' from the available tags).
1.6.5. The system must persist the luggage list and associated attributes.

**2. Packing List Generation**
2.1. The system must provide an interface for the user to input trip parameters before generating a list.
2.2. Required trip parameters include:
2.2.1. Trip Type (Business/Personal - _mutually exclusive choice_)
2.2.2. Destination (Free text input for weather lookup)
2.2.3. Travel Dates (Start and End Date)
2.2.4. Travel Mode (e.g., 'Plane - Carry-on Only', 'Plane - Checked Bag', 'Car', 'Train' - _single choice_)
2.3. The system must calculate the trip duration in total days based on the start and end dates.
2.4. **(Optional/Future) Weather Integration:**
2.4.1. The system should fetch _daily_ forecast weather information (e.g., high/low temperatures, precipitation chance) for the destination and dates provided.
2.4.2. The system must map _each day's_ forecast to simplified weather condition tags **selected from the predefined tag list** (e.g., 'Weather: Warm', 'Weather: Cold', 'Weather: Rain').
2.5. **Rule Engine:**
2.5.1. The system must use the user-provided trip parameters and derived daily weather condition tags (**all referencing predefined tags**) to filter the master item list.
2.5.2. Items associated with matching **predefined tags** (Trip Type, Travel Mode) should be considered.
2.5.3. Item inclusion and quantity calculation (based on matching predefined weather and duration tags):
2.5.3.1. For items tagged 'Duration: Base': Include if the item's weather tags (e.g., 'Weather: Warm', 'Weather: Rain') match the weather tags of _at least one day_ of the trip. Quantity is 1.
2.5.3.2. For items tagged 'Duration: Per Day': - If the item is tagged with specific weather conditions (e.g., 'Weather: Warm'), the quantity is the number of days with matching weather tags. - If the item is tagged 'Weather: Any' (or has no specific weather tag), the quantity is based on the total trip duration in days. (Consider potential refinement, e.g., `ceil(days / N)`).
2.5.3.3 Items whose conditions (Trip Type, Travel Mode, Weather) are not met should not be included in the list.
2.6. **Luggage Suggestion:**
2.6.1. The system must suggest suitable luggage from the user's managed luggage list.
2.6.2. Suggestions should be based on: - Matching the selected Travel Mode. - Having a capacity (maximum days) greater than or equal to the trip duration.
2.7. The generated packing list, including suggested items with quantities and suggested luggage, should be displayed to the user.

**3. Active Packing Interface**
3.1. The system must display the generated packing list clearly, showing item names and quantities.
3.2. Users must be able to mark items on the list as 'Packed'.
3.3. The interface should visually distinguish between packed and unpacked items.
3.4. Users must be able to add items to the _current_ generated list ad-hoc, even if they weren't suggested by the rules. These items are only for the current list and are not saved to the master item list automatically.
3.5. The system should provide a summary or progress indicator (e.g., "X out of Y items packed").

**4. Data Persistence & Ephemerality**
4.1. The master item list and luggage list must be persistent.
4.2. Generated packing lists are ephemeral; only the _current_ list needs to be actively managed. Starting a new list generation process discards the previous one. State related to the _active_ packing process (which items are marked packed) should be maintained until a new list is generated.

**5. Non-Functional / Constraints**
5.1. The application must be designed primarily for mobile use.
5.2. The interface should be optimized for quick interactions (minimal clicks/taps).
