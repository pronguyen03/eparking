export class MenuItem {
  'Id': number;
  'Name': string;
  'Icon': string;
  'RouterLink': string;
  'ParentId': number;
  'Show': boolean;
  'Orders': number;
  'IsAction': boolean;
  'ChildsMenu': MenuItem[];
}
