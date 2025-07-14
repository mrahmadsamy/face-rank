import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Flame, Heart, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Person, InsertFacemashVote } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FaceMash() {
  const [comparison, setComparison] = useState<[Person, Person] | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: randomPeople, isLoading, refetch } = useQuery<[Person, Person]>({
    queryKey: ["/api/facemash/random"],
    onSuccess: (data) => {
      setComparison(data);
    },
  });

  const { data: leaderboard = [] } = useQuery<Person[]>({
    queryKey: ["/api/facemash/leaderboard"],
  });

  const voteMutation = useMutation({
    mutationFn: async (vote: InsertFacemashVote) => {
      const response = await apiRequest("POST", "/api/facemash/vote", vote);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facemash/leaderboard"] });
      toast({
        title: "تم التصويت!",
        description: "صوتك اتسجل... هات المقارنة الجاية 🔥",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في التصويت",
        variant: "destructive",
      });
    },
  });

  const handleVote = (winnerId: number, loserId: number) => {
    voteMutation.mutate({ winnerId, loserId });
  };

  const handleSkip = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--neon-green)]"></div>
          <p className="mt-4 text-xl font-bold">جاري تحضير المقارنة...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold neon-text text-[var(--neon-pink)]">FaceMash Mode</h1>
        </div>
      </header>

      {/* FaceMash Comparison */}
      <section className="px-4 py-16 bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--cyber-black)]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-black mb-6 neon-text text-[var(--neon-pink)]">
            <Flame className="inline ml-3 h-10 w-10" />
            FaceMash Mode
          </h2>
          <p className="text-xl text-gray-300 mb-8">مين فيهم أروش؟ إختار وإفضح!</p>
          
          {randomPeople && randomPeople.length === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
              {/* Option A */}
              <Card className="bg-[var(--cyber-gray)]/50 rounded-3xl p-8 border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] cursor-pointer transition-all duration-300 transform hover:scale-105">
                <img
                  src={randomPeople[0].imageUrl}
                  alt={randomPeople[0].name}
                  className="w-48 h-48 rounded-2xl mx-auto mb-6 object-cover border-4 border-[var(--neon-green)]"
                />
                <h3 className="text-2xl font-bold text-[var(--neon-green)] mb-2">
                  {randomPeople[0].name}
                </h3>
                <p className="text-gray-400 mb-4">{randomPeople[0].description}</p>
                <Button
                  onClick={() => handleVote(randomPeople[0].id, randomPeople[1].id)}
                  disabled={voteMutation.isPending}
                  className="cyber-button px-6 py-3 rounded-full font-bold text-lg"
                >
                  أروش؟ 🔥
                </Button>
              </Card>

              {/* VS Divider */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--neon-pink)] text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 md:relative md:left-auto md:top-auto md:transform-none md:w-auto md:h-auto md:bg-transparent md:text-[var(--neon-pink)] md:text-6xl md:flex md:items-center md:justify-center">
                VS
              </div>

              {/* Option B */}
              <Card className="bg-[var(--cyber-gray)]/50 rounded-3xl p-8 border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] cursor-pointer transition-all duration-300 transform hover:scale-105">
                <img
                  src={randomPeople[1].imageUrl}
                  alt={randomPeople[1].name}
                  className="w-48 h-48 rounded-2xl mx-auto mb-6 object-cover border-4 border-[var(--neon-pink)]"
                />
                <h3 className="text-2xl font-bold text-[var(--neon-pink)] mb-2">
                  {randomPeople[1].name}
                </h3>
                <p className="text-gray-400 mb-4">{randomPeople[1].description}</p>
                <Button
                  onClick={() => handleVote(randomPeople[1].id, randomPeople[0].id)}
                  disabled={voteMutation.isPending}
                  className="cyber-button-pink px-6 py-3 rounded-full font-bold text-lg"
                >
                  أروش؟ 💕
                </Button>
              </Card>
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">مفيش ناس كفاية للمقارنة</h3>
              <p className="text-gray-500 mb-8">محتاجين على الأقل شخصين عشان نعمل مقارنة</p>
              <Link href="/">
                <Button className="cyber-button px-8 py-4 rounded-xl font-bold text-lg">
                  ارجع للصفحة الرئيسية
                </Button>
              </Link>
            </div>
          )}

          {randomPeople && (
            <div className="mt-12">
              <Button
                onClick={handleSkip}
                disabled={voteMutation.isPending}
                variant="ghost"
                className="bg-[var(--cyber-gray)] hover:bg-[var(--neon-blue)]/20 px-8 py-4 rounded-xl font-bold text-lg"
              >
                <Forward className="ml-2 h-5 w-5" />
                تخطي المقارنة دي
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <section className="px-4 py-16">
          <div className="container mx-auto">
            <h3 className="text-3xl font-black mb-8 text-center neon-text text-[var(--neon-blue)]">
              🏆 ترتيب FaceMash
            </h3>
            <div className="max-w-2xl mx-auto space-y-4">
              {leaderboard.slice(0, 10).map((person, index) => (
                <Card key={person.id} className={`bg-[var(--cyber-gray)]/30 border p-4 flex items-center ${
                  index === 0 ? "border-[var(--neon-green)]" : 
                  index === 1 ? "border-[var(--neon-pink)]" : 
                  index === 2 ? "border-[var(--neon-blue)]" : "border-gray-600"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                    index === 0 ? "bg-[var(--neon-green)] text-black" :
                    index === 1 ? "bg-[var(--neon-pink)] text-white" :
                    index === 2 ? "bg-[var(--neon-blue)] text-white" : "bg-gray-600 text-white"
                  }`}>
                    {index + 1}
                  </div>
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{person.name}</h4>
                    <p className="text-sm text-gray-400">{person.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {(person as any).score || 0}
                    </div>
                    <div className="text-xs text-gray-400">نقاط</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
