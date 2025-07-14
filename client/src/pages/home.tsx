import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Flame, Plus, Crown, Shuffle, Users, Search, TrendingUp, Eye } from "lucide-react";
import PersonCard from "@/components/person-card";
import AddPersonModal from "@/components/add-person-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Person } from "@shared/schema";

const categories = [
  { id: "الكل", label: "الكل", icon: Flame },
  { id: "دكاترة", label: "دكاترة", icon: Users },
  { id: "طلبة", label: "طلبة", icon: Users },
  { id: "موظفين", label: "موظفين", icon: Users },
  { id: "مشاهير", label: "مشاهير", icon: Crown },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: people = [], isLoading } = useQuery<Person[]>({
    queryKey: ["/api/people", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "الكل" 
        ? "/api/people"
        : `/api/people?category=${encodeURIComponent(selectedCategory)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch people");
      return response.json();
    },
  });

  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery<Person[]>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) throw new Error("Failed to search");
      return response.json();
    },
    enabled: searchQuery.trim().length >= 2,
  });

  const { data: topPeople = [] } = useQuery<Person[]>({
    queryKey: ["/api/people/top/3"],
  });

  const { data: siteStats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const displayedPeople = searchQuery.trim().length >= 2 ? searchResults : people;
  const isDisplayLoading = searchQuery.trim().length >= 2 ? isSearchLoading : isLoading;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--cyber-black)]/80 backdrop-blur-lg border-b border-[var(--neon-green)]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-pink)] rounded-lg flex items-center justify-center">
              <Flame className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black neon-text text-[var(--neon-green)]">وشك بكام؟</h1>
              <p className="text-xs text-gray-400">FaceScore - تقيّمني؟! دورك جيه!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="cyber-button-pink animate-pulse-neon px-4 py-2 rounded-lg font-bold text-sm"
            >
              <Plus className="ml-2 h-4 w-4" />
              ضيف وش
            </Button>
            <Link href="/facemash">
              <Button variant="ghost" className="bg-[var(--cyber-gray)] hover:bg-[var(--neon-blue)]/20 p-2 rounded-lg">
                <Crown className="text-[var(--neon-blue)]" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-green)]/10 to-[var(--neon-pink)]/10 animate-pulse"></div>
        <div className="relative z-10 container mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6 neon-text">
            <span className="text-[var(--neon-green)]">المنصة</span>
            <span className="text-[var(--neon-pink)]"> اللي كل وش</span>
            <span className="text-[var(--neon-blue)]"> فيها له تمن</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            تقدر تضيف أي حد تعرفه وتخلي الناس تقيّمه وتعلق عليه... مجهول طبعاً 😏
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="cyber-button px-8 py-4 rounded-xl font-bold text-lg"
            >
              <Flame className="ml-2 h-5 w-5" />
              يلا نبدأ الفضايح
            </Button>
            <Link href="/facemash">
              <Button 
                variant="outline" 
                className="border-2 border-[var(--neon-pink)] text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-white px-8 py-4 rounded-xl font-bold text-lg"
              >
                <Shuffle className="ml-2 h-5 w-5" />
                FaceMash Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 py-6">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="دور على أي حد... اسم، وصف، أو فئة"
              className="w-full bg-[var(--cyber-purple)]/50 border-2 border-[var(--neon-green)]/30 text-white placeholder-gray-400 pr-12 pl-4 py-4 rounded-2xl text-lg focus:border-[var(--neon-green)] transition-all duration-300"
            />
          </div>
          {searchQuery.trim().length >= 2 && (
            <p className="text-center text-gray-400 mt-2 text-sm">
              {isSearchLoading ? "جاري البحث..." : `${searchResults.length} نتيجة للبحث عن "${searchQuery}"`}
            </p>
          )}
        </div>
      </section>

      {/* Filter Tabs - Hidden when searching */}
      {searchQuery.trim().length < 2 && (
        <section className="px-4 py-6">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "cyber-button text-black"
                        : "bg-[var(--cyber-gray)] hover:bg-[var(--neon-blue)]/20 text-white"
                    }`}
                  >
                    <IconComponent className="ml-2 h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Top Ranked Section - Hidden when searching */}
      {topPeople.length > 0 && searchQuery.trim().length < 2 && (
        <section className="px-4 py-8">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black mb-2 neon-text text-[var(--neon-green)]">
                <Crown className="inline ml-3 h-8 w-8" />
                وش الأسبوع
              </h3>
              <p className="text-gray-400">الناس اللي الكل بيحبها... أو العكس 😈</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topPeople.slice(0, 3).map((person, index) => (
                <PersonCard 
                  key={person.id} 
                  person={person} 
                  isTopRated={index === 0}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* People Grid */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black neon-text text-[var(--neon-pink)]">
              {searchQuery.trim().length >= 2 ? (
                <>
                  <Search className="inline ml-3 h-6 w-6" />
                  نتائج البحث
                </>
              ) : (
                <>
                  <Users className="inline ml-3 h-6 w-6" />
                  كل الوشوش
                </>
              )}
            </h3>
            {searchQuery.trim().length >= 2 && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                مسح البحث
              </Button>
            )}
          </div>

          {isDisplayLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[var(--cyber-gray)]/30 rounded-2xl p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded mb-3"></div>
                  <div className="h-6 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayedPeople.length === 0 ? (
            <div className="text-center py-16">
              {searchQuery.trim().length >= 2 ? (
                <>
                  <h4 className="text-2xl font-bold text-gray-400 mb-4">مفيش نتائج للبحث ده</h4>
                  <p className="text-gray-500 mb-8">جرب تدور بكلمات تانية أو ضيف الشخص ده بنفسك</p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="cyber-button px-8 py-4 rounded-xl font-bold text-lg"
                  >
                    <Plus className="ml-2 h-5 w-5" />
                    ضيف الشخص ده
                  </Button>
                </>
              ) : (
                <>
                  <h4 className="text-2xl font-bold text-gray-400 mb-4">مفيش وشوش في الفئة دي</h4>
                  <p className="text-gray-500 mb-8">كن أول واحد يضيف شخص في فئة {selectedCategory}</p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="cyber-button px-8 py-4 rounded-xl font-bold text-lg"
                  >
                    <Plus className="ml-2 h-5 w-5" />
                    ضيف أول وش
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-3">
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 cyber-button rounded-full shadow-2xl text-xl hover:scale-110 transition-all duration-300 animate-pulse-neon"
        >
          <Plus />
        </Button>
        
        <Link href="/facemash">
          <Button className="w-14 h-14 cyber-button-pink rounded-full shadow-2xl text-xl hover:scale-110 transition-all duration-300">
            <Shuffle />
          </Button>
        </Link>
        
        <Button className="w-14 h-14 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-green)] rounded-full shadow-2xl text-xl hover:scale-110 transition-all duration-300">
          <Crown />
        </Button>
      </div>

      {/* Site Stats Section */}
      {siteStats && searchQuery.trim().length < 2 && (
        <section className="px-4 py-16 bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--cyber-black)]">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black mb-2 neon-text text-[var(--neon-blue)]">
                <TrendingUp className="inline ml-3 h-8 w-8" />
                إحصائيات الإمبراطورية
              </h3>
              <p className="text-gray-400">شوف المنصة وصلت لإيه!</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-green)]/20">
                <div className="text-3xl font-black text-[var(--neon-green)] mb-2">
                  {siteStats.totalPeople}
                </div>
                <div className="text-sm text-gray-400">وشوش مضافة</div>
              </div>
              
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-pink)]/20">
                <div className="text-3xl font-black text-[var(--neon-pink)] mb-2">
                  {siteStats.totalRatings}
                </div>
                <div className="text-sm text-gray-400">تقييم</div>
              </div>
              
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-blue)]/20">
                <div className="text-3xl font-black text-[var(--neon-blue)] mb-2">
                  {siteStats.totalComments}
                </div>
                <div className="text-sm text-gray-400">تعليق</div>
              </div>
              
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-green)]/20">
                <div className="text-3xl font-black text-[var(--neon-green)] mb-2">
                  {siteStats.totalFacemashVotes}
                </div>
                <div className="text-sm text-gray-400">معارك</div>
              </div>
              
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-pink)]/20">
                <div className="text-3xl font-black text-[var(--neon-pink)] mb-2">
                  {siteStats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">متوسط التقييم</div>
              </div>
              
              <div className="bg-[var(--cyber-gray)]/50 rounded-2xl p-6 text-center border border-[var(--neon-blue)]/20">
                <div className="text-xl font-black text-[var(--neon-blue)] mb-2">
                  {siteStats.topCategory}
                </div>
                <div className="text-sm text-gray-400">الفئة الأشهر</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[var(--cyber-black)] border-t border-[var(--neon-green)]/20 py-12 px-4 mt-16">
        <div className="container mx-auto text-center">
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-300">
              <span className="mr-2">⚠️</span>
              <strong>تنويه قانوني:</strong> هذا الموقع ترفيهي وساخر فقط. كل الآراء والتقييمات تعبر عن رأي أصحابها ولا تمثل إدارة الموقع.
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 space-x-reverse mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--neon-green)]">
                {siteStats?.totalPeople || 0}
              </div>
              <div className="text-xs text-gray-500">وشوش</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--neon-pink)]">
                {siteStats?.totalRatings || 0}
              </div>
              <div className="text-xs text-gray-500">تقييم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--neon-blue)]">
                {siteStats?.totalFacemashVotes || 0}
              </div>
              <div className="text-xs text-gray-500">معركة</div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2024 وشك بكام؟ - جميع الحقوق محفوظة للناس اللي عندها وش 😂
          </p>
        </div>
      </footer>

      <AddPersonModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}
