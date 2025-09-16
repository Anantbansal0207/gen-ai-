// selfSpaceService.js
import { supabase } from '../utils/supabase.js';
import { supabaseAdmin } from '../utils/supabaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class SelfSpaceService {
  /**
   * Upload an image to Supabase storage
   * @param {string} userId - User ID
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @param {string} mimeType - File MIME type
   * @returns {Promise<string>} - Storage path
   */
  static async uploadImage(userId, fileBuffer, fileName, mimeType) {
    try {
      // Generate unique filename
      const fileExt = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExt}`;
      const filePath = `${userId}/${uniqueFileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from('self-space')
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          duplex: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Failed to upload image');
      }

      return data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Create a new self space entry
   * @param {string} userId - User ID
   * @param {string} type - Entry type ('text' or 'image')
   * @param {string} content - Text content (for text entries)
   * @param {string} imageUrl - Image storage path (for image entries)
   * @returns {Promise<Object>} - Created entry
   */
  static async createEntry(userId, type, content = null, imageUrl = null) {
    try {
      const entryData = {
        user_id: userId,
        type,
        content,
        image_url: imageUrl
      };

      const { data, error } = await supabase
        .from('self_space_entries')
        .insert(entryData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error('Failed to create entry');
      }

      return data;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  }

  /**
   * Get all entries for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - User's entries
   */
  static async getUserEntries(userId) {
    try {
      const { data, error } = await supabase
        .from('self_space_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database select error:', error);
        throw new Error('Failed to fetch entries');
      }

      // For image entries, generate signed URLs
      const entriesWithUrls = await Promise.all(
        data.map(async (entry) => {
          if (entry.type === 'image' && entry.image_url) {
            try {
              const { data: urlData, error: urlError } = await supabaseAdmin.storage
                .from('self-space')
                .createSignedUrl(entry.image_url, 3600); // 1 hour expiry

              if (!urlError && urlData?.signedUrl) {
                return { ...entry, signedUrl: urlData.signedUrl };
              }
            } catch (urlError) {
              console.error('Error generating signed URL for:', entry.image_url, urlError);
            }
          }
          return entry;
        })
      );

      return entriesWithUrls;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  /**
   * Delete an entry and associated image if applicable
   * @param {string} userId - User ID
   * @param {string} entryId - Entry ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteEntry(userId, entryId) {
    try {
      // First, get the entry to check if it has an image
      const { data: entry, error: fetchError } = await supabase
        .from('self_space_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Entry not found');
        }
        throw new Error('Failed to fetch entry');
      }

      // If it's an image entry, delete the file from storage
      if (entry.type === 'image' && entry.image_url) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('self-space')
          .remove([entry.image_url]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Don't throw here - continue with database deletion even if storage fails
        }
      }

      // Delete the entry from database
      const { error: deleteError } = await supabase
        .from('self_space_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Database deletion error:', deleteError);
        throw new Error('Failed to delete entry');
      }

      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }

  /**
   * Get a single entry by ID
   * @param {string} userId - User ID
   * @param {string} entryId - Entry ID
   * @returns {Promise<Object>} - Entry data
   */
  static async getEntryById(userId, entryId) {
    try {
      const { data, error } = await supabase
        .from('self_space_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Entry not found');
        }
        throw new Error('Failed to fetch entry');
      }

      // Generate signed URL for images
      if (data.type === 'image' && data.image_url) {
        try {
          const { data: urlData, error: urlError } = await supabaseAdmin.storage
            .from('self-space')
            .createSignedUrl(data.image_url, 3600);

          if (!urlError && urlData?.signedUrl) {
            data.signedUrl = urlData.signedUrl;
          }
        } catch (urlError) {
          console.error('Error generating signed URL:', urlError);
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching entry by ID:', error);
      throw error;
    }
  }
}