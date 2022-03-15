export enum DialogResultType {
  CANCEL = 'cancel',
  CONFIRM = 'confirm',
}

export interface DialogResult {
  type: DialogResultType;
  data?: Record<string, any>;
}
