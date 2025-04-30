
import { LostItem, FoundItem } from "@/types";
import { calculateMLMatchScore } from "./mlMatching";

let useMLMatching = false;

/**
 * Enable or disable ML-based matching
 */
export function setUseMLMatching(enabled: boolean) {
  useMLMatching = enabled;
}

/**
 * Check if ML-based matching is enabled
 */
export function isMLMatchingEnabled(): boolean {
  return useMLMatching;
}

/**
 * Score a potential match between a lost and found item
 * A higher score indicates a better match
 */
export function calculateMatchScore(lostItem: LostItem, foundItem: FoundItem): number {
  let score = 0;
  
  // Category match (highest weight)
  if (lostItem.category === foundItem.category) {
    score += 30;
  }
  
  // Location match
  if (lostItem.location === foundItem.location) {
    score += 20;
  }
  
  // Date proximity (within a week is good, within a day is best)
  const lostDate = new Date(lostItem.date).getTime();
  const foundDate = new Date(foundItem.date).getTime();
  const dayDiff = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24);
  
  if (dayDiff < 1) {
    score += 20; // Same day
  } else if (dayDiff < 3) {
    score += 15; // Within 3 days
  } else if (dayDiff < 7) {
    score += 10; // Within a week
  } else if (dayDiff < 14) {
    score += 5; // Within two weeks
  }
  
  // Text similarity in title and description
  if (lostItem.title.toLowerCase().includes(foundItem.title.toLowerCase()) || 
      foundItem.title.toLowerCase().includes(lostItem.title.toLowerCase())) {
    score += 15;
  }
  
  // Check for keywords in descriptions
  const lostDesc = lostItem.description.toLowerCase();
  const foundDesc = foundItem.description.toLowerCase();
  
  // Extract common keywords from both descriptions
  const lostWords = lostDesc.split(/\s+/).filter(word => word.length > 3);
  const foundWords = foundDesc.split(/\s+/).filter(word => word.length > 3);
  
  // Count matching words
  const matchingWords = lostWords.filter(word => foundWords.some(fw => fw.includes(word) || word.includes(fw)));
  
  score += Math.min(matchingWords.length * 2, 15); // Cap at 15 points
  
  return score;
}

/**
 * Calculate confidence level based on match score
 */
export function getMatchConfidence(score: number): "high" | "medium" | "low" {
  // Adjust thresholds for ML-based matching which can score higher
  const highThreshold = useMLMatching ? 75 : 65;
  const mediumThreshold = useMLMatching ? 50 : 40;
  
  if (score >= highThreshold) {
    return "high";
  } else if (score >= mediumThreshold) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Get potential matches sorted by match score
 * Uses ML-based matching if enabled
 */
export async function getPotentialMatches(
  item: LostItem | FoundItem,
  items: (LostItem | FoundItem)[],
  minScore = 30
): Promise<{ item: LostItem | FoundItem; score: number; confidence: "high" | "medium" | "low" }[]> {
  // Filter items of the opposite type
  const oppositeItems = items.filter(i => {
    if (item.id.startsWith("lost")) {
      return i.id.startsWith("found");
    } else {
      return i.id.startsWith("lost");
    }
  });
  
  const matchPromises = oppositeItems.map(async (oppositeItem) => {
    let score = 0;
    
    if (useMLMatching) {
      if (item.id.startsWith("lost") && oppositeItem.id.startsWith("found")) {
        score = await calculateMLMatchScore(item as LostItem, oppositeItem as FoundItem);
      } else if (item.id.startsWith("found") && oppositeItem.id.startsWith("lost")) {
        score = await calculateMLMatchScore(oppositeItem as LostItem, item as FoundItem);
      }
    } else {
      if (item.id.startsWith("lost") && oppositeItem.id.startsWith("found")) {
        score = calculateMatchScore(item as LostItem, oppositeItem as FoundItem);
      } else if (item.id.startsWith("found") && oppositeItem.id.startsWith("lost")) {
        score = calculateMatchScore(oppositeItem as LostItem, item as FoundItem);
      }
    }
    
    return {
      item: oppositeItem,
      score,
      confidence: getMatchConfidence(score)
    };
  });
  
  const matches = await Promise.all(matchPromises);
  
  // Filter by minimum score and sort by score (highest first)
  return matches
    .filter(match => match.score >= minScore)
    .sort((a, b) => b.score - a.score);
}
