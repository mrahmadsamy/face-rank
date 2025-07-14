import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, MessageCircle, Users, Eye, Trophy, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import RatingDisplay from "@/components/rating-display";
import CommentsSection from "@/components/comments-section";
import { Person, InsertRating, InsertComment } from "@shared/schema";
import { getRatingTitle } from "@/lib/rating-utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PersonDetail() {
  const [, params] = useRoute("/person/:id");
  const personId = parseInt(params?.id || "0");
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: person, isLoading } = useQuery<Person>({
    queryKey: ["/api/people", personId],
    enabled: !!personId,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["/api/people", personId, "comments"],
    enabled: !!personId,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/people", personId, "stats"],
    enabled: !!personId,
  });

  const addRatingMutation = useMutation({
    mutationFn: async (rating: InsertRating) => {
      const response = await apiRequest("POST", "/api/ratings", rating);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      toast({
        title: "تم إضافة التقييم!",
        description: "شكراً لتقييمك الصادق 😈",
      });
      setUserRating(0);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة التقييم",
        variant: "destructive",
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (commentData: InsertComment) => {
      const response = await apiRequest("POST", "/api/comments", commentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people", personId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      toast({
        title: "تم إضافة التعليق!",
        description: "رأيك وصل للكل 🔥",
      });
      setComment("");
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة التعليق",
        variant: "destructive",
      });
    },
  });

  const handleRatingSubmit = () => {
    if (userRating > 0) {
      addRatingMutation.mutate({
        personId,
        rating: userRating,
      });
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      addCommentMutation.mutate({
        personId,
        content: comment.trim(),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-600 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">الشخص مش موجود</h1>
          <Link href="/">
            <Button className="cyber-button">
              <ArrowLeft className="ml-2 h-4 w-4" />
              ارجع للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ratingTitle = getRatingTitle(person.averageRating || 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--cyber-black)]/80 backdrop-blur-lg border-b border-[var(--neon-green)]/20">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold neon-text text-[var(--neon-green)]">تفاصيل الشخص</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Person Profile */}
          <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-green)]/20 p-8 mb-8">
            <div className="text-center">
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-[var(--neon-green)] object-cover"
              />
              <h2 className="text-3xl font-black mb-2 neon-text">{person.name}</h2>
              <p className="text-gray-400 mb-4">{person.description}</p>
              <div className="flex justify-center items-center mb-4">
                <RatingDisplay rating={person.averageRating || 0} />
                <span className="mr-3 font-bold text-xl">
                  {person.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className="inline-block px-6 py-2 rounded-full text-lg font-bold mb-6" style={{
                backgroundColor: ratingTitle.color,
                color: ratingTitle.textColor || "white"
              }}>
                {ratingTitle.emoji} {ratingTitle.title}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                <span className="flex items-center justify-center">
                  <Star className="ml-2 h-4 w-4" />
                  {person.ratingCount || 0} تقييم
                </span>
                <span className="flex items-center justify-center">
                  <MessageCircle className="ml-2 h-4 w-4" />
                  {person.commentsCount || 0} تعليق
                </span>
                <span className="flex items-center justify-center">
                  <Eye className="ml-2 h-4 w-4" />
                  {person.viewCount || 0} مشاهدة
                </span>
                <span className="flex items-center justify-center">
                  <Users className="ml-2 h-4 w-4" />
                  {person.category}
                </span>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-blue)]/20 p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--neon-blue)] flex items-center">
                  <Trophy className="ml-2 h-5 w-5" />
                  إحصائيات FaceMash
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">إجمالي المقارنات:</span>
                    <span className="font-bold text-white">{stats.totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">معدل الفوز:</span>
                    <span className="font-bold text-[var(--neon-green)]">{stats.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">المراتبة:</span>
                    <span className="font-bold text-[var(--neon-pink)]">
                      {stats.winRate >= 70 ? "نجم" : stats.winRate >= 50 ? "متوسط" : "ضعيف"}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-green)]/20 p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--neon-green)] flex items-center">
                  <TrendingUp className="ml-2 h-5 w-5" />
                  مؤشر الشعبية
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">فئة التقييم:</span>
                    <span className="font-bold" style={{ color: ratingTitle.color }}>
                      {ratingTitle.emoji} {ratingTitle.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">مستوى النشاط:</span>
                    <span className="font-bold text-white">
                      {(person.commentsCount || 0) > 10 ? "عالي" : 
                       (person.commentsCount || 0) > 5 ? "متوسط" : "منخفض"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">حالة التحقق:</span>
                    <span className="font-bold text-[var(--neon-blue)]">
                      {person.isVerified ? "✓ موثق" : "غير موثق"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Rating Section */}
          <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-pink)]/20 p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-[var(--neon-pink)]">قيّم الشخص ده</h3>
            <div className="flex justify-center items-center space-x-2 space-x-reverse mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`text-3xl transition-all duration-200 ${
                    star <= userRating 
                      ? "text-[var(--neon-green)]" 
                      : "text-gray-600 hover:text-[var(--neon-green)]"
                  }`}
                >
                  <Star className={star <= userRating ? "fill-current" : ""} />
                </button>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={handleRatingSubmit}
                disabled={userRating === 0 || addRatingMutation.isPending}
                className="cyber-button px-8 py-3 rounded-xl font-bold"
              >
                {addRatingMutation.isPending ? "جاري الإضافة..." : "أضف التقييم"}
              </Button>
            </div>
          </Card>

          {/* Comment Section */}
          <Card className="bg-[var(--cyber-gray)]/30 border border-[var(--neon-blue)]/20 p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-[var(--neon-blue)]">اكتب تعليق</h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك الصادق... مجهول طبعاً 😈"
              className="bg-[var(--cyber-purple)] border border-[var(--neon-blue)]/30 text-white placeholder-gray-400 mb-4"
              rows={4}
            />
            <Button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || addCommentMutation.isPending}
              className="cyber-button-pink px-8 py-3 rounded-xl font-bold"
            >
              {addCommentMutation.isPending ? "جاري الإضافة..." : "أضف التعليق"}
            </Button>
          </Card>

          {/* Comments List */}
          <CommentsSection comments={comments} />
        </div>
      </div>
    </div>
  );
}
