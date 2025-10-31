export enum OrderPaymentMethod {
    VIRTUAL_ACCOUNT = "virtual_account",
    TERMINAL = "terminal",
    CHECKOUT = 'checkout'
  }
  

  export enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = 'delivered',
    SUCCESSFUL = 'successful'
  }

  export enum OrderPaymentStatus {
    ABANDONED = "abandoned",
    FAILED = "failed",
    ONGOING = 'ongoing',
    PENDING = "pending",
    PROCESSING = 'processing',
    QUEUED = "queued",
    REVERSED = "reversed",
    SUCCESS = 'success'
  }