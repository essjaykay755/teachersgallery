// Mock teacher data for the application
export interface DummyTeacher {
  id: string;
  name: string;
  subject: string;
  location: string;
  rating: number;
  reviewsCount: number;
  fee: string;
  avatarIndex: number;
  isVerified: boolean;
  tags: string[];
  date: string;
  color: string;
  featured?: boolean;
}

export const dummyTeachers: DummyTeacher[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    subject: "Mathematics",
    location: "Mumbai, Maharashtra",
    rating: 4.8,
    reviewsCount: 150,
    fee: "₹800/hr",
    avatarIndex: 1,
    isVerified: true,
    tags: ["Online", "10+ years", "High School", "IIT-JEE"],
    date: "20 May, 2023",
    color: "bg-blue-50",
    featured: true,
  },
  {
    id: "rajesh-kumar",
    name: "Rajesh Kumar",
    subject: "Physics",
    location: "Delhi, NCR",
    rating: 4.8,
    reviewsCount: 120,
    fee: "₹600/hr",
    avatarIndex: 2,
    isVerified: true,
    tags: ["Offline", "8 years", "CBSE", "NEET"],
    date: "4 Feb, 2023",
    color: "bg-green-50",
    featured: true,
  },
  {
    id: "anjali-desai",
    name: "Anjali Desai",
    subject: "English Literature",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    reviewsCount: 90,
    fee: "₹500/hr",
    avatarIndex: 3,
    isVerified: true,
    tags: ["Hybrid", "5 years", "ICSE", "Primary"],
    date: "29 Jan, 2023",
    color: "bg-purple-50",
  },
  {
    id: "debanjan-chakraborty",
    name: "Debanjan Chakraborty",
    subject: "Chemistry",
    location: "Salt Lake, Kolkata",
    rating: 4.8,
    reviewsCount: 110,
    fee: "₹650/hr",
    avatarIndex: 4,
    isVerified: true,
    tags: ["Offline", "12 years", "WBCHSE", "NEET"],
    date: "15 Mar, 2023",
    color: "bg-orange-50",
  },
  {
    id: "srabanti-mukherjee",
    name: "Srabanti Mukherjee",
    subject: "Bengali Literature",
    location: "Howrah, West Bengal",
    rating: 4.8,
    reviewsCount: 80,
    fee: "₹450/hr",
    avatarIndex: 5,
    isVerified: true,
    tags: ["Hybrid", "7 years", "WBBSE", "HS"],
    date: "8 Apr, 2023",
    color: "bg-pink-50",
  },
  {
    id: "soumitra-banerjee",
    name: "Soumitra Banerjee",
    subject: "Mathematics",
    location: "Barasat, West Bengal",
    rating: 4.8,
    reviewsCount: 130,
    fee: "₹550/hr",
    avatarIndex: 6,
    isVerified: true,
    tags: ["Online", "15 years", "WBCHSE", "JEE"],
    date: "12 Mar, 2023",
    color: "bg-indigo-50",
  },
  {
    id: "tanushree-das",
    name: "Tanushree Das",
    subject: "Physics",
    location: "Dum Dum, Kolkata",
    rating: 4.8,
    reviewsCount: 95,
    fee: "₹600/hr",
    avatarIndex: 7,
    isVerified: true,
    tags: ["Hybrid", "9 years", "WBCHSE", "NEET"],
    date: "25 Feb, 2023",
    color: "bg-rose-50",
  },
]; 