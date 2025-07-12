import { Separator } from "../ui/separator";

export const keybindings = {
  EDIT_TITLE: "e",
  MARK_DONE: "q",
  ADD_TODO: "a",
  EDIT_DESCRIPTION: "d",
  EDIT_DUE_DATE: "f",
  EDIT_TAGS: "t",
  EDIT_IMPORTANCE: "i",
  EDIT_URGENCY: "u",
  SET_BLOCKED: "b",
  CLEAR_EDITING_STATE: "c",
  DELETE_TODO: "x",
  REFRESH: "r",
  OPEN_HELP: "/",
} as const;

type KeybindingValues = (typeof keybindings)[keyof typeof keybindings];

type KeybindingHelp = {
  key: KeybindingValues | "Tab" | "Shift + Tab";
  description: string;
};

const keybindingHelps: KeybindingHelp[] = [
  { key: "Tab", description: "Go to next todo" },
  { key: "Shift + Tab", description: "Go to previous todo" },
  { key: "a", description: "Add todo" },
  { key: "e", description: "Edit title" },
  { key: "d", description: "Edit description" },
  { key: "q", description: "Mark as done" },
  // { key: "f", description: "Edit due date" },
  // { key: "t", description: "Edit tags" },
  { key: "i", description: "Edit importance" },
  { key: "u", description: "Edit urgency" },
  { key: "b", description: "Set as blocked" },
  // { key: "c", description: "Clear editing state" },
  { key: "x", description: "Delete todo" },
  { key: "r", description: "Refresh" },
  { key: "/", description: "Open help" },
];

export const KeybindingsHelp = () => {
  return (
    <div className="bg-olive-5 absolute bottom-4 right-4 rounded-md p-4">
      <h2 className="text-olive-12 text-2xl font-bold">Keybindings</h2>
      <Separator className="bg-olive-7 m-1.5" />
      <ul className="text-olive-11 list-none">
        {keybindingHelps.map((help) => (
          <li key={help.key}>
            {help.key}: {help.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
