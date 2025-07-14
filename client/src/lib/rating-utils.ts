export interface RatingTitle {
  title: string;
  emoji: string;
  color: string;
  textColor?: string;
}

export function getRatingTitle(rating: number): RatingTitle {
  if (rating >= 4.5) {
    return {
      title: "إمبراطور مطلق",
      emoji: "👑",
      color: "var(--neon-green)",
      textColor: "black"
    };
  } else if (rating >= 4) {
    return {
      title: "ملك الجامعة",
      emoji: "🏆",
      color: "var(--neon-green)",
      textColor: "black"
    };
  } else if (rating >= 3.5) {
    return {
      title: "جامد فشخ",
      emoji: "😎",
      color: "var(--neon-blue)",
      textColor: "white"
    };
  } else if (rating >= 3) {
    return {
      title: "جامد نص نص",
      emoji: "🙂",
      color: "var(--neon-blue)",
      textColor: "white"
    };
  } else if (rating >= 2.5) {
    return {
      title: "ماشي الحال",
      emoji: "😐",
      color: "#fbbf24", // yellow-400
      textColor: "white"
    };
  } else if (rating >= 2) {
    return {
      title: "ملوش لازمة",
      emoji: "😑",
      color: "#f59e0b", // yellow-500
      textColor: "white"
    };
  } else if (rating >= 1.5) {
    return {
      title: "فاشل",
      emoji: "😤",
      color: "#ef4444", // red-500
      textColor: "white"
    };
  } else if (rating >= 1) {
    return {
      title: "مهرج",
      emoji: "🤡",
      color: "#dc2626", // red-600
      textColor: "white"
    };
  } else if (rating > 0) {
    return {
      title: "خنزير",
      emoji: "🐷",
      color: "#991b1b", // red-800
      textColor: "white"
    };
  } else {
    return {
      title: "جديد",
      emoji: "❓",
      color: "#6b7280", // gray-500
      textColor: "white"
    };
  }
}
