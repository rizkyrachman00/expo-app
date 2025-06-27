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

// Schema untuk payload extend subscription (POST /subscription/extend)
export const ExtendSubscriptionPayloadSchema = z.object({
  membershipCardId: z.string().uuid(),
  activeSince: z.string(), // ISO date string
  activeUntil: z.string(), // ISO date string
  branches: z.array(z.string().min(1)), // identifier string
});

export const AddSubscriptionPayloadSchema = z.object({
  member: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
  }),
  branchIds: z.array(z.string().uuid()).min(1),
  activeSince: z.string().datetime(),
  activeUntil: z.string().datetime(),
});


// Infer Types
export type Member = z.infer<typeof MemberSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type MembershipCard = z.infer<typeof MembershipCardSchema>;

export type MemberSubscriptionItem = z.infer<
  typeof MemberSubscriptionItemSchema
>;

// Full Response { member, subscriptions: [...] }
export type MemberWithSubscriptions = z.infer<
  typeof MemberWithSubscriptionsSchema
>;

// Extend Subscription
export type ExtendSubscriptionPayload = z.infer<
  typeof ExtendSubscriptionPayloadSchema
>;

// Add New Subscription
export type AddSubscriptionPayload = z.infer<typeof AddSubscriptionPayloadSchema>;

