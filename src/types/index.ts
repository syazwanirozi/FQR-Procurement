export type ProcurementCategory = 
  | 'it'
  | 'facilities'
  | 'catering'
  | 'logistics'
  | 'legal'
  | 'security'
  | 'production'
  | 'merchandise'
  | 'genset'
  | 'vehicle_rental'
  | 'special_effects'
  | 'set_props'
  | 'light_sound'
  | 'empty_category';

export interface CategoryInfo {
  id: ProcurementCategory;
  name: string;
  count: number;
  color: string;
  dotColor: string;
}

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  ein: string;
  location: string;
  primaryContact: string;
  contactRole: string;
  contactEmail: string;
  phone: string;
  category: ProcurementCategory;
  categoryLabel: string;
  performanceScore: number; // percentage
  quotesSubmitted: number;
  totalQuotesInvited: number;
  activeRfqs: number;
  isVerified: boolean;
  statusTag?: 'verified' | 'pending-w9' | 'new-partner';
  notes?: string;
}

export interface BidSubmission {
  id: string;
  supplierName: string;
  supplierInitials: string;
  submittedAt: string;
  netAmount: number;
  sla: string;
  migrationCredit?: number;
  isVerified?: boolean;
  isLowestBid?: boolean;
  notes?: string;
  status: 'submitted' | 'pending' | 'rejected' | 'awarded';
}

export interface BQItem {
  id: string;
  itemNo: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedRate?: number;
  totalEstimated?: number;
}

export interface RFQItem {
  id: string;
  refNumber: string; // e.g. RFQ-2025-042
  title: string;
  category: ProcurementCategory;
  categoryLabel: string;
  status: 'urgent' | 'overdue' | 'active' | 'draft' | 'awarded';
  deadlineDate: string; // e.g. '2025-10-14'
  deadlineDisplay: string; // e.g. 'Today @ 17:00 EST (Due in 6h)'
  timeRemaining: string; // e.g. '6h left'
  urgencyHours: number; // for sorting/filtering
  budgetCeiling: number;
  budgetMin?: number;
  budgetMax?: number;
  bidsReceivedCount: number;
  bidsExpectedCount: number;
  specification: string;
  scopeMarkdown?: string;
  bqItems?: BQItem[];
  attachments?: string[];
  invitedSuppliers: string[];
  bids: BidSubmission[];
  dayOfMonth?: number; // for calendar rendering
}

export interface CalendarDayData {
  dayNumber: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  rfqs: RFQItem[];
}
