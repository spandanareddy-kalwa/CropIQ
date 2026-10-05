import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ShoppingCart,
  Plus,
  X
} from "lucide-react";

const categories = [
  { value: "discussion", label: "Discussion", icon: MessageCircle },
  { value: "question", label: "Question", icon: MessageCircle },
  { value: "tip", label: "Farming Tip", icon: MessageCircle },
  { value: "marketplace_sell", label: "Sell Product", icon: ShoppingCart },
  { value: "marketplace_buy", label: "Buy Request", icon: ShoppingCart },
  { value: "group_purchase", label: "Group Purchase", icon: ShoppingCart }
];

export default function CreatePostModal({ isOpen, onClose, onSubmit, user }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "discussion",
    crop_related: "",
    location: "",
    is_marketplace: false,
    marketplace_details: {
      price: "",
      quantity: "",
      unit: "",
      contact_info: ""
    },
    tags: [],
    images: []
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const postData = {
        ...formData,
        is_marketplace: formData.category.startsWith('marketplace') || formData.category === 'group_purchase',
        marketplace_details: formData.is_marketplace ? {
          ...formData.marketplace_details,
          price: formData.marketplace_details.price ? parseFloat(formData.marketplace_details.price) : null
        } : undefined
      };
      
      await onSubmit(postData);
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        category: "discussion", 
        crop_related: "",
        location: "",
        is_marketplace: false,
        marketplace_details: {
          price: "",
          quantity: "",
          unit: "",
          contact_info: ""
        },
        tags: [],
        images: []
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    if (field.startsWith('marketplace_details.')) {
      const subField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        marketplace_details: {
          ...prev.marketplace_details,
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Auto-set marketplace flag based on category
    if (field === 'category') {
      setFormData(prev => ({
        ...prev,
        is_marketplace: value.startsWith('marketplace') || value === 'group_purchase'
      }));
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedCategory && <selectedCategory.icon className="w-5 h-5 text-blue-600" />}
            Create New Post
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="What's your post about?"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Share your thoughts, questions, or experiences..."
              rows={4}
              required
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crop_related">Related Crop (optional)</Label>
              <Input
                id="crop_related"
                value={formData.crop_related}
                onChange={(e) => handleChange("crop_related", e.target.value)}
                placeholder="e.g., Corn, Wheat, Tomato"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Your region or farm location"
              />
            </div>
          </div>

          {/* Marketplace Details */}
          {formData.is_marketplace && (
            <div className="space-y-4 p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Marketplace Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.marketplace_details.price}
                    onChange={(e) => handleChange("marketplace_details.price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={formData.marketplace_details.quantity}
                    onChange={(e) => handleChange("marketplace_details.quantity", e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.marketplace_details.unit}
                    onValueChange={(value) => handleChange("marketplace_details.unit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="lbs">Pounds</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="crates">Crates</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input
                    id="contact"
                    value={formData.marketplace_details.contact_info}
                    onChange={(e) => handleChange("marketplace_details.contact_info", e.target.value)}
                    placeholder="Phone or email"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Posting..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
