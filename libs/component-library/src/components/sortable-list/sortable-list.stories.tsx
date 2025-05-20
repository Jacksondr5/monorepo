import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tag, TagProps } from "../tag/tag";
import { SortableList } from "./sortable-list";

const meta: Meta<typeof SortableList> = {
  title: "Components/Data Display/SortableList",
  component: SortableList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SortableList>;

type TagItem = {
  text: string;
  id: string;
} & TagProps;

// Sample tag data
const sampleTags = [
  { id: "1", text: "Tag 1", variant: "default" as const },
  { id: "2", text: "Tag 2", variant: "primary" as const },
  { id: "3", text: "Tag 3", variant: "secondary" as const },
  { id: "4", text: "Tag 4", variant: "success" as const },
  { id: "5", text: "Tag 5", variant: "warning" as const },
] satisfies TagItem[];

// Reusable SortableListWithTags component
const SortableListWithTags = ({
  initialItems = sampleTags,
}: {
  initialItems?: Array<TagItem>;
}) => {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="w-[300px] space-y-2">
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            <Tag
              variant={item.variant}
              className="w-full justify-between"
              onDismiss={() => {
                setItems(items.filter((i) => i.id !== item.id));
              }}
            >
              <SortableList.DragHandle />
              {item.text}
            </Tag>
          </SortableList.Item>
        )}
      />
    </div>
  );
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">With Custom Drag Handle</h3>
        <SortableListWithTags />
      </div>
    </div>
  ),
};
