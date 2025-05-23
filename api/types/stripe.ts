/**
 * @file stripe.ts
 * @description Types and interfaces for Stripe webhook event processing.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Supported Stripe event types we care about.
 */
export type StripeEventType =
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed"
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

/**
 * Stripe Webhook Payload Types
 * Type definitions for Stripe webhook events
 */

export interface StripeWebhookPayload {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: {
    object: StripeObject;
    previous_attributes?: Record<string, any>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
  type: string;
}

export interface StripeObject {
  id: string;
  object: string;
  created?: number;
  livemode?: boolean;
  metadata?: Record<string, string>;
  [key: string]: any;
}

export interface StripeCustomer extends StripeObject {
  object: 'customer';
  email: string | null;
  name: string | null;
  description: string | null;
  phone: string | null;
  address: StripeAddress | null;
  shipping: StripeShipping | null;
  tax_exempt: 'none' | 'exempt' | 'reverse';
  currency: string | null;
  balance: number;
  delinquent: boolean;
  discount: StripeDiscount | null;
  invoice_prefix: string | null;
  invoice_settings: StripeInvoiceSettings;
  next_invoice_sequence: number;
  preferred_locales: string[];
  sources: StripeList<StripeSource>;
  subscriptions: StripeList<StripeSubscription>;
  tax_ids: StripeList<StripeTaxId>;
}

export interface StripeSubscription extends StripeObject {
  object: 'subscription';
  application_fee_percent: number | null;
  billing_cycle_anchor: number;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  collection_method: 'charge_automatically' | 'send_invoice';
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: number | null;
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: StripeTaxRate[];
  discount: StripeDiscount | null;
  ended_at: number | null;
  items: StripeList<StripeSubscriptionItem>;
  latest_invoice: string | null;
  pending_setup_intent: string | null;
  pending_update: StripeSubscriptionPendingUpdate | null;
  schedule: string | null;
  start_date: number;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  trial_end: number | null;
  trial_start: number | null;
}

export interface StripeInvoice extends StripeObject {
  object: 'invoice';
  account_country: string | null;
  account_name: string | null;
  account_tax_ids: string[] | null;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  application_fee_amount: number | null;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  billing_reason: string;
  charge: string | null;
  collection_method: 'charge_automatically' | 'send_invoice';
  created: number;
  currency: string;
  custom_fields: StripeCustomField[] | null;
  customer: string;
  customer_address: StripeAddress | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_shipping: StripeShipping | null;
  customer_tax_exempt: 'none' | 'exempt' | 'reverse';
  customer_tax_ids: StripeTaxId[];
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: StripeTaxRate[];
  description: string | null;
  discount: StripeDiscount | null;
  due_date: number | null;
  ending_balance: number | null;
  footer: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  lines: StripeList<StripeInvoiceLineItem>;
  number: string | null;
  paid: boolean;
  payment_intent: string | null;
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  receipt_number: string | null;
  starting_balance: number;
  statement_descriptor: string | null;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  status_transitions: StripeInvoiceStatusTransitions;
  subscription: string | null;
  subtotal: number;
  tax: number | null;
  total: number;
  total_tax_amounts: StripeTotalTaxAmount[];
  transfer_data: StripeTransferData | null;
  webhooks_delivered_at: number | null;
}

// Supporting interfaces
export interface StripeAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface StripeShipping {
  address: StripeAddress;
  carrier: string | null;
  name: string;
  phone: string | null;
  tracking_number: string | null;
}

export interface StripeDiscount {
  id: string;
  object: 'discount';
  coupon: StripeCoupon;
  customer: string;
  end: number | null;
  start: number;
  subscription: string | null;
}

export interface StripeCoupon {
  id: string;
  object: 'coupon';
  amount_off: number | null;
  created: number;
  currency: string | null;
  duration: 'forever' | 'once' | 'repeating';
  duration_in_months: number | null;
  livemode: boolean;
  max_redemptions: number | null;
  name: string | null;
  percent_off: number | null;
  redeem_by: number | null;
  times_redeemed: number;
  valid: boolean;
}

export interface StripeInvoiceSettings {
  custom_fields: StripeCustomField[] | null;
  default_payment_method: string | null;
  footer: string | null;
}

export interface StripeCustomField {
  name: string;
  value: string;
}

export interface StripeList<T> {
  object: 'list';
  data: T[];
  has_more: boolean;
  total_count?: number;
  url: string;
}

export interface StripeSource extends StripeObject {
  object: 'source';
  amount: number | null;
  client_secret: string;
  currency: string | null;
  flow: string;
  owner: StripeSourceOwner | null;
  statement_descriptor: string | null;
  status: string;
  type: string;
  usage: string;
}

export interface StripeSourceOwner {
  address: StripeAddress | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  verified_address: StripeAddress | null;
  verified_email: string | null;
  verified_name: string | null;
  verified_phone: string | null;
}

export interface StripeSubscriptionItem extends StripeObject {
  object: 'subscription_item';
  billing_thresholds: StripeSubscriptionItemBillingThresholds | null;
  created: number;
  price: StripePrice;
  quantity: number;
  subscription: string;
  tax_rates: StripeTaxRate[];
}

export interface StripeSubscriptionItemBillingThresholds {
  usage_gte: number | null;
}

export interface StripePrice extends StripeObject {
  object: 'price';
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: string | null;
  nickname: string | null;
  product: string;
  recurring: StripePriceRecurring | null;
  tiers_mode: 'graduated' | 'volume' | null;
  transform_quantity: StripePriceTransformQuantity | null;
  type: 'one_time' | 'recurring';
  unit_amount: number | null;
  unit_amount_decimal: string | null;
}

export interface StripePriceRecurring {
  aggregate_usage: 'last_during_period' | 'last_ever' | 'max' | 'sum' | null;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  trial_period_days: number | null;
  usage_type: 'licensed' | 'metered';
}

export interface StripePriceTransformQuantity {
  divide_by: number;
  round: 'down' | 'up';
}

export interface StripeTaxRate extends StripeObject {
  object: 'tax_rate';
  active: boolean;
  country: string | null;
  created: number;
  description: string | null;
  display_name: string;
  inclusive: boolean;
  jurisdiction: string | null;
  livemode: boolean;
  percentage: number;
  state: string | null;
  tax_type: string | null;
}

export interface StripeTaxId extends StripeObject {
  object: 'tax_id';
  country: string | null;
  created: number;
  customer: string;
  livemode: boolean;
  type: string;
  value: string;
  verification: StripeTaxIdVerification | null;
}

export interface StripeTaxIdVerification {
  status: 'pending' | 'verified' | 'unverified';
  verified_address: string | null;
  verified_name: string | null;
}

export interface StripeSubscriptionPendingUpdate {
  billing_cycle_anchor: number | null;
  expires_at: number;
  subscription_items: StripeSubscriptionItem[];
  trial_end: number | null;
  trial_from_plan: boolean | null;
}

export interface StripeInvoiceLineItem extends StripeObject {
  object: 'line_item';
  amount: number;
  currency: string;
  description: string | null;
  discount_amounts: StripeDiscountAmount[];
  discountable: boolean;
  discounts: string[];
  livemode: boolean;
  period: StripePeriod;
  price: StripePrice | null;
  proration: boolean;
  quantity: number | null;
  subscription: string | null;
  subscription_item: string | null;
  tax_amounts: StripeTaxAmount[];
  tax_rates: StripeTaxRate[];
  type: 'invoiceitem' | 'subscription';
}

export interface StripeDiscountAmount {
  amount: number;
  discount: string;
}

export interface StripePeriod {
  end: number;
  start: number;
}

export interface StripeTaxAmount {
  amount: number;
  inclusive: boolean;
  tax_rate: string;
}

export interface StripeInvoiceStatusTransitions {
  finalized_at: number | null;
  marked_uncollectible_at: number | null;
  paid_at: number | null;
  voided_at: number | null;
}

export interface StripeTotalTaxAmount {
  amount: number;
  inclusive: boolean;
  tax_rate: string;
}

export interface StripeTransferData {
  amount: number | null;
  destination: string;
}
