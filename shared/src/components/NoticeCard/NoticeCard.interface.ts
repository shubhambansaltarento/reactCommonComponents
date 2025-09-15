import type { ReactNode } from "react";

export type NoticeItem = {
  label: string;
  value: ReactNode;          // string | number | node
  bold?: boolean;            // make value bold (e.g., 600, £5,000)
};

export interface NoticeCardProps {
  /** Top bar */
  title?: string;
  onBack?: () => void;

  /** Optional header block (e.g., "Order ID: AB27384") */
  headerLabel?: string;
  headerValue?: ReactNode;

  /** Optional description below the header block */
  description?: ReactNode;

  /** Label/value items shown in a simple responsive 2-column grid */
  items: NoticeItem[];

  /** Primary CTA */
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;

  /** Optional className to extend styles */
  className?: string;
}
