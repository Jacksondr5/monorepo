import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Tag, TagProps } from "../tag/tag";
import { SortableList } from "./sortable-list";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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

export const InteractionTest: Story = {
  render: () => <SortableListWithTags />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial order
    const tags = canvas.getAllByRole("button", { name: /Tag \d/ });
    await expect(tags[0]).toHaveTextContent("Tag 1");
    await expect(tags[1]).toHaveTextContent("Tag 2");

    // We can't actually simulate drag and drop in Storybook's play function,
    // but we can verify that the component renders correctly and has the right ARIA attributes
    tags.forEach((tag) => {
      expect(tag).toHaveAttribute("aria-describedby");
    });
  },
};

export const WithCustomItems: Story = {
  render: () => {
    const customItems = [
      { id: "a", name: "Apple", color: "red" },
      { id: "b", name: "Banana", color: "yellow" },
      { id: "c", name: "Cherry", color: "red" },
    ];

    const [items, setItems] = useState(customItems);

    return (
      <div className="w-[300px] space-y-2">
        <DndContext
          onDragEnd={(event) => {
            const { active, over } = event;
            if (over && active.id !== over?.id) {
              const activeIndex = items.findIndex(({ id }) => id === active.id);
              const overIndex = items.findIndex(({ id }) => id === over.id);
              setItems(arrayMove(items, activeIndex, overIndex));
            }
          }}
        >
          <SortableList
            items={items}
            onChange={setItems}
            renderItem={(item) => (
              <div className="flex items-center gap-2 rounded border p-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            )}
          />
        </DndContext>
      </div>
    );
  },
};
