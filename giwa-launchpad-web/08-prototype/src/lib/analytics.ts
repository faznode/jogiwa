// Masterplan client events `[07 §1.2]`; names marked (new) in 01-brief/feature-ui-matrix.md are proposals (Q4).
// Prototype: console only. Never pass addresses or other identifiers (ADR-S1 §12, Q23).
export type EventName =
  | 'page_view'
  | 'window_viewed'
  | 'deposit_submitted'
  | 'fairness_sheet_shown'
  | 'fairness_sheet_expanded'
  | 'fairness_sheet_dismissed'
  | 'trade_submitted'
  | 'trade_preconfirmed_ms'
  | 'trade_confirmed_ms'
  | 'simulation_failed'
  | 'share_clicked'
  | 'create_step'
  | 'create_completed'
  | 'verify_started'
  | 'verify_completed'
  | 'credit_claimed'
  | 'wallet_connected'
  | 'error_shown'
  | 'feed_tab_changed'
  | 'fees_claimed'
  | 'rewards_claimed'
  | 'vesting_released'
  | 'graduate_clicked'
  | 'tos_accepted'

export function track(name: EventName, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return
  console.debug('[analytics]', name, props)
}
