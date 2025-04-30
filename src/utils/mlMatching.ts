
import * as tf from '@tensorflow/tfjs';
import { LostItem, FoundItem } from "@/types";

// Load Universal Sentence Encoder model for text similarity
let useModel: tf.GraphModel | null = null;
let mobileNetModel: tf.GraphModel | null = null;

/**
 * Initialize the ML models (should be called on app startup)
 */
export async function initMLModels() {
  try {
    // Load Universal Sentence Encoder for text similarity
    console.log("Loading Universal Sentence Encoder model...");
    useModel = await tf.loadGraphModel(
      'https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder/1/default/1',
      { fromTFHub: true }
    );
    
    // Load MobileNet for image feature extraction
    console.log("Loading MobileNet model...");
    mobileNetModel = await tf.loadGraphModel(
      'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/2/default/1',
      { fromTFHub: true }
    );
    
    console.log("ML models loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading ML models:", error);
    return false;
  }
}

/**
 * Get text embeddings for a given text using Universal Sentence Encoder
 */
export async function getTextEmbeddings(text: string): Promise<number[] | null> {
  if (!useModel) {
    console.warn("Universal Sentence Encoder model not loaded. Call initMLModels first.");
    return null;
  }
  
  try {
    const embeddings = await useModel.predict(tf.tensor1d([text])) as tf.Tensor;
    const embeddingsArray = await embeddings.array();
    return embeddingsArray[0];
  } catch (error) {
    console.error("Error generating text embeddings:", error);
    return null;
  }
}

/**
 * Get image features for a given image URL using MobileNet
 */
export async function getImageFeatures(imageUrl: string): Promise<number[] | null> {
  if (!mobileNetModel) {
    console.warn("MobileNet model not loaded. Call initMLModels first.");
    return null;
  }
  
  if (!imageUrl) {
    return null;
  }
  
  try {
    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Preprocess the image to match MobileNet input requirements
    const tensor = tf.browser.fromPixels(img)
      .resizeBilinear([224, 224]) // Resize to match MobileNet input
      .toFloat()
      .expandDims();
    
    // Get image features
    const features = await mobileNetModel.predict(tensor) as tf.Tensor;
    const featuresArray = await features.array();
    
    // Clean up tensors
    tensor.dispose();
    features.dispose();
    
    return featuresArray[0];
  } catch (error) {
    console.error("Error extracting image features:", error);
    return null;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have same length");
  }
  
  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }
  
  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);
  
  if (aMagnitude === 0 || bMagnitude === 0) {
    return 0;
  }
  
  return dotProduct / (aMagnitude * bMagnitude);
}

/**
 * Calculate text similarity score using embeddings
 */
export async function getTextSimilarityScore(
  text1: string, 
  text2: string
): Promise<number> {
  try {
    const embeddings1 = await getTextEmbeddings(text1);
    const embeddings2 = await getTextEmbeddings(text2);
    
    if (!embeddings1 || !embeddings2) {
      return 0;
    }
    
    const similarity = cosineSimilarity(embeddings1, embeddings2);
    // Convert similarity to a 0-30 scale
    return Math.round(similarity * 30);
  } catch (error) {
    console.error("Error calculating text similarity:", error);
    return 0;
  }
}

/**
 * Calculate image similarity score
 */
export async function getImageSimilarityScore(
  imageUrl1: string | undefined, 
  imageUrl2: string | undefined
): Promise<number> {
  if (!imageUrl1 || !imageUrl2) {
    return 0;
  }
  
  try {
    const features1 = await getImageFeatures(imageUrl1);
    const features2 = await getImageFeatures(imageUrl2);
    
    if (!features1 || !features2) {
      return 0;
    }
    
    const similarity = cosineSimilarity(features1, features2);
    // Convert similarity to a 0-25 scale
    return Math.round(similarity * 25);
  } catch (error) {
    console.error("Error calculating image similarity:", error);
    return 0;
  }
}

/**
 * Enhanced match scoring using ML techniques for text and image similarity
 */
export async function calculateMLMatchScore(lostItem: LostItem, foundItem: FoundItem): Promise<number> {
  // Start with the traditional matching score
  let score = 0;
  
  // Category match (15 instead of 30 since we're adding more sophisticated metrics)
  if (lostItem.category === foundItem.category) {
    score += 15;
  }
  
  // Location match
  if (lostItem.location === foundItem.location) {
    score += 15;
  }
  
  // Date proximity
  const lostDate = new Date(lostItem.date).getTime();
  const foundDate = new Date(foundItem.date).getTime();
  const dayDiff = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24);
  
  if (dayDiff < 1) {
    score += 15; // Same day
  } else if (dayDiff < 3) {
    score += 12; // Within 3 days
  } else if (dayDiff < 7) {
    score += 8; // Within a week
  } else if (dayDiff < 14) {
    score += 4; // Within two weeks
  }
  
  try {
    // Add ML-based text similarity (0-30 points)
    // Combine title and description for better context
    const lostText = `${lostItem.title} ${lostItem.description}`;
    const foundText = `${foundItem.title} ${foundItem.description}`;
    
    const textSimilarityScore = await getTextSimilarityScore(lostText, foundText);
    score += textSimilarityScore;
    
    // Add image similarity if both items have images (0-25 points)
    if (lostItem.image && foundItem.image) {
      const imageSimilarityScore = await getImageSimilarityScore(lostItem.image, foundItem.image);
      score += imageSimilarityScore;
    }
    
    return score;
  } catch (error) {
    console.error("Error calculating ML-based match score:", error);
    return score; // Return the basic score if ML fails
  }
}
