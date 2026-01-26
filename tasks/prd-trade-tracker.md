# PRD: Trade Tracker

## Introduction

A personal trading journal and analytics application for tracking stock and crypto trades. The app centers around the concept of a "campaign" - a thesis-driven collection of trades that represents a complete trading idea from planning through execution and exit. Users can track individual trades, group them into campaigns with profit targets and stop losses, and derive analytical insights about their trading performance.

**Key Concept - Campaign:** A campaign represents a trading thesis that may span multiple tickers and trades. For example, a "Gold Rally" campaign might involve buying GLDM (a gold ETF) as a proxy for trading gold itself. Campaigns capture the full lifecycle: planning the thesis, defining targets, executing trades, adjusting stops, and writing a retrospective after closing.

## Goals

- Track all trades (long/short, stocks/crypto) with full execution details
- Organize trades into thesis-based campaigns that capture the complete lifecycle of a trading idea
- Support underlying asset mapping (e.g., trading GLDM as a proxy for gold)
- Track stop loss adjustments over time as the campaign evolves
- Calculate key performance metrics: win rate, average gain/loss, risk-adjusted returns
- Provide portfolio-level analytics: position sizing, allocation, risk exposure
- Support a simple notes system with room for future enhancement
- Design data architecture to support future brokerage API integration

## Data Architecture

### Core Entities

#### Trade
The atomic unit - a single buy/sell/short/cover execution.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| date | datetime | Execution timestamp |
| ticker | string | Symbol (e.g., AAPL, BTC-USD) |
| assetType | enum | 'stock' \| 'crypto' |
| side | enum | 'buy' \| 'sell' |
| direction | enum | 'long' \| 'short' |
| price | decimal | Execution price |
| quantity | decimal | Number of shares/units |
| campaignId | string? | Optional link to a campaign |
| notes | string? | Free-form text notes |
| createdAt | datetime | Record creation time |

**Derived from trades:**
- `total`: price × quantity
- Position calculations (quantity, avg cost) derived by aggregating trades

#### Campaign
A thesis-based grouping representing a complete trading idea.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Short descriptive name |
| status | enum | 'planning' \| 'active' \| 'closed' |
| thesis | string | The trading rationale/idea |
| instruments | Instrument[] | Tradeable instruments and their underlying assets |
| entryTargets | Target[] | Price levels to enter positions |
| profitTargets | Target[] | Price levels to take profits |
| stopLossHistory | StopLoss[] | History of stop loss adjustments |
| outcome | enum? | 'profit_target' \| 'stop_loss' \| 'manual' \| null |
| retrospective | string? | Post-close analysis and lessons learned |
| createdAt | datetime | Record creation time |
| closedAt | datetime? | When campaign was closed |

#### Instrument
Maps a tradeable ticker to its underlying asset (for proxies/ETFs).

| Field | Type | Description |
|-------|------|-------------|
| ticker | string | Actual traded symbol (e.g., GLDM) |
| underlying | string? | Underlying asset if different (e.g., GOLD) |
| notes | string? | Why using this instrument |

**Example:** Trading gold via GLDM ETF:
- `ticker`: "GLDM"
- `underlying`: "GOLD"
- `notes`: "Lower expense ratio than GLD"

#### StopLoss
A point-in-time stop loss record for tracking adjustments.

| Field | Type | Description |
|-------|------|-------------|
| ticker | string | Symbol this stop applies to |
| price | decimal | Stop loss price level |
| reason | string? | Why stop was set/adjusted here |
| setAt | datetime | When this stop was set |

#### Target
Reusable structure for price targets.

| Field | Type | Description |
|-------|------|-------------|
| ticker | string | Symbol this target applies to |
| price | decimal | Target price level |
| percentage | decimal? | % of position (for scaling in/out) |
| notes | string? | Rationale for this level |

#### CampaignNote
Timestamped notes attached to a campaign (separate from thesis and retrospective).

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| campaignId | string | Parent campaign |
| content | string | Note text |
| createdAt | datetime | When note was added |

#### PortfolioSnapshot
Point-in-time portfolio value for calculating percentages and performance.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| date | date | Snapshot date |
| totalValue | decimal | Total portfolio value |
| cashBalance | decimal? | Cash portion (optional) |
| source | enum | 'manual' \| 'calculated' \| 'api' |
| createdAt | datetime | Record creation time |

### Derived/Calculated Data

These are computed on-demand, not stored:

#### Position (per ticker)
- `ticker`: Symbol
- `quantity`: Net shares held (sum of buys - sells, accounting for direction)
- `averageCost`: Weighted average entry price
- `currentValue`: quantity × current price (requires price feed)
- `unrealizedPL`: currentValue - (averageCost × quantity)

#### Campaign Analytics
- `realizedPL`: Sum of closed trade P&L within campaign
- `unrealizedPL`: Current value of open positions in campaign
- `totalPL`: realized + unrealized
- `isWinner`: totalPL > 0
- `duration`: Days from first trade to close (or current)
- `hitTarget`: Did it reach profit target or stop loss?
- `stopLossAdjustments`: Number of times stop was moved

#### Portfolio Analytics
- `totalRealizedPL`: Sum across all closed trades (filterable by period)
- `winRate`: % of closed campaigns that were profitable
- `avgWin`: Average P&L of winning campaigns
- `avgLoss`: Average P&L of losing campaigns
- `profitFactor`: Total gains / Total losses
- `largestWin` / `largestLoss`: Extremes for risk analysis
- `positionSizing`: Current value per ticker as % of portfolio

## User Stories

### US-001: Set up Convex schema and database

**Description:** As a developer, I need the database schema implemented so trade data can be persisted.

**Acceptance Criteria:**
- [ ] Create Convex schema with tables: trades, campaigns, campaignNotes, portfolioSnapshots
- [ ] All fields from data architecture are defined with proper types
- [ ] Indexes created for common queries (trades by campaignId, trades by ticker, trades by date)
- [ ] Typecheck passes

### US-002: Create a new trade

**Description:** As a trader, I want to log a trade so I have a record of my execution.

**Acceptance Criteria:**
- [ ] Form to enter: date, ticker, asset type, side, direction, price, quantity, notes
- [ ] Ticker input supports both stocks and crypto symbols
- [ ] Date defaults to current date/time
- [ ] Side/direction combination validated (buy+long, sell+long, sell+short, buy+short/cover)
- [ ] Trade saved to database on submit
- [ ] Success feedback shown after save
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: View trade list

**Description:** As a trader, I want to see all my trades so I can review my history.

**Acceptance Criteria:**
- [ ] Table/list showing all trades sorted by date (newest first)
- [ ] Columns: date, ticker, side, direction, price, quantity, total, campaign (if linked)
- [ ] Total column calculated as price × quantity
- [ ] Click on trade opens detail view or edit modal
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Create a new campaign

**Description:** As a trader, I want to create a campaign to document my trading thesis before executing trades.

**Acceptance Criteria:**
- [ ] Form to enter: name, thesis
- [ ] Status defaults to 'planning'
- [ ] Campaign saved to database on submit
- [ ] Can create campaign without any trades attached
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004a: Add instruments to a campaign

**Description:** As a trader, I want to specify which instruments I'll trade, including mapping to underlying assets.

**Acceptance Criteria:**
- [ ] UI to add instruments to a campaign
- [ ] Each instrument has: ticker (required), underlying (optional), notes (optional)
- [ ] Example: ticker "GLDM", underlying "GOLD", notes "Gold ETF proxy"
- [ ] Can add multiple instruments per campaign
- [ ] Instruments displayed on campaign detail
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Add targets to a campaign

**Description:** As a trader, I want to define entry and profit targets so I have a clear plan.

**Acceptance Criteria:**
- [ ] UI to add/edit/remove entry targets (ticker, price, percentage, notes)
- [ ] UI to add/edit/remove profit targets (ticker, price, percentage, notes)
- [ ] Targets saved to campaign document
- [ ] Can have multiple entry/profit targets
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005a: Track stop loss history

**Description:** As a trader, I want to record stop loss changes over time so I can review my risk management.

**Acceptance Criteria:**
- [ ] UI to add a new stop loss (ticker, price, reason)
- [ ] Each stop loss automatically timestamped when added
- [ ] Stop loss history displayed chronologically (newest first)
- [ ] Current stop loss (most recent) highlighted
- [ ] Can see full history of stop adjustments
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Add notes to a campaign

