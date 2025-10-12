import { supabase } from './supabaseClient';
import { encryptMessage, decryptMessage } from './encryptionService';

/**
 * Creates a new conversation or gets existing one
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {Promise<Object>} - Conversation object
 */
export const getOrCreateConversation = async (userId1, userId2) => {
  try {
    // Check if conversation already exists
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
      .single();

    if (existing) {
      return existing;
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        user1_id: userId1,
        user2_id: userId2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) throw createError;
    return newConversation;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

/**
 * Gets all conversations for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of conversations with participant info
 */
export const getUserConversations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:users!conversations_user1_id_fkey(id, display_name, avatar_url, email),
        user2:users!conversations_user2_id_fkey(id, display_name, avatar_url, email),
        last_message:messages(id, content, created_at, sender_id, is_read)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Process conversations to determine the other participant
    const conversations = data.map(conv => {
      const isUser1 = conv.user1_id === userId;
      const otherUser = isUser1 ? conv.user2 : conv.user1;
      
      // Get the most recent message
      const lastMessage = conv.last_message && conv.last_message.length > 0 
        ? conv.last_message[0] 
        : null;

      return {
        id: conv.id,
        participant: otherUser,
        lastMessage: lastMessage ? {
          ...lastMessage,
          content: decryptMessage(lastMessage.content)
        } : null,
        updatedAt: conv.updated_at
      };
    });

    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Gets all messages for a conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Array>} - Array of messages
 */
export const getConversationMessages = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, display_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Decrypt messages
    return data.map(msg => ({
      ...msg,
      content: decryptMessage(msg.content),
      decrypted: true
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Sends an encrypted message
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} - Sent message
 */
export const sendMessage = async ({ conversationId, senderId, recipientId, content, urgent = false }) => {
  try {
    // Encrypt the message
    const encryptedContent = encryptMessage(content);

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        recipient_id: recipientId,
        content: encryptedContent,
        is_urgent: urgent,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, display_name, avatar_url)
      `)
      .single();

    if (messageError) throw messageError;

    // Update conversation's updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return {
      ...message,
      content: content, // Return decrypted content
      decrypted: true
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Marks messages as read
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - Current user ID
 */
export const markMessagesAsRead = async (conversationId, userId) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

/**
 * Gets unread message count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Unread count
 */
export const getUnreadCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

/**
 * Subscribe to new messages in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {Function} callback - Callback function for new messages
 * @returns {Object} - Subscription object
 */
export const subscribeToMessages = (conversationId, callback) => {
  console.log('📡 Setting up realtime subscription for conversation:', conversationId);
  
  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      async (payload) => {
        try {
          console.log('📨 New message detected in database:', payload.new.id);
          
          // Fetch full message with sender info
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(id, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            console.log('✅ Message fetched, calling callback');
            callback({
              ...data,
              content: decryptMessage(data.content),
              decrypted: true
            });
          } else {
            console.error('❌ Error fetching message:', error);
          }
        } catch (error) {
          console.error('❌ Error in message subscription:', error);
        }
      }
    )
    .subscribe((status) => {
      console.log('🔔 Subscription status:', status);
    });

  return subscription;
};

/**
 * Subscribe to conversation updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Object} - Subscription object
 */
export const subscribeToConversations = (userId, callback) => {
  const subscription = supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `or(user1_id.eq.${userId},user2_id.eq.${userId})`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Gets doctors assigned to a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} - Array of doctors
 */
export const getPatientDoctors = async (patientId) => {
  try {
    // Get doctors who have appointments with this patient
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        appointments!inner(patient_id)
      `)
      .eq('appointments.patient_id', patientId)
      .order('first_name');

    if (error) throw error;
    
    // Remove duplicates based on doctor id
    const uniqueDoctors = data.reduce((acc, doctor) => {
      if (!acc.find(d => d.id === doctor.id)) {
        acc.push(doctor);
      }
      return acc;
    }, []);

    return uniqueDoctors;
  } catch (error) {
    console.error('Error fetching patient doctors:', error);
    return [];
  }
};
/**
 * Gets all doctors for patients to message
 * @returns {Promise<Array>} - Array of doctors with user accounts
 */
export const getAllDoctors = async () => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, user_id, first_name, last_name, email, specialization, profile_image_url, is_available')
      .eq('is_available', true)
      .not('user_id', 'is', null) // Only get doctors with user accounts
      .order('first_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

/**
 * Gets admin user for patients to message
 * @returns {Promise<Object>} - Admin user object
 */
export const getAdminUser = async () => {
  try {
    // Get users with admin role
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_roles!inner(
          role:roles!inner(name)
        )
      `)
      .eq('user_roles.role.name', 'admin')
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
};

