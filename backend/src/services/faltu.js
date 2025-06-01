
   */
  static async getSystemStats() {
    try {
      const [blockedUserStats, redisHealth] = await Promise.all([
        MemoryService.getBlockedUserStats(),
        MemoryService.checkRedisHealth()
      ]);

      return {
        timestamp: new Date().toISOString(),
        redis: redisHealth,
        crisisManagement: {
          ...blockedUserStats,
          autoUnblockEnabled: true,
          blockDuration: '24 hours'
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      };
    } catch (error) {
      console.error('❌ Error getting system stats:', error);
      return {
        timestamp: new Date().toISOString(),
        redis: { connected: false, error: error.message },
        crisisManagement: { error: error.message },
        system: { error: error.message }
      };
    }
  }

  /**
   * Admin function to manually unblock a user
   */
  static async adminUnblockUser(userId, adminId) {
    try {
      console.log(`👤 Admin ${adminId} attempting to unblock user ${userId}`);
      
      const result = await MemoryService.unblockUser(userId, adminId);
      
      if (result.success) {
        console.log(`✅ Admin unblock successful for user ${userId}`);
        return {
          success: true,
          message: `User ${userId} has been successfully unblocked by admin ${adminId}`,
          unblockTimestamp: new Date().toISOString(),
          previousBlockInfo: result.previousBlockInfo
        };
      } else {
        console.log(`⚠️ Admin unblock failed for user ${userId}: ${result.message}`);
        return {
          success: false,
          message: result.message,
          userId: userId,
          adminId: adminId
        };
      }
    } catch (error) {
      console.error('❌ Error in admin unblock operation:', error);
      return {
        success: false,
        message: 'An error occurred while attempting to unblock the user',
        error: error.message,
        userId: userId,
        adminId: adminId
      };
    }
  }

  /**
   * Get detailed information about all blocked users (admin function)
   */
  static async getBlockedUsersDetails() {
    try {
      const blockedUsers = await MemoryService.getAllBlockedUsers();
      
      // Get additional details for each blocked user
      const detailedUsers = await Promise.all(
        blockedUsers.map(async (user) => {
          const crisisStatus = await MemoryService.getUserCrisisStatus(user.userId);
          const userProfile = await MemoryService.getUserProfile(user.userId);
          
          return {
            ...user,
            crisisDetails: crisisStatus,
            hasProfile: !!userProfile,
            formattedTimeRemaining: this.formatTimeRemaining(user.timeRemaining)
          };
        })
      );

      return {
        success: true,
        totalBlocked: blockedUsers.length,
        users: detailedUsers,
        retrievedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting blocked users details:', error);
      return {
        success: false,
        error: error.message,
        users: []
      };
    }
  }

  /**
   * Check if a specific user is currently blocked
   */
  static async checkUserBlockStatus(userId) {
    try {
      const blockStatus = await MemoryService.isUserBlocked(userId);
      const crisisStatus = await MemoryService.getUserCrisisStatus(userId);
      
      return {
        userId,
        isBlocked: !!blockStatus,
        blockInfo: blockStatus,
        crisisInfo: crisisStatus,
        checkedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error checking block status for user ${userId}:`, error);
      return {
        userId,
        isBlocked: false,
        error: error.message,
        checkedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Utility function to format time remaining in human-readable format
   */
  static formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck() {
    try {
      const redisHealth = await MemoryService.checkRedisHealth();
      
      return {
        status: redisHealth.connected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          redis: redisHealth,
          chatService: { status: 'operational' }
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}




  /**
   * Manually unblock a user (admin function)
   */
  static async unblockUser(userId, adminId = null) {
    try {
      const crisisKey = `${REDIS_KEYS.USER_CRISIS_STATUS}:${userId}`;
      const blockedKey = `${REDIS_KEYS.SOS_BLOCKED_USERS}:${userId}`;
      
      // Check if user was actually blocked
      const wasBlocked = await this.isUserBlocked(userId);
      
      if (!wasBlocked) {
        console.log(`⚠️ User ${userId} was not blocked`);
        return { success: false, message: 'User was not blocked' };
      }
      
      // Remove both crisis status and blocked status
      const deleteResults = await Promise.all([
        redis.del(crisisKey),
        redis.del(blockedKey)
      ]);
      
      const logMessage = adminId 
        ? `✅ User ${userId} manually unblocked by admin ${adminId}` 
        : `✅ User ${userId} manually unblocked`;
      
      console.log(logMessage);
      
      return { 
        success: true, 
        message: 'User successfully unblocked',
        previousBlockInfo: wasBlocked
      };
    } catch (error) {
      console.error('❌ Error unblocking user:', error);
      return { success: false, message: 'Error occurred while unblocking user', error: error.message };
    }
  }

  /**
   * Get all currently blocked users (admin function)
   */
  static async getAllBlockedUsers() {
    try {
      const pattern = `${REDIS_KEYS.SOS_BLOCKED_USERS}:*`;
      const keys = await redis.keys(pattern);
      
      const blockedUsers = [];
      if (keys.length > 0) {
        const values = await redis.mget(keys);
        
        for (let i = 0; i < keys.length; i++) {
          if (values[i]) {
            const userData = JSON.parse(values[i]);
            const userId = keys[i].split(':').pop();
            const timeRemaining = await redis.ttl(keys[i]);
            
            blockedUsers.push({
              userId,
              ...userData,
              timeRemaining: timeRemaining > 0 ? timeRemaining : 0,
              expiresAt: timeRemaining > 0 
                ? new Date(Date.now() + (timeRemaining * 1000)).toISOString()
                : 'Expired'
            });
          }
        }
      }
      
      return blockedUsers;
    } catch (error) {
      console.error('❌ Error getting all blocked users:', error);
      return [];
    }
  }

  /**
   * Get blocked user statistics
   */
  static async getBlockedUserStats() {
    try {
      const blockedUsers = await this.getAllBlockedUsers();
      
      return {
        totalBlocked: blockedUsers.length,
        activeBlocks: blockedUsers.filter(user => user.timeRemaining > 0).length,
        expiredBlocks: blockedUsers.filter(user => user.timeRemaining <= 0).length,
        averageTimeRemaining: blockedUsers.length > 0 
          ? Math.round(blockedUsers.reduce((sum, user) => sum + user.timeRemaining, 0) / blockedUsers.length)
          : 0
      };
    } catch (error) {
      console.error('❌ Error getting blocked user stats:', error);
      return {
        totalBlocked: 0,
        activeBlocks: 0,
        expiredBlocks: 0,
        averageTimeRemaining: 0,
        error: error.message
      };
    }
  }

  /**
   * Clean up expired crisis entries (optional manual cleanup)
   */
  static async cleanupExpiredCrisisEntries() {
    try {
      const patterns = [
        `${REDIS_KEYS.SOS_BLOCKED_USERS}:*`,
        `${REDIS_KEYS.USER_CRISIS_STATUS}:*`
      ];

      let cleanedCount = 0;
      
      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        
        for (const key of keys) {
          const ttl = await redis.ttl(key);
          // TTL returns -1 if key exists but has no expiration, -2 if key doesn't exist
          if (ttl === -2) {
            cleanedCount++;
          }
        }
      }
      
      console.log(`🧹 Crisis cleanup completed. ${cleanedCount} expired entries found (auto-cleaned by Redis)`);
      return {
        success: true,
        expiredEntriesFound: cleanedCount,
        message: 'Redis automatically handles expiration cleanup'
      };
    } catch (error) {
      console.error('❌ Error during crisis cleanup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check Redis connection health
   */
  static async checkRedisHealth() {
    try {
      const start = Date.now();
      await redis.ping();
      const responseTime = Date.now() - start;
      
      return {
        connected: true,
        status: redis.status,
        responseTime: `${responseTime}ms`
      };
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return {
        connected: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Get comprehensive user data (profile + crisis status)
   */
  static async getComprehensiveUserData(userId) {
    try {
      const [profile, crisisStatus, blockStatus] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserCrisisStatus(userId),
        this.isUserBlocked(userId)
      ]);

      return {
        userId,
        profile,
        crisisStatus,
        blockStatus,
        isCurrentlyBlocked: !!blockStatus,
        retrievedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting comprehensive user data:', error);
      return {
        userId,
        profile: null,
        crisisStatus: null,
        blockStatus: null,
        isCurrentlyBlocked: false,
        error: error.message,
        retrievedAt: new Date().toISOString()
      };
    }
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('🔄 Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});