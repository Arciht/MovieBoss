import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', searchTerm),
  ])

  // 2. If it does, update the count
  if(result.documents.length > 0) {
   const doc = result.documents[0];

   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1,
   })
  // 3. If it doesn't, create a new document with the search term and count as 1
  } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   })
  }
 } catch (error) {
  console.error(error);
 }
}

export async function getTrendingMovies() {
  try {
    const response = await databases.listDocuments(
      '689b2336002e494ff780',
      '689b23a200214075873b',
      [
        Query.limit(5),
        Query.orderDesc('count'),
      ]
    );
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch trending movies:', error);
    return null; // 👈 Return null or empty object to prevent crash
  }
}