import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Dashboard",
    icon: "bx-home-circle",
    link: "/dashboard",
  },
  {
    id: 3,
    label: "Upload",
    icon: 'bx bx-file',
    link: "/upload",
  },
];
