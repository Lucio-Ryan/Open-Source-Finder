import mongoose, { Schema, Document, Model } from 'mongoose';

// ============ USER SCHEMA ============
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  github_username: string | null;
  twitter_username: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  discord_username: string | null;
  role: 'user' | 'admin' | 'moderator';
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: null },
    avatar_url: { type: String, default: null },
    bio: { type: String, default: null },
    website: { type: String, default: null },
    github_username: { type: String, default: null },
    twitter_username: { type: String, default: null },
    linkedin_url: { type: String, default: null },
    youtube_url: { type: String, default: null },
    discord_username: { type: String, default: null },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    email_verified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// ============ CATEGORY SCHEMA ============
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Code' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

CategorySchema.index({ slug: 1 });

// ============ TECH STACK SCHEMA ============
export interface ITechStack extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: string;
  created_at: Date;
}

const TechStackSchema = new Schema<ITechStack>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, default: 'Tool' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

TechStackSchema.index({ slug: 1 });
TechStackSchema.index({ type: 1 });

// ============ TAG SCHEMA ============
export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  created_at: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

TagSchema.index({ slug: 1 });

// ============ PROPRIETARY SOFTWARE SCHEMA ============
export interface IProprietarySoftware extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  website: string;
  icon_url: string | null;
  categories: mongoose.Types.ObjectId[];
  created_at: Date;
}

const ProprietarySoftwareSchema = new Schema<IProprietarySoftware>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    icon_url: { type: String, default: null },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

ProprietarySoftwareSchema.index({ slug: 1 });

