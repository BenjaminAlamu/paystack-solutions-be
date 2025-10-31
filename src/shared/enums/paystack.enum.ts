export enum PAYSTACK_CURRENCY {
  NAIRA = "NGN",
}

export enum PAYSTACK_CHARGE {
  SUBACCOUNT_SHARE = 90,
  PERCENTAGE_CHARGE = 10,
}

export enum PAYSTACK_SPLIT_CHARGE_TYPE {
  PERCENTAGE = 'percentage',
  FLAT ='flat'
}

export enum PAYSTACK_SPLIT_BEARER_TYPE {
  SUBACCOUNT = 'subaccount',
  ACCOUNT = 'account',
  ALL = 'all',
}

export const PAYSTACK_MULTIPLIER = 100
