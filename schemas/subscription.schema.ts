import { z } from "zod";

// Branch
export const BranchSchema = z.object({
  id: z.string().uuid(),
  identifier: z.string(),
  name: z.string(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
});

// Membership Card
export const MembershipCardSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
});

// Subscription
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  membershipCardId: z.string().uuid().nullable(),
  activeSince: z.string(), 
  activeUntil: z.string(),
  createdBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
});

// Member
export const MemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
});

// Item dalam subscriptions[]
export const MemberSubscriptionItemSchema = z.object({
  membershipCard: MembershipCardSchema,
  subscription: SubscriptionSchema,
  branches: z.array(BranchSchema),
});

// Full response: { member, subscriptions: [...] }
export const MemberWithSubscriptionsSchema = z.object({
  member: MemberSchema,
  subscriptions: z.array(MemberSubscriptionItemSchema),
});

// Final schema untuk /subscriptions response
export const MemberWithSubscriptionsListResponseSchema = z.array(
  MemberWithSubscriptionsSchema
);

// Infer Types
export type Member = z.infer<typeof MemberSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type MembershipCard = z.infer<typeof MembershipCardSchema>;
export type MemberSubscriptionItem = z.infer<
  typeof MemberSubscriptionItemSchema
>;
export type MemberWithSubscriptions = z.infer<
  typeof MemberWithSubscriptionsSchema
>;
