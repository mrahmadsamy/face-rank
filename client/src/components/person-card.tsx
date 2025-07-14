import { Link } from "wouter";
import { Star, MessageCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Person } from "@shared/schema";
import RatingDisplay from "./rating-display";
import { getRatingTitle } from "@/lib/rating-utils";

interface PersonCardProps {
  person: Person;
  isTopRated?: boolean;
  rank?: number;
}

export default function PersonCard({ person, isTopRated = false, rank }: PersonCardProps) {
  const ratingTitle = getRatingTitle(person.averageRating || 0);
  const timeAgo = new Date(person.createdAt).toLocaleDateString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/person/${person.id}`}>
      <Card className={`bg-[var(--cyber-gray)]/30 rounded-2xl p-6 text-center border transition-all duration-300 card-hover cursor-pointer ${
        isTopRated 
          ? "border-[var(--neon-green)]/50 hover:border-[var(--neon-green)]" 
          : "border-[var(--neon-green)]/20 hover:border-[var(--neon-green)]/50"
      }`}>
        {rank && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className={`px-4 py-2 rounded-full ${
              rank === 1 ? "bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)]" :
              rank === 2 ? "bg-[var(--neon-pink)]" :
              "bg-[var(--neon-blue)]"
            }`}>
              <span className="text-white font-bold">#{rank}</span>
            </div>
          </div>
        )}
        
        <img
          src={person.imageUrl}
          alt={person.name}
          className={`w-20 h-20 rounded-full mx-auto mb-4 object-cover ${
            isTopRated 
              ? "border-4 border-[var(--neon-green)]" 
              : "border-2 border-[var(--neon-green)]"
          }`}
        />
        
        <h4 className="font-bold text-lg mb-2 text-white">{person.name}</h4>
        <p className="text-sm text-gray-400 mb-3">{person.description}</p>
        
        <div className="flex justify-center items-center mb-3">
          <RatingDisplay rating={person.averageRating || 0} />
          <span className="mr-2 font-bold text-white">
            {person.averageRating?.toFixed(1) || "0.0"}
          </span>
        </div>
        
        <div 
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{
            backgroundColor: ratingTitle.color,
            color: ratingTitle.textColor || "white"
          }}
        >
          {ratingTitle.emoji} {ratingTitle.title}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span className="flex items-center">
            <MessageCircle className="ml-1 h-3 w-3" />
            {person.commentsCount || 0} تعليق
          </span>
          <span className="flex items-center">
            <Clock className="ml-1 h-3 w-3" />
            {timeAgo}
          </span>
        </div>
      </Card>
    </Link>
  );
}