// ============ ALTERNATIVE SCHEMA ============
export interface IAlternative extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  long_description: string | null;
  icon_url: string | null;
  website: string;
  github: string;
  stars: number;
  forks: number;
  last_commit: Date | null;
  contributors: number;
  license: string | null;
  is_self_hosted: boolean;
  health_score: number;
  vote_score: number;
  featured: boolean;
  approved: boolean;
  rejection_reason: string | null;
  rejected_at: Date | null;
  submitter_name: string | null;
  submitter_email: string | null;
  user_id: mongoose.Types.ObjectId | null;
  screenshots: string[];
  submission_plan: 'free' | 'sponsor';
  backlink_verified: boolean;
  backlink_url: string | null;
  sponsor_featured_until: Date | null;
  sponsor_priority_until: Date | null;
  sponsor_payment_id: string | null;
  sponsor_paid_at: Date | null;
  newsletter_included: boolean;
  // Relations stored as references
  categories: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  tech_stacks: mongoose.Types.ObjectId[];
  alternative_to: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const AlternativeSchema = new Schema<IAlternative>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    short_description: { type: String, default: null },
    long_description: { type: String, default: null },
    icon_url: { type: String, default: null },
    website: { type: String, required: true },
    github: { type: String, required: true },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    last_commit: { type: Date, default: null },
    contributors: { type: Number, default: 0 },
    license: { type: String, default: null },
    is_self_hosted: { type: Boolean, default: false },
    health_score: { type: Number, default: 50, min: 0, max: 100 },
    vote_score: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    rejection_reason: { type: String, default: null },
    rejected_at: { type: Date, default: null },
    submitter_name: { type: String, default: null },
    submitter_email: { type: String, default: null },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    screenshots: [{ type: String }],
    submission_plan: { type: String, enum: ['free', 'sponsor'], default: 'free' },
    backlink_verified: { type: Boolean, default: false },
    backlink_url: { type: String, default: null },
    sponsor_featured_until: { type: Date, default: null },
    sponsor_priority_until: { type: Date, default: null },
    sponsor_payment_id: { type: String, default: null },
    sponsor_paid_at: { type: Date, default: null },
    newsletter_included: { type: Boolean, default: false },
    // Relations
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    tech_stacks: [{ type: Schema.Types.ObjectId, ref: 'TechStack' }],
    alternative_to: [{ type: Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
AlternativeSchema.index({ slug: 1 });
AlternativeSchema.index({ approved: 1 });
AlternativeSchema.index({ featured: 1 });
AlternativeSchema.index({ health_score: -1 });
AlternativeSchema.index({ is_self_hosted: 1 });
AlternativeSchema.index({ user_id: 1 });
AlternativeSchema.index({ submission_plan: 1 });
AlternativeSchema.index({ name: 'text', description: 'text', short_description: 'text' });

// ============ VOTE SCHEMA ============
export interface IVote extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  alternative_id: mongoose.Types.ObjectId;
  vote_type: number; // 1 for upvote, -1 for downvote
  created_at: Date;
  updated_at: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alternative_id: { type: Schema.Types.ObjectId, ref: 'Alternative', required: true },
    vote_type: { type: Number, required: true, enum: [-1, 1] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound index to ensure one vote per user per alternative
VoteSchema.index({ user_id: 1, alternative_id: 1 }, { unique: true });

// ============ DISCUSSION SCHEMA ============
export interface IDiscussion extends Document {
  _id: mongoose.Types.ObjectId;
  alternative_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  content: string;
  request_creator_response: boolean;
  parent_id: mongoose.Types.ObjectId | null;
  is_creator_response: boolean;
  created_at: Date;
  updated_at: Date;
}

const DiscussionSchema = new Schema<IDiscussion>(
  {
    alternative_id: { type: Schema.Types.ObjectId, ref: 'Alternative', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    request_creator_response: { type: Boolean, default: false },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Discussion', default: null },
    is_creator_response: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

DiscussionSchema.index({ alternative_id: 1 });
DiscussionSchema.index({ user_id: 1 });
DiscussionSchema.index({ parent_id: 1 });

// ============ DISCUSSION VOTE SCHEMA ============
export interface IDiscussionVote extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  discussion_id: mongoose.Types.ObjectId;
  vote_type: number;
  created_at: Date;
}

const DiscussionVoteSchema = new Schema<IDiscussionVote>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    discussion_id: { type: Schema.Types.ObjectId, ref: 'Discussion', required: true },
    vote_type: { type: Number, required: true, enum: [-1, 1] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

DiscussionVoteSchema.index({ user_id: 1, discussion_id: 1 }, { unique: true });

// ============ CREATOR NOTIFICATION SCHEMA ============
export interface ICreatorNotification extends Document {
  _id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  alternative_id: mongoose.Types.ObjectId;
  discussion_id: mongoose.Types.ObjectId;
  type: 'response_request' | 'new_discussion';
  message: string;
  is_read: boolean;
  created_at: Date;
}

const CreatorNotificationSchema = new Schema<ICreatorNotification>(
  {
    creator_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alternative_id: { type: Schema.Types.ObjectId, ref: 'Alternative', required: true },
    discussion_id: { type: Schema.Types.ObjectId, ref: 'Discussion', required: true },
    type: { type: String, enum: ['response_request', 'new_discussion'], required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

CreatorNotificationSchema.index({ creator_id: 1, is_read: 1 });

// ============ ADVERTISEMENT SCHEMA ============
export interface IAdvertisement extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  ad_type: 'banner' | 'popup' | 'card';
  company_name: string;
  company_website: string;
  company_logo: string | null;
  headline: string | null;
  cta_text: string;
  destination_url: string;
  icon_url: string | null;
  short_description: string | null;
  is_active: boolean;
  priority: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  approved_at: Date | null;
  approved_by: mongoose.Types.ObjectId | null;
  start_date: Date | null;
  end_date: Date | null;
  user_id: mongoose.Types.ObjectId | null;
  submitter_name: string | null;
  submitter_email: string;
  impressions: number;
  clicks: number;
  payment_id: string | null;
  paid_at: Date | null;
  payment_amount: number | null;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ad_type: { type: String, enum: ['banner', 'popup', 'card'], required: true },
    company_name: { type: String, required: true },
    company_website: { type: String, required: true },
    company_logo: { type: String, default: null },
    headline: { type: String, default: null },
    cta_text: { type: String, default: 'Learn More' },
    destination_url: { type: String, required: true },
    icon_url: { type: String, default: null },
    short_description: { type: String, default: null },
    is_active: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejection_reason: { type: String, default: null },
    approved_at: { type: Date, default: null },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    submitter_name: { type: String, default: null },
    submitter_email: { type: String, required: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    payment_id: { type: String, default: null },
    paid_at: { type: Date, default: null },
    payment_amount: { type: Number, default: null },
    expires_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

AdvertisementSchema.index({ ad_type: 1, status: 1, is_active: 1 });
AdvertisementSchema.index({ priority: -1 });
AdvertisementSchema.index({ user_id: 1, status: 1 });

// ============ SESSION SCHEMA (for JWT-based auth) ============
export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  token: string;
  expires_at: Date;
  created_at: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

SessionSchema.index({ token: 1 });
SessionSchema.index({ user_id: 1 });
SessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index

// ============ POLICY SCHEMA ============
export interface IPolicy extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'privacy' | 'terms' | 'refund';
  title: string;
  content: string;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const PolicySchema = new Schema<IPolicy>(
  {
    type: { 
      type: String, 
      required: true, 
      unique: true, 
      enum: ['privacy', 'terms', 'refund'] 
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

PolicySchema.index({ type: 1 });

// ============ MODEL EXPORTS ============
// Use this pattern to prevent model recompilation in development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const TechStack: Model<ITechStack> = mongoose.models.TechStack || mongoose.model<ITechStack>('TechStack', TechStackSchema);
export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export const ProprietarySoftware: Model<IProprietarySoftware> = mongoose.models.ProprietarySoftware || mongoose.model<IProprietarySoftware>('ProprietarySoftware', ProprietarySoftwareSchema);
export const Alternative: Model<IAlternative> = mongoose.models.Alternative || mongoose.model<IAlternative>('Alternative', AlternativeSchema);
export const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
export const Discussion: Model<IDiscussion> = mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
export const DiscussionVote: Model<IDiscussionVote> = mongoose.models.DiscussionVote || mongoose.model<IDiscussionVote>('DiscussionVote', DiscussionVoteSchema);
export const CreatorNotification: Model<ICreatorNotification> = mongoose.models.CreatorNotification || mongoose.model<ICreatorNotification>('CreatorNotification', CreatorNotificationSchema);
export const Advertisement: Model<IAdvertisement> = mongoose.models.Advertisement || mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);
export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
export const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);