**Description:** As a trader, I want to add timestamped notes to a campaign so I can track my thinking over time.

**Acceptance Criteria:**
- [ ] Text input to add a note to a campaign
- [ ] Notes displayed in chronological order with timestamps
- [ ] Notes persist across page reloads
- [ ] Can add notes regardless of campaign status
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Link trades to a campaign

**Description:** As a trader, I want to associate trades with a campaign so they're grouped under my thesis.

**Acceptance Criteria:**
- [ ] When creating a trade, optional dropdown to select existing campaign
- [ ] Campaign dropdown filters to show only planning/active campaigns
- [ ] Can edit existing trade to add/change/remove campaign link
- [ ] Campaign detail view shows all linked trades
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Change campaign status

**Description:** As a trader, I want to change campaign status to track its lifecycle.

**Acceptance Criteria:**
- [ ] Status can be changed: planning → active → closed
- [ ] When closing, prompt for outcome (profit_target, stop_loss, manual)
- [ ] Closed campaign shows closedAt timestamp
- [ ] Closed campaign cannot have new trades added (show warning)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008a: Auto-detect position closure

**Description:** As a trader, I want the system to detect when my position is fully closed so I can finalize the campaign.

**Acceptance Criteria:**
- [ ] System detects when net position for all campaign instruments reaches zero
- [ ] Shows prompt/notification suggesting to close the campaign
- [ ] User can dismiss the prompt if they plan to re-enter
- [ ] Prompt includes current P&L summary
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008b: Write campaign retrospective

**Description:** As a trader, I want to write a retrospective after closing a campaign so I can capture lessons learned.

**Acceptance Criteria:**
- [ ] Text area to write retrospective on campaign detail page
- [ ] Only editable when campaign status is 'closed'
- [ ] Retrospective saved to campaign document
- [ ] Displayed separately from thesis and notes
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: View campaign detail

**Description:** As a trader, I want to see all details of a campaign including trades and P&L.

**Acceptance Criteria:**
- [ ] Shows campaign name, status, thesis
- [ ] Shows instruments with underlying asset mapping
- [ ] Shows all targets (entry, profit)
- [ ] Shows stop loss history with timestamps
- [ ] Shows all notes in chronological order
- [ ] Shows retrospective (if closed)
- [ ] Shows all linked trades in a table
- [ ] Shows calculated realized P&L from closed trades
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Record portfolio snapshot

**Description:** As a trader, I want to record my portfolio value so analytics can calculate percentages.

**Acceptance Criteria:**
- [ ] Form to enter: date, total value, cash balance (optional)
- [ ] Source marked as 'manual'
- [ ] Date defaults to today
- [ ] Snapshot saved to database
- [ ] List of historical snapshots viewable
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Dashboard with portfolio analytics

**Description:** As a trader, I want a dashboard showing my key metrics so I can assess my performance.

**Acceptance Criteria:**
- [ ] Shows total realized P&L (YTD with option for all-time)
- [ ] Shows win rate (% of closed profitable campaigns)
- [ ] Shows average win vs average loss
- [ ] Shows profit factor (total gains / total losses)
- [ ] Shows number of open campaigns / total trades
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: Position summary

**Description:** As a trader, I want to see my current positions so I know my exposure.

**Acceptance Criteria:**
- [ ] List of all tickers with open positions
- [ ] Shows: ticker, quantity, average cost, current value (if price available), unrealized P&L
- [ ] Position calculated from aggregating all trades for that ticker
- [ ] Indicates if position is long or short
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: Campaign list view

**Description:** As a trader, I want to see all my campaigns so I can manage my trading ideas.

**Acceptance Criteria:**
- [ ] Table showing all campaigns
- [ ] Columns: name, status, instruments (with underlying), P&L, created date
- [ ] Filterable by status (planning, active, closed, all)
- [ ] Sortable by date, P&L, name
- [ ] Click opens campaign detail
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-014: Trade P&L calculation

**Description:** As a trader, I want each trade's P&L calculated so I can see individual performance.

**Acceptance Criteria:**
- [ ] Closing trades (sells for longs, covers for shorts) show realized P&L
- [ ] P&L calculated as: (exit price - entry price) × quantity for longs
- [ ] P&L calculated as: (entry price - exit price) × quantity for shorts
- [ ] Entry price derived from average cost of open position
- [ ] P&L displayed in trade list and detail views
- [ ] Typecheck passes

### US-015: Filter trades by date range

**Description:** As a trader, I want to filter trades by date so I can focus on specific periods.

**Acceptance Criteria:**
- [ ] Date range picker (start date, end date)
- [ ] Quick filters: Today, This Week, This Month, This Year, All Time
- [ ] Trade list updates to show only trades in range
- [ ] Analytics recalculate based on filtered trades
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: System must store trades with all fields defined in data architecture
- FR-2: System must store campaigns with thesis, instruments, targets, notes, and retrospective
- FR-3: System must calculate position sizes by aggregating trades per ticker
- FR-4: System must calculate P&L based on average cost basis
- FR-5: System must track campaign lifecycle (planning → active → closed)
- FR-6: System must compute portfolio analytics (win rate, avg win/loss, profit factor)
- FR-7: System must support both stocks and crypto asset types
- FR-8: System must support both long and short positions
- FR-9: System must allow trades to exist without a campaign (unlinked trades)
- FR-10: System must store portfolio snapshots for historical value tracking
- FR-11: System must calculate % of portfolio using nearest portfolio snapshot by date
- FR-12: System must map traded instruments to underlying assets (e.g., GLDM → GOLD)
- FR-13: System must maintain history of stop loss adjustments with timestamps
- FR-14: System must detect when campaign positions are fully closed and prompt user
- FR-15: All monetary values in USD only

## Non-Goals (Out of Scope)

- **No brokerage API integration** - MVP uses manual entry; API designed for but not implemented
- **No real-time price feeds** - Current prices entered manually or left blank
- **No options/futures trading** - Only stocks and crypto spot trading
- **No tax reporting** - No wash sale detection, cost basis reports, or tax lot optimization
- **No fee tracking** - Commission/fees not tracked (most brokers are zero-commission)
- **No multi-currency** - USD only
- **No mobile app** - Web only for MVP
- **No multi-user/sharing** - Single user application
- **No automated trade import** - No CSV/file import for MVP
- **No alerts/notifications** - No price alerts or reminders
- **No charting** - No price charts or technical analysis tools
- **No rich media in notes** - Text only, no images or file attachments (room to grow later)

## Technical Considerations

### Stack (per monorepo conventions)
- **Framework:** Next.js with React
- **Backend:** Convex (serverless with real-time sync)
- **Auth:** Clerk
- **Styling:** Tailwind CSS (dark mode)
- **Forms:** TanStack React Form with Zod validation
- **UI:** Radix primitives, component library

### Convex Schema Design
- Use indexes for: trades by ticker, trades by date, trades by campaignId
- Instruments stored as array within campaign (supports underlying mapping)
- Targets stored as nested objects within campaign document
- Stop loss history stored as array within campaign (chronological)
- Notes stored in separate table with campaignId foreign key for efficient querying

### Data Integrity
- Trades should validate side/direction combinations
- Campaign status transitions should be enforced (no backwards movement)
- Portfolio snapshots should prevent duplicate dates
- Trade tickers should match campaign instruments when linked

### Future API Integration Points
- PortfolioSnapshot.source field ready for 'api' value
- Trade schema extensible for additional brokerage metadata
- Consider storing brokerage-specific IDs for deduplication

## Success Metrics

- User can log a trade in under 30 seconds
- User can create a campaign with full thesis and targets in under 2 minutes
- Dashboard loads with all analytics calculated in under 1 second
- Win rate and P&L calculations match manual verification
- All trades accurately attributed to correct positions
- Stop loss history provides clear audit trail of risk management decisions

## Open Questions

1. **Crypto-specific fields:** Do crypto trades need additional fields like network, wallet address, or exchange?

2. **Historical price data:** Should we integrate a free price API (e.g., Yahoo Finance, CoinGecko) for current prices, or always require manual entry?

3. **Campaign templates:** Would pre-defined campaign templates (e.g., "momentum trade", "value investment", "pairs trade") be useful for faster setup?

4. **Underlying asset analytics:** Should analytics be groupable by underlying asset? (e.g., see all gold-related P&L across GLDM, GLD, IAU)

5. **Stop loss visualization:** Should stop loss history be visualized on a timeline/chart, or is a simple list sufficient?
