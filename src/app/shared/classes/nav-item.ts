export class NavItem {
  name: string;
  icon?: string;
  route?: string;
  isShowed?: boolean;
  isAction?: boolean;
  childs?: NavItem[];
}
