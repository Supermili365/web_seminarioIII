export type View =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'inventory'
  | 'orders';

export type NavigateHandler = (view: View) => void;
