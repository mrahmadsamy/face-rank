export interface RatingTitle {
  title: string;
  emoji: string;
  color: string;
  textColor?: string;
}

export function getRatingTitle(rating: number): RatingTitle {
  if (rating >= 4) {
    return {
      title: "إمبراطور",
      emoji: "👑",
      color: "var(--neon-green)",
      textColor: "black"
    };
  } else if (rating >= 3) {
    return {
      title: "جامد نص نص",
      emoji: "😎",
      color: "var(--neon-blue)",
      textColor: "white"
    };
  } else if (rating >= 2) {
    return {
      title: "ملوش لازمة",
      emoji: "😑",
      color: "#fbbf24", // yellow-400
      textColor: "white"
    };
  } else if (rating >= 1) {
    return {
      title: "مهرج",
      emoji: "🤡",
      color: "#ef4444", // red-500
      textColor: "white"
    };
  } else {
    return {
      title: "خنزير",
      emoji: "🐷",
      color: "#7f1d1d", // red-900
      textColor: "white"
    };
  }
}
