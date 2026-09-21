import React from "react";
import { Dialog as RadixDialog } from "radix-ui";
export const host = {
  state: {
    profile: { get: () => "default", listen: () => () => {} },
    gateway: { listen: () => () => {} },
  },
  navigate: () => {},
};
export const ROUTES_AREA = "routes",
  SIDEBAR_NAV_AREA = "nav",
  PALETTE_AREA = "palette";
export const Codicon = ({ name }) =>
  React.createElement("i", {
    className: "codicon codicon-" + name,
    "aria-hidden": true,
  });
export const Dialog = RadixDialog.Root,
  DialogTitle = RadixDialog.Title,
  DialogDescription = RadixDialog.Description;
export function DialogContent({ children, ...props }) {
  return React.createElement(
    RadixDialog.Portal,
    null,
    React.createElement(RadixDialog.Overlay, {
      style: { position: "fixed", inset: 0, background: "#0008" },
    }),
    React.createElement(
      RadixDialog.Content,
      {
        ...props,
        style: {
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        },
      },
      children,
    ),
  );
}
