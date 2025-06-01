export interface IUsers {
  items: IUser[];
  totalCount: number;
}
export interface whoAmI {
  user: IUser;

  settings: ISettings;
  auctionBidConfirmationRequired: boolean;
  auctionBidModerationRequired: boolean;
}
export interface IUser {
  id: string;
  messengerLink?: string;
  username: string;
  dealer: IDealer;
  name: string;
  role?: string;
  avatar?: IAvatar;
  enabled?: boolean;
  authorities: string[];
  alias:string;
  person: {
    fullName: string;
    firstName: string;
    lastName: string;
    middleName: string;
  }
  phone: string;
}
export interface IDealer {
  id: string;
  alias: string;
  name: string;
  description: string;
  address: string;
  contactPhone: string;
  logoUrl: string;
}
export interface ISettings {
  exchangeRateSource: string;
}
export interface IAvatar {
  id: string;
  name: string;
  type: string;
  size: number;
}
export interface IAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
}
