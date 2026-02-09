import { Inngest } from 'inngest'
import connectDB from './db.js'
import User from '../models/user.model.js'

export const inngest = new Inngest({
  id: 'Expo-Ecommerce',
})

const syncUser = inngest.createFunction(
  { id: 'Sync-User' },
  { event: 'clerk/user.created' },
  async ({ event, step }) => {
    await connectDB();
    const { id, email_addresses,first_name,last_name,image_url } = event.data

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown User",
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    }

    await User.create(newUser)
    console.log('User signed in:', newUser)
    // Here you can add logic to sync the user data with your database
  }
)

const deleteUserFromDB = inngest.createFunction(
  { id: 'Delete-User-from-DB' },
  { event: 'clerk/user.deleted' },
  async ({ event, step }) => {
    await connectDB();
    const { id } = event.data
    await User.findOneAndDelete({ clerkId: id })
    console.log('User deleted from DB:', id)
    // Here you can add logic to delete the user data from your database
  }
)   

export const functions = [syncUser, deleteUserFromDB];

export const userSignedIn = inngest.createEvent(
  { name: 'user.signed_in' },
  syncUser
)   