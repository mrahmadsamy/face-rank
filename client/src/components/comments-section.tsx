import { MessageCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Comment } from "@shared/schema";

interface CommentsSectionProps {
  comments: Comment[];
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
  if (comments.length === 0) {
    return (
      <Card className="bg-[var(--cyber-gray)]/30 border border-gray-600 p-8 text-center">
        <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">مفيش تعليقات لسه</h3>
        <p className="text-gray-500">كن أول واحد يعلق على الشخص ده</p>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-green)]/20 p-6">
      <h3 className="text-xl font-bold mb-6 text-[var(--neon-green)] flex items-center">
        <MessageCircle className="ml-2 h-5 w-5" />
        التعليقات ({comments.length})
      </h3>
      
      <div className="space-y-4">
        {comments.map((comment) => {
          const timeAgo = new Date(comment.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={comment.id}
              className="bg-[var(--cyber-purple)]/50 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[var(--neon-pink)]">مستخدم مجهول</span>
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="ml-1 h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
              <p className="text-gray-200">{comment.content}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
