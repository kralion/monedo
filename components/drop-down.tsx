import { Ellipsis } from "lucide-react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Button } from "./ui/button";

type Props = {
  items: Array<{
    label: string;
    key: string;
    title: string;
    icon: string;
    iconAndroid: string;
    value: string;
  }>;
  onSelect: (key: string) => void;
};
export default function Dropdown({ items, onSelect }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="icon" className="rounded-full" variant="secondary">
          <Ellipsis color="black" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="2" onSelect={() => onSelect("2")}>
          <DropdownMenu.ItemTitle>{items[2].label}</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            // ios={{
            //   name: item.icon,
            //   pointSize: 24,
            // }}
            androidIconName={items[2].iconAndroid}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Group>
          {items.slice(0, 1).map((item) => (
            <DropdownMenu.Item
              key={item.key}
              onSelect={() => {
                onSelect(item.value);
              }}
            >
              <DropdownMenu.ItemTitle>{item.label}</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                // ios={{
                //   name: item.icon,
                //   pointSize: 24,
                // }}
                androidIconName={item.iconAndroid}
              />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
