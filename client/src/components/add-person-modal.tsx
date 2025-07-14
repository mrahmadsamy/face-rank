import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Camera, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertPerson } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "دكاترة", label: "دكاترة" },
  { value: "طلبة", label: "طلبة" },
  { value: "موظفين", label: "موظفين" },
  { value: "مشاهير", label: "مشاهير" },
  { value: "آخرى", label: "آخرى" },
];

// Sample placeholder images for demo
const placeholderImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://pixabay.com/get/g8ded408dfc91057735824a5280e5cb13d52cb5e95d4c254323454e01e8495f75adc6db8205f00348062f6c9dc9756adf6f3166c515c7399ff55b53f8732bee8e_1280.jpg",
];

export default function AddPersonModal({ isOpen, onClose }: AddPersonModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addPersonMutation = useMutation({
    mutationFn: async (person: InsertPerson) => {
      const response = await apiRequest("POST", "/api/people", person);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      toast({
        title: "تم إضافة الشخص!",
        description: "الوش الجديد اتضاف بنجاح... خلي الناس تقيّمه 😈",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة الشخص",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      imageUrl: "",
    });
    setSelectedImageIndex(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "بيانات ناقصة",
        description: "املأ كل الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const imageUrl = formData.imageUrl || placeholderImages[selectedImageIndex];

    addPersonMutation.mutate({
      ...formData,
      imageUrl,
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  const handleClose = () => {
    if (!addPersonMutation.isPending) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[var(--cyber-gray)] border border-[var(--neon-green)]/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[var(--neon-green)] text-center mb-2">
            ضيف وش جديد
          </DialogTitle>
          <p className="text-gray-400 text-sm text-center">
            خلي الناس تقيّم وتفضح... مجهول طبعاً 😈
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Selection */}
          <div className="text-center">
            <Label className="block text-sm font-bold text-[var(--neon-green)] mb-2">
              اختار صورة للشخص
            </Label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {placeholderImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-full h-20 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                    selectedImageIndex === index
                      ? "border-[var(--neon-green)]"
                      : "border-gray-600 hover:border-[var(--neon-green)]/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Option ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Custom URL Input */}
            <div className="text-left">
              <Label className="block text-sm font-bold text-[var(--neon-green)] mb-2">
                أو ضع رابط صورة مخصوص
              </Label>
              <Input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-[var(--cyber-purple)] border border-[var(--neon-green)]/30 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <Label className="block text-sm font-bold text-[var(--neon-green)] mb-2">
              الاسم *
            </Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="اسم الشخص..."
              className="bg-[var(--cyber-purple)] border border-[var(--neon-green)]/30 text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <Label className="block text-sm font-bold text-[var(--neon-green)] mb-2">
              الوصف *
            </Label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="دكتور فيزياء، طالب قانون..."
              className="bg-[var(--cyber-purple)] border border-[var(--neon-green)]/30 text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <Label className="block text-sm font-bold text-[var(--neon-green)] mb-2">
              الفئة *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-[var(--cyber-purple)] border border-[var(--neon-green)]/30 text-white">
                <SelectValue placeholder="اختار الفئة" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--cyber-purple)] border border-[var(--neon-green)]/30">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-[var(--neon-green)]/20">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={addPersonMutation.isPending}
            className="w-full cyber-button py-4 rounded-xl font-bold text-lg"
          >
            {addPersonMutation.isPending ? "جاري الإضافة..." : "يلا نفضحه! 🔥"}
          </Button>

          {/* Close Button */}
          <Button
            type="button"
            onClick={handleClose}
            disabled={addPersonMutation.isPending}
            variant="ghost"
            className="w-full bg-[var(--cyber-gray)] hover:bg-red-600 py-3 rounded-xl font-bold"
          >
            إلغاء
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
