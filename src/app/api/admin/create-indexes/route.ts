/**
 * Admin API Route for Creating Database Indexes
 * This route allows creating indexes through the application's existing MongoDB connection
 * 
 * Usage: Call POST /api/admin/create-indexes with admin authentication
 * Or use the environment variable ADMIN_SECRET as a query parameter for one-time setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import mongoose from 'mongoose';

// Secret for one-time index creation (set this in your .env.local)
const ADMIN_SECRET = process.env.ADMIN_INDEX_SECRET || process.env.ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check for admin secret in query params or body
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');
    
    let body: { secret?: string } = {};
    try {
      body = await request.json();
    } catch {
      // No body provided
    }
    
    const providedSecret = secretParam || body.secret;
    
    if (!ADMIN_SECRET || providedSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db!;
    
    const results: { collection: string; indexes: string[]; success: boolean; error?: string }[] = [];

    // Alternative indexes
    try {
      const alternativesCollection = db.collection('alternatives');
      const altIndexes: string[] = [];
      
      // Single field indexes - create each one individually
      const indexSpecs: Array<{ key: Record<string, 1 | -1>; options: { unique?: boolean; background: boolean } }> = [
        { key: { slug: 1 }, options: { unique: true, background: true } },
        { key: { approved: 1 }, options: { background: true } },
        { key: { featured: 1 }, options: { background: true } },
        { key: { health_score: -1 }, options: { background: true } },
        { key: { vote_score: -1 }, options: { background: true } },
        { key: { is_self_hosted: 1 }, options: { background: true } },
        { key: { created_at: -1 }, options: { background: true } },
        { key: { user_id: 1 }, options: { background: true } },
        { key: { categories: 1 }, options: { background: true } },
        { key: { tags: 1 }, options: { background: true } },
        { key: { tech_stacks: 1 }, options: { background: true } },
        { key: { alternative_to: 1 }, options: { background: true } },
        { key: { submission_plan: 1 }, options: { background: true } },
        // Compound indexes
        { key: { approved: 1, health_score: -1 }, options: { background: true } },
        { key: { approved: 1, vote_score: -1 }, options: { background: true } },
        { key: { approved: 1, created_at: -1 }, options: { background: true } },
        { key: { approved: 1, featured: 1 }, options: { background: true } },
        { key: { approved: 1, is_self_hosted: 1 }, options: { background: true } },
        { key: { approved: 1, categories: 1, health_score: -1 }, options: { background: true } },
      ];

      for (const idx of indexSpecs) {
        try {
          const result = await alternativesCollection.createIndex(idx.key, idx.options);
          altIndexes.push(result);
        } catch {
          // Index may already exist, continue
        }
      }

      // Text index - handle existing index with different weights
      try {
        await alternativesCollection.createIndex(
          { name: 'text', description: 'text', short_description: 'text' },
          { weights: { name: 10, short_description: 5, description: 1 }, background: true }
        );
        altIndexes.push('text_index');
      } catch {
        // Text index may already exist with different weights - this is OK
        altIndexes.push('text_index (existing)');
      }

      results.push({ collection: 'alternatives', indexes: altIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'alternatives', indexes: [], success: false, error: String(error) });
    }

    // Category indexes
    try {
      const categoriesCollection = db.collection('categories');
      const catIndexes = [
        await categoriesCollection.createIndex({ slug: 1 }, { unique: true, background: true }),
        await categoriesCollection.createIndex({ name: 1 }, { background: true }),
      ];
      results.push({ collection: 'categories', indexes: catIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'categories', indexes: [], success: false, error: String(error) });
    }

    // Tech stack indexes
    try {
      const techStacksCollection = db.collection('techstacks');
      const techIndexes = [
        await techStacksCollection.createIndex({ slug: 1 }, { unique: true, background: true }),
        await techStacksCollection.createIndex({ name: 1 }, { background: true }),
        await techStacksCollection.createIndex({ type: 1 }, { background: true }),
      ];
      results.push({ collection: 'techstacks', indexes: techIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'techstacks', indexes: [], success: false, error: String(error) });
    }

    // Tag indexes
    try {
      const tagsCollection = db.collection('tags');
      const tagIndexes = [
        await tagsCollection.createIndex({ slug: 1 }, { unique: true, background: true }),
        await tagsCollection.createIndex({ name: 1 }, { background: true }),
      ];
      results.push({ collection: 'tags', indexes: tagIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'tags', indexes: [], success: false, error: String(error) });
    }

    // Proprietary software indexes
    try {
      const proprietaryCollection = db.collection('proprietarysoftwares');
      const propIndexes = [
        await proprietaryCollection.createIndex({ slug: 1 }, { unique: true, background: true }),
        await proprietaryCollection.createIndex({ name: 1 }, { background: true }),
      ];
      results.push({ collection: 'proprietarysoftwares', indexes: propIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'proprietarysoftwares', indexes: [], success: false, error: String(error) });
    }

    // Vote indexes
    try {
      const votesCollection = db.collection('votes');
      const voteIndexes = [
        await votesCollection.createIndex({ user_id: 1, alternative_id: 1 }, { unique: true, background: true }),
        await votesCollection.createIndex({ alternative_id: 1 }, { background: true }),
        await votesCollection.createIndex({ created_at: -1 }, { background: true }),
      ];
      results.push({ collection: 'votes', indexes: voteIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'votes', indexes: [], success: false, error: String(error) });
    }

    // Discussion indexes
    try {
      const discussionsCollection = db.collection('discussions');
      const discIndexes = [
        await discussionsCollection.createIndex({ alternative_id: 1, created_at: -1 }, { background: true }),
        await discussionsCollection.createIndex({ user_id: 1 }, { background: true }),
        await discussionsCollection.createIndex({ parent_id: 1 }, { background: true }),
      ];
      results.push({ collection: 'discussions', indexes: discIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'discussions', indexes: [], success: false, error: String(error) });
    }

    // Discussion vote indexes
    try {
      const discVotesCollection = db.collection('discussionvotes');
      const dvIndexes = [
        await discVotesCollection.createIndex({ user_id: 1, discussion_id: 1 }, { unique: true, background: true }),
        await discVotesCollection.createIndex({ discussion_id: 1 }, { background: true }),
      ];
      results.push({ collection: 'discussionvotes', indexes: dvIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'discussionvotes', indexes: [], success: false, error: String(error) });
    }

    // User indexes
    try {
      const usersCollection = db.collection('users');
      const userIndexes = [
        await usersCollection.createIndex({ email: 1 }, { unique: true, background: true }),
        await usersCollection.createIndex({ username: 1 }, { unique: true, sparse: true, background: true }),
      ];
      results.push({ collection: 'users', indexes: userIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'users', indexes: [], success: false, error: String(error) });
    }

    // Newsletter indexes
    try {
      const newsletterCollection = db.collection('newslettersubscribers');
      const nlIndexes = [
        await newsletterCollection.createIndex({ email: 1 }, { unique: true, background: true }),
        await newsletterCollection.createIndex({ subscribed_at: -1 }, { background: true }),
      ];
      results.push({ collection: 'newslettersubscribers', indexes: nlIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'newslettersubscribers', indexes: [], success: false, error: String(error) });
    }

    // Advertisement indexes
    try {
      const adsCollection = db.collection('advertisements');
      const adIndexes = [
        await adsCollection.createIndex({ status: 1, start_date: 1, end_date: 1 }, { background: true }),
        await adsCollection.createIndex({ type: 1 }, { background: true }),
        await adsCollection.createIndex({ user_id: 1 }, { background: true }),
      ];
      results.push({ collection: 'advertisements', indexes: adIndexes, success: true });
    } catch (error) {
      results.push({ collection: 'advertisements', indexes: [], success: false, error: String(error) });
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Index creation complete: ${successful} collections succeeded, ${failed} failed`,
      results,
    });

  } catch (error) {
    console.error('Error creating indexes:', error);
    return NextResponse.json(
      { error: 'Failed to create indexes', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Same functionality for GET requests for easier testing
  return POST(request);
}
