import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { Counter } from "../src/index";

const meta: ComponentMeta<typeof Counter> = {
  title: "Design System/MyButton",
  component: Counter,
};
export default meta;

export const Primary: ComponentStoryObj<typeof Counter> = {};
