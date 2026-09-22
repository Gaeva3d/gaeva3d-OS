-- Add the simplified GAEVA order choices without rewriting historical orders.
-- These shared enum additions do not change tables, policies, grants or Dry data.
alter type public.product_category add value if not exists 'corporate';
alter type public.product_category add value if not exists 'keychain';
alter type public.product_category add value if not exists 'statuette';
alter type public.payment_status add value if not exists 'invoiced';
