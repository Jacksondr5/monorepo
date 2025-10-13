"use client";

import { useEffect, useState } from "react";
import { Tag } from "@jacksondr5/component-library";
import { SortableList } from "@jacksondr5/component-library";
import { Id, TableNames } from "../../../../convex/_generated/dataModel";

type SortableListBaseItem<Name extends TableNames> = {
  id: Id<Name>;
  value: string;
};

type SortableTagListProps<BaseItem extends SortableListBaseItem<TableNames>> = {
  initialTags: BaseItem[];
  onTagsSorted: (tags: BaseItem[]) => void;
  onTagDeleted: (tagId: Id<BaseItem["id"]["__tableName"]>) => void;
};

export function SortableTagList<
  BaseItem extends SortableListBaseItem<TableNames>,
>({ initialTags, onTagsSorted, onTagDeleted }: SortableTagListProps<BaseItem>) {
  const [localTags, setLocalTags] = useState(initialTags);

  useEffect(() => {
    setLocalTags(initialTags);
  }, [initialTags]);

  const handleChange = (newTags: BaseItem[]) => {
    setLocalTags(newTags);
    onTagsSorted(newTags);
  };

  return (
    <SortableList
      items={localTags}
      onChange={handleChange}
      renderItem={({ id, value }) => (
        <SortableList.Item key={id} id={id}>
          <Tag onDismiss={() => onTagDeleted(id)}>
            <span className="flex items-center gap-2">
              <SortableList.DragHandle />
              {value}
            </span>
          </Tag>
        </SortableList.Item>
      )}
    />
  );
}
