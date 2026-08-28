import React, { useState, useEffect, useRef } from "react";
import { 
  Wifi, 
  Coffee, 
  ParkingCircle, 
  Waves, 
  Wind, 
  Phone, 
  MapPin, 
  Star, 
  Menu, 
  X, 
  ChevronRight,
  ChevronLeft,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  Mail,
  User,
  RefreshCw,
  Plane,
  Coins,
  Globe,
  Settings,
  Check,
  Lock,
  Info,
  CalendarCheck,
  Plus,
  Trash2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import exact local image assets as uploaded by the user with actual casing
import imgHero from "./logo.jpg";
import imgPool15 from "./15.jpg";
import imgPool16 from "./16.jpg";
import imgPool17 from "./17.JPG";

import imgRoom8 from "./8.jpg";

// Simple Bungalows new images
import imgBungalow1 from "./Bungalow.JPG";
import imgBungalow2 from "./Bungalow..JPG";

// Chambre Familiale new images
import imgFamiliale1 from "./Familiale.JPG";
import imgFamiliale2 from "./Familiale..JPG";
import imgFamiliale3 from "./Familiale...JPG";

// Chambre Quintuple new images
import imgQuintuple1 from "./Chambre quintuple.JPG";
import imgQuintuple2 from "./Cambre quintuple...JPG";
import imgQuintuple3 from "./Chambre quintuple.....JPG";
import imgQuintuple4 from "./quintu.jpg";

// Chambre Etage new images
import imgEtageNew1 from "./PHOTO-2026-08-27-17-16-00.jpg";
import imgEtage2 from "./Etage..JPG";
import imgEtage3 from "./eta.JPG";

// Food / Restauration new images
import imgSteack from "./Steack.jpg";
import imgThiof from "./Thiof.jpg";
import imgSole from "./Sole.jpg";
import imgSaladeFruits from "./Salade de fruits.jpg";
import imgRestaurant from "./Restaurant.JPG";

// Robert et Mama
import imgRobertMama from "./Robert et Mama.jpg";

// Bar new image
import imgBarNew from "./Bar (1).JPG";

import imgInterior2 from "./2.jpg";
import imgInterior3 from "./3.JPG";
import imgInterior4 from "./4.JPG";
import imgInterior5 from "./5.jpeg";
import imgInterior6 from "./6.JPG";
import imgInterior7 from "./7.JPG";

import imgActivity18 from "./18.JPG";
import imgActivity13 from "./13.jpg";
import imgActivityDer from "./DER.jpg";

// Newly uploaded gallery photos
import imgGilbert from "./Gilbert.JPG";
import imgVueExterieure from "./Vue extérieure.JPG";
import imgVueEtage from "./Vue de l'étage.JPG";
import imgPresPiscine from "./Près de la piscine.JPG";
import imgTerrasseBar from "./Terrasse du bar.jpg";

// Interface for booking sync simulation
interface SyncReservation {
  id: string;
  roomName: string;
  source: "Booking.com" | "Direct Website" | "Airbnb";
  checkIn: string;
  checkOut: string;
  status: "Blocked" | "Pending" | "Confirmed";
  synchronizedAt: string;
}

// Elegant fallback helper for loaded or empty/corrupt image assets
function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackLabel 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  fallbackLabel?: string; 
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#2D2726] to-[#4a3e3d] text-center p-6 ${className || ""}`}>
        <div className="w-12 h-12 rounded-full border border-[#c5a880]/30 bg-white/5 flex items-center justify-center mb-3">
          <span className="text-luxury-gold font-display font-medium text-lg">C</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-[#E5D5C5] font-display font-medium px-4">
          {fallbackLabel || alt || "Le Chamama"}
        </p>
        <p className="text-[10px] text-gray-400 mt-1.5 italic font-light font-sans">
          Image en cours d'importation
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className || ""} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function App() {
  // Navigation & UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pool" | "interior" | "activities">("all");
  
  // Lightbox modal states for room images
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");
  
  // Custom states for room carousels
  const [carouselIndices, setCarouselIndices] = useState<{ [key: string]: number }>({
    bungalow_simple: 0,
    chambre_familiale: 0,
    bungalow_quintuple: 0,
    chambre_etage: 0
  });

  // Room booking item interface for Multi-Room reservations
  interface BookingRoomItem {
    id: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    arrivalTime: string;
    guests: string;
    childrenCount: string;
  }

  // Booking & Selection Form States (Supports multiple rooms)
  const [bookingRooms, setBookingRooms] = useState<BookingRoomItem[]>([
    {
      id: "room-1",
      roomType: "Bungalow 1,2 pers.",
      checkIn: "",
      checkOut: "",
      arrivalTime: "",
      guests: "2",
      childrenCount: "0"
    }
  ]);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    airportTransport: "Non",
    currencyExchange: "Non",
    exchangeAmount: "",
    exchangeCurrency: "EUR",
    specialRequests: ""
  });

  // Live Exchange Calculator state
  const [exchangeInput, setExchangeInput] = useState("100");
  const [exchangeCurrency, setExchangeCurrency] = useState("EUR");
  const [convertedValue, setConvertedValue] = useState(65595); // 100 EUR in CFA default

  // Booking.com Synchronization States
  const [bookingComIcalUrl, setBookingComIcalUrl] = useState("");
  const [isIcalConnected, setIsIcalConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCountdown, setSyncCountdown] = useState(1500); // 25-minute countdown in seconds
  const [syncHistory, setSyncHistory] = useState<string[]>([
    "[17:10:00] Système Channel Manager initialisé.",
    "[17:15:22] Synchronisation de sécurité active avec Booking.com iCal (Tous canaux libres)."
  ]);

  // List of active reservations / blocked dates
  const [syncedReservations, setSyncedReservations] = useState<SyncReservation[]>([
    {
      id: "BC-88912",
      roomName: "Bungalow 1 ou 2 personnes",
      source: "Booking.com",
      checkIn: "2026-06-15",
      checkOut: "2026-06-18",
      status: "Blocked",
      synchronizedAt: "Il y a 10 min"
    },
    {
      id: "AB-22104",
      roomName: "Bungalow \"Chambre Familiale\"",
      source: "Airbnb",
      checkIn: "2026-06-22",
      checkOut: "2026-06-25",
      status: "Blocked",
      synchronizedAt: "Il y a 22 min"
    }
  ]);

  // Toast notification for sync simulations
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const swipeStartRef = useRef<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Convert Devise Live Calculator
  useEffect(() => {
    const rawVal = parseFloat(exchangeInput);
    if (isNaN(rawVal)) {
      setConvertedValue(0);
      return;
    }
    if (exchangeCurrency === "EUR") {
      setConvertedValue(Math.round(rawVal * 655.957)); // Fixed CFA peg
    } else {
      setConvertedValue(Math.round(rawVal * 600)); // USD to CFA approx
    }
  }, [exchangeInput, exchangeCurrency]);

  // Calendar automatic sync countdown (Simulating the 20-30 min window)
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          // Trigger mock sync update
          const logMsg = `[${new Date().toLocaleTimeString()}] Synchronisation automatique iCal: Toutes les chambres ont été recalibrées avec l'API Booking.com.`;
          setSyncHistory(old => [logMsg, ...old.slice(0, 5)]);
          triggerToast("Mise à jour automatique: Calendrier synchronisé avec Booking.com.");
          return 1500; // Reset to 25 mins
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown seconds to MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle local sticky Nav
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate a Booking.com instant reservation trigger (blocks corresponding room)
  const simulateBookingComReservation = () => {
    setIsSyncing(true);
    triggerToast("Synchronisation initiée... Récupération du flux Booking.com XML/iCal.");
    
    setTimeout(() => {
      setIsSyncing(false);
      const newBooking: SyncReservation = {
        id: `BC-${Math.floor(10000 + Math.random() * 90000)}`,
        roomName: "Bungalow 1 ou 2 personnes",
        source: "Booking.com",
        checkIn: "2026-06-08",
        checkOut: "2026-06-12",
        status: "Blocked",
        synchronizedAt: "À l'instant"
      };

      setSyncedReservations(prev => [newBooking, ...prev]);
      
      const logMsg = `[${new Date().toLocaleTimeString()}] Booking.com: Réservation #${newBooking.id} récupérée. Chambre ${newBooking.roomName} bloquée du ${newBooking.checkIn} au ${newBooking.checkOut}.`;
      setSyncHistory(old => [logMsg, ...old.slice(0, 5)]);
      
      triggerToast("Succès: Chambre bloquée automatiquement sur le site grâce à l'iCal Booking.com !");
    }, 2000);
  };

  // Handle saving physical Booking.com iCal link
  const connectIcalLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingComIcalUrl) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsIcalConnected(true);
      const logMsg = `[${new Date().toLocaleTimeString()}] Adresse iCal de Booking.com enregistrée avec succès. Statut: CONNECTÉ.`;
      setSyncHistory(old => [logMsg, ...old.slice(0, 5)]);
      triggerToast("Calendrier Booking.com synchronisé avec succès !");
    }, 1500);
  };

  // Helper function to check if selected date range overlaps with any blocked or existing bookings on Booking.com / Airbnb / direct
  const checkOverlappingDates = (roomName: string, inDate: string, outDate: string) => {
    if (!inDate || !outDate) return false;
    const reqStart = new Date(inDate);
    const reqEnd = new Date(outDate);
    if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime()) || reqStart >= reqEnd) return false;

    return syncedReservations.some(res => {
      if (res.roomName !== roomName) return false;
      const resStart = new Date(res.checkIn);
      const resEnd = new Date(res.checkOut);
      // Overlap logic
      return reqStart < resEnd && reqEnd > resStart;
    });
  };

  // Robust local date parser (avoids timezone shifts)
  const parseLocalDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  };

  // Helper function to calculate stays
  const countNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 0;
    const start = parseLocalDate(inDate);
    const end = parseLocalDate(outDate);
    if (!start || !end) return 0;
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  const getEstimatedRate = (roomType: string, guestsStr: string): number => {
    let guestCount = 2;
    const parsed = parseInt(guestsStr, 10);
    if (!isNaN(parsed) && parsed > 0) {
      guestCount = parsed;
    }

    if (
      roomType.includes("Bungalow 1,2") || 
      roomType.includes("1 ou 2") || 
      (roomType.includes("Bungalow") && !roomType.includes("familiale") && !roomType.includes("3,4,5") && !roomType.includes("3, 4"))
    ) {
      return guestCount === 1 ? 24000 : 31000;
    } else if (roomType.includes("familiale") || roomType.includes("Familiale")) {
      return guestCount <= 3 ? 42000 : 49000;
    } else if (roomType.includes("3,4,5") || roomType.includes("3, 4 ou 5")) {
      if (guestCount <= 3) return 42000;
      if (guestCount === 4) return 49000;
      return 56000;
    } else if (roomType.includes("étage") || roomType.includes("etage")) {
      if (guestCount === 1) return 27000;
      if (guestCount === 2) return 38000;
      return 48000;
    }
    return 24000;
  };

  // Helper methods for multi-room booking
  const addBookingRoom = () => {
    const lastRoom = bookingRooms[bookingRooms.length - 1];
    const newRoom: BookingRoomItem = {
      id: `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      roomType: "Bungalow 1,2 pers.",
      checkIn: lastRoom?.checkIn || "",
      checkOut: lastRoom?.checkOut || "",
      arrivalTime: lastRoom?.arrivalTime || "",
      guests: "2",
      childrenCount: "0"
    };
    setBookingRooms(prev => [...prev, newRoom]);
  };

  const removeBookingRoom = (id: string) => {
    if (bookingRooms.length <= 1) return;
    setBookingRooms(prev => prev.filter(r => r.id !== id));
  };

  const updateBookingRoom = (id: string, field: keyof BookingRoomItem, value: string) => {
    setBookingRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Helper to check if Flash Discount (-20%) is applicable
  // Condition:
  // (a) La date d'arrivée sélectionnée est au moins 60 jours après la date du jour (diffDays >= 60)
  // (b) La réservation est faite avant le 31 octobre 2026 inclus (today <= 31 Oct 2026)
  const isFlashDiscountApplicable = (checkInStr: string): boolean => {
    if (!checkInStr) return false;
    
    // Normalize today's date at 00:00:00 local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Deadline: 31 October 2026 at 23:59:59 (Month 9 is October in 0-indexed JS)
    const deadline = new Date(2026, 9, 31, 23, 59, 59, 999);
    if (today.getTime() > deadline.getTime()) return false;

    const checkInDate = parseLocalDate(checkInStr);
    if (!checkInDate) return false;

    const diffDays = Math.round((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 60;
  };

  // Calculate detailed summary for all rooms combined
  const calculateBookingSummary = () => {
    let rawTotalPrice = 0;
    let anyRoomHasFlashPromo = false;

    const roomSummaries = bookingRooms.map((room, index) => {
      const nights = countNights(room.checkIn, room.checkOut);
      const rate = getEstimatedRate(room.roomType, room.guests);
      const roomTotal = nights > 0 ? rate * nights : 0;
      rawTotalPrice += roomTotal;
      const isPromo = isFlashDiscountApplicable(room.checkIn);
      if (isPromo) {
        anyRoomHasFlashPromo = true;
      }
      return {
        roomNumber: index + 1,
        room,
        nights,
        rate,
        roomTotal,
        hasFlashPromo: isPromo
      };
    });

    const isFlashDiscount = anyRoomHasFlashPromo && rawTotalPrice > 0;
    const discountAmount = isFlashDiscount ? Math.round(rawTotalPrice * 0.20) : 0;
    const finalTotalPrice = rawTotalPrice - discountAmount;

    return {
      roomSummaries,
      rawTotalPrice,
      isFlashDiscount,
      discountAmount,
      finalTotalPrice,
      anyRoomHasFlashPromo
    };
  };

  // Action for Flash Offer CTA banner button
  const openBookingWithFlashOffer = () => {
    const today = new Date();
    const dIn = new Date(today);
    dIn.setDate(today.getDate() + 65);
    const dOut = new Date(today);
    dOut.setDate(today.getDate() + 68);

    const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
    const checkInFormatted = `${dIn.getFullYear()}-${pad(dIn.getMonth() + 1)}-${pad(dIn.getDate())}`;
    const checkOutFormatted = `${dOut.getFullYear()}-${pad(dOut.getMonth() + 1)}-${pad(dOut.getDate())}`;

    setBookingRooms(prev => {
      if (prev.length === 0) {
        return [{
          id: "room-1",
          roomType: "Bungalow 1,2 pers.",
          checkIn: checkInFormatted,
          checkOut: checkOutFormatted,
          arrivalTime: "",
          guests: "2",
          childrenCount: "0"
        }];
      }
      // If current checkIn is empty or not yet 60 days ahead, pre-fill with a valid 65-day advance date
      if (!prev[0]?.checkIn || !isFlashDiscountApplicable(prev[0].checkIn)) {
        return prev.map((r, idx) => idx === 0 ? {
          ...r,
          checkIn: checkInFormatted,
          checkOut: checkOutFormatted
        } : r);
      }
      return prev;
    });
    setIsBookingOpen(true);
  };

  // Format booking submit to official hotel WhatsApp with Multi-Room & Flash Discount support
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { 
      name, phone, email, airportTransport, currencyExchange, exchangeAmount, exchangeCurrency, specialRequests 
    } = bookingForm;

    if (!name || !phone) {
      alert("Veuillez remplir votre nom complet et votre numéro WhatsApp.");
      return;
    }

    // Validate each room
    for (let i = 0; i < bookingRooms.length; i++) {
      const room = bookingRooms[i];
      if (!room.checkIn || !room.checkOut) {
        alert(`Veuillez sélectionner les dates d'arrivée et de départ pour la Chambre ${i + 1}.`);
        return;
      }
      const nights = countNights(room.checkIn, room.checkOut);
      if (nights <= 0) {
        alert(`La date de départ de la Chambre ${i + 1} doit être strictement ultérieure à la date d'arrivée.`);
        return;
      }
      if (checkOverlappingDates(room.roomType, room.checkIn, room.checkOut)) {
        alert(`⚠️ Désolé! La catégorie de chambre (${room.roomType}) pour la Chambre ${i + 1} est déjà occupée ou bloquée par l'intégration Booking.com pour les dates sélectionnées. Veuillez choisir une autre période.`);
        return;
      }
    }

    const summary = calculateBookingSummary();

    // Build perfect formatted message
    let messageText = `*DEMANDE DE RÉSERVATION - LE CHAMAMA*\n\n`;
    messageText += `👤 *Client:* ${name}\n`;
    messageText += `📞 *Téléphone:* ${phone}\n`;
    messageText += `✉️ *Email:* ${email || "Non communiqué"}\n\n`;
    
    messageText += `🏨 *HÉBERGEMENT (${bookingRooms.length} chambre${bookingRooms.length > 1 ? "s" : ""}):*\n`;
    summary.roomSummaries.forEach((rs) => {
      messageText += `\n• *Chambre ${rs.roomNumber}:* ${rs.room.roomType}\n`;
      messageText += `  📅 *Arrivée:* ${rs.room.checkIn} ${rs.room.arrivalTime ? `(Heure prévue: ${rs.room.arrivalTime})` : ""}\n`;
      messageText += `  📅 *Départ:* ${rs.room.checkOut}\n`;
      messageText += `  🌙 *Durée:* ${rs.nights} nuit(s)\n`;
      messageText += `  👥 *Voyageurs:* ${rs.room.guests} adulte(s) | ${rs.room.childrenCount} enfant(s)\n`;
      messageText += `  💰 *Sous-total hébergement:* ${rs.roomTotal.toLocaleString()} FCFA (${rs.rate.toLocaleString()} F/nuit)\n`;
    });

    messageText += `\n🚀 *Services Exclusifs demandés:*\n`;
    messageText += `✈️ *Navette Aéroport (Facturée en sus):* ${airportTransport} (30 000 FCFA / trajet 40km, 5 places)\n`;
    messageText += `💱 *Besoin de Change:* ${currencyExchange === "Oui" ? `Oui (${exchangeAmount} ${exchangeCurrency})` : "Non"}\n\n`;
    
    if (specialRequests) {
      messageText += `📝 *Demandes Spéciales:* ${specialRequests}\n\n`;
    }

    if (summary.isFlashDiscount) {
      messageText += `🎉 *Remise Flash Anticipée (-20%) appliquée !* (Réservation à 60+ jours d'avance jusqu'au 31 oct. 2026)\n`;
      messageText += `💳 *Prix initial :* ${summary.rawTotalPrice.toLocaleString()} FCFA\n`;
      messageText += `🎁 *Remise Flash (-20%) :* -${summary.discountAmount.toLocaleString()} FCFA\n`;
      messageText += `💳 *MONTANT TOTAL À PAYER :* ${summary.finalTotalPrice.toLocaleString()} FCFA (~${Math.round(summary.finalTotalPrice / 655.957)} €)\n\n`;
    } else {
      messageText += `💳 *MONTANT TOTAL À PAYER :* ${summary.finalTotalPrice.toLocaleString()} FCFA (~${Math.round(summary.finalTotalPrice / 655.957)} €)\n\n`;
    }
    
    messageText += `_Note: Vous ne versez aucun acompte au moment de la réservation. La totalité du séjour sera réglée à votre arrivée à l'hôtel._`;

    const encodedMessage = encodeURIComponent(messageText);
    // WhatsApp contact number: +221 77 102 23 86
    window.open(`https://wa.me/221771022386?text=${encodedMessage}`, "_blank");
    
    // Add the reservations locally
    bookingRooms.forEach((room, idx) => {
      const newReservation: SyncReservation = {
        id: `WEB-${Math.floor(10000 + Math.random() * 90000)}-${idx + 1}`,
        roomName: room.roomType,
        source: "Direct Website",
        checkIn: room.checkIn,
        checkOut: room.checkOut,
        status: "Blocked",
        synchronizedAt: "À l'instant"
      };
      setSyncedReservations(prev => [newReservation, ...prev]);
    });

    setIsBookingOpen(false);
  };

  // Room categories dataset with specific room image lists
  const ROOMS_DATA = [
    {
      id: "bungalow_simple",
      name: "Bungalow 1,2 pers.",
      subtitle: "Constructions typiques avec toit en paille",
      priceCFA: "24 000F / 31 000F",
      priceEUR: "37 / 47",
      capacity: "1 ou 2 Personnes",
      size: "18 m²",
      images: [imgRoom8, imgBungalow1, imgBungalow2],
      features: ["Lit double", "Climatisation & Télévision", "Salle de bain privée", "Toit en paille traditionnel"],
      description: "Chambre simple mais bien équipée, confortable et très reposante."
    },
    {
      id: "chambre_familiale",
      name: "Bungalow chambre familiale 3,4 pers",
      subtitle: "Constructions typiques avec toit en paille",
      priceCFA: "42 000F / 49 000F",
      priceEUR: "64 / 75",
      capacity: "3 ou 4 Personnes",
      size: "32 m²",
      images: [imgFamiliale1, imgFamiliale2, imgFamiliale3],
      features: ["1 très grand lit", "2 lits superposés", "1 lit bébé gratuit (<2 ans)", "Climatisation & Télévision"],
      description: "Grande chambre parfaitement adaptée aux familles avec un très grand lit et deux lits superposés + un lit bébé."
    },
    {
      id: "bungalow_quintuple",
      name: "Bungalow 3,4,5 pers",
      subtitle: "Constructions typiques avec toit en paille",
      priceCFA: "42 000F / 49 000F / 56 000F",
      priceEUR: "64 / 75 / 85",
      capacity: "3, 4 ou 5 Personnes",
      size: "32 m²",
      images: [imgQuintuple1, imgQuintuple2, imgQuintuple3, imgQuintuple4],
      features: ["Deux lits doubles", "Un lit simple", "Idéal pour groupes ou familles", "Climatisation & Télévision"],
      description: "Grande chambre chaleureuse équipée de deux lits doubles et un lit simple."
    },
    {
      id: "chambre_etage",
      name: "Chambre à l'étage 2,3 pers",
      subtitle: "Style classique et standing plus élevé",
      priceCFA: "27 000F / 38 000F / 48 000F",
      priceEUR: "41 / 58 / 73",
      capacity: "1, 2 ou 3 Personnes",
      size: "30 m²",
      images: [imgEtageNew1, imgEtage2, imgEtage3],
      features: ["Style plus classique", "Salle de bain et WC séparés", "un lit double + un lit simple", "Climatisation & Télévision"],
      description: "4 grandes chambres d'un style plus classique, d'un standing plus élevé, d'une dimension de 30m², à réserver pour 1, 2 ou 3 personnes. Mêmes équipements que les bungalows."
    }
  ];

  const handleCarouselNext = (id: string, maxLen: number) => {
    setCarouselIndices(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % maxLen
    }));
  };

  const handleCarouselPrev = (id: string, maxLen: number) => {
    setCarouselIndices(prev => ({
      ...prev,
      [id]: (prev[id] - 1 + maxLen) % maxLen
    }));
  };

  // Comprehensive image gallery (categorized)
  const GALLERY_DATA = [
    // Pool
    { type: "pool", src: imgPool15, title: "L'Espace Piscine" },
    { type: "pool", src: imgPool16, title: "Bord de l'Eau" },
    { type: "pool", src: imgPool17, title: "La Piscine au Crépuscule" },
    { type: "pool", src: imgPresPiscine, title: "Détente Près de la Piscine" },
    
    // Interiors, Bar & Cadre
    { type: "interior", src: imgInterior2, title: "Espace Détente" },
    { type: "interior", src: imgInterior3, title: "Séjour de l'Auberge" },
    { type: "interior", src: imgInterior4, title: "Espace d'Accueil" },
    { type: "interior", src: imgInterior5, title: "Ambiance Chaleureuse" },
    { type: "interior", src: imgInterior7, title: "La Décoration" },
    { type: "interior", src: imgBarNew, title: "Le Bar Convivial" },
    { type: "interior", src: imgTerrasseBar, title: "La Terrasse du Bar" },
    { type: "interior", src: imgVueExterieure, title: "Vue Extérieure de l'Auberge" },
    { type: "interior", src: imgVueEtage, title: "Vue Panoramique depuis l'Étage" },
    
    // Activities & Ambiance
    { type: "activities", src: imgGilbert, title: "L'Accueil & Ambiance au Chamama" },
    { type: "activities", src: imgActivity13, title: "Moments de Partage" },
    { type: "activities", src: imgActivity18, title: "Escapade & Découvertes" },
    { type: "activities", src: imgActivityDer, title: "Balades & Détente" }
  ];

  const filteredGallery = activeTab === "all" 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-[#FCFAF5] text-luxury-brand font-sans antialiased selection:bg-luxury-gold/50 selection:text-white">
      
      {/* Toast Alert Simulation */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[101] bg-[#4a3e3d]/95 backdrop-blur-md text-white border border-luxury-gold/30 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 text-sm md:text-base font-medium max-w-lg text-center"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[#eee]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exclusives Announcement Top Banner */}
      <div className="bg-luxury-brand text-luxury-gold text-xs font-display tracking-widest uppercase overflow-hidden py-3 px-4 flex justify-between items-center relative z-50 border-b border-luxury-gold/20">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          <span>✨ SERVICE RECOMMANDÉ: Navette Aéroport AIBD aller-retour directe disponible</span>
          <span className="hidden md:inline">|</span>
          <span>💼 BUREAU DE CHANGE SUR PLACE: Changez vos Euros & Dollars aux meilleurs tarifs</span>
          <span className="hidden md:inline">|</span>
          <span>📅 CANAL SYNCHRONISÉ: Calendriers temps réel Booking.com & Airbnb consolidés</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 divide-x divide-luxury-gold/30 pl-4 bg-luxury-brand">
          <a href="#services" className="pl-6 text-white text-[11px] font-semibold flex items-center gap-2 hover:text-luxury-gold transition-colors">
            <Coins className="w-3.5 h-3.5 text-luxury-gold" />
            Service Change Devises
          </a>
        </div>
      </div>

      {/* Floating Transparent/Light Header */}
      <header className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#E5D5C5]/20 py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-luxury-gold rounded-full flex items-center justify-center text-luxury-gold font-serif italic text-lg font-bold group-hover:bg-luxury-brand group-hover:text-white transition-all">
              C
            </div>
            <div className="flex flex-col">
              <span className={`text-xl lg:text-2xl font-display font-medium uppercase tracking-wider ${scrolled ? "text-luxury-brand" : "text-white"}`}>
                Le Chamama
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-gold font-bold">
                Auberge Hotel &bull; Lac Rose
              </span>
            </div>
          </a>

          {/* Large Screen Navigation Link List */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-display font-medium tracking-widest uppercase">
            <a href="#about" className={`transition-colors hover:text-luxury-gold ${scrolled ? "text-luxury-brand" : "text-white/90"}`}>L'Hôtel</a>
            <a href="#services" className={`transition-colors hover:text-luxury-gold ${scrolled ? "text-luxury-brand" : "text-white/90"}`}>Services Exclusifs</a>
            <a href="#sections" className={`transition-colors hover:text-luxury-gold ${scrolled ? "text-luxury-brand" : "text-white/90"}`}>Nos chambres</a>
            <a href="#gallery" className={`transition-colors hover:text-luxury-gold ${scrolled ? "text-luxury-brand" : "text-white/90"}`}>Galerie</a>
            <a href="#reviews" className={`transition-colors hover:text-luxury-gold ${scrolled ? "text-luxury-brand" : "text-white/90"}`}>Avis clients</a>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="https://wa.me/221771022386" 
              target="_blank" 
              rel="noreferrer"
              className={`border px-5 py-2.5 rounded-full text-xs font-display font-medium uppercase tracking-widest transition-all ${scrolled ? "border-luxury-brand/20 text-luxury-brand hover:bg-luxury-brand hover:text-white" : "border-white/20 text-white hover:bg-white hover:text-luxury-brand"}`}
            >
              WhatsApp Direct
            </a>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-luxury-gold text-white hover:bg-luxury-gold/90 transition-all font-display font-medium text-xs uppercase tracking-widest px-6 py-2.5 rounded-full"
            >
              Réserver en ligne
            </button>
          </div>

          <button 
            className="lg:hidden p-2 rounded-lg" 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className={`w-7 h-7 ${scrolled ? "text-luxury-brand" : "text-white"}`} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-luxury-brand z-50 p-8 flex flex-col justify-between shadow-2xl border-l border-luxury-gold/20"
          >
            <div>
              <div className="flex justify-between items-center pb-8 border-b border-luxury-gold/10">
                <div className="flex flex-col">
                  <span className="text-xl font-display font-bold text-white tracking-widest uppercase">Le Chamama</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#c5a880]">Auberge Hôtel</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 border border-white/10 rounded-full text-white hover:border-luxury-gold"
                  aria-label="Fermer le menu de navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-12 text-lg font-display tracking-widest uppercase">
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#c5a880] transition-colors">L'Hôtel</a>
                <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#c5a880] transition-colors">Services Exclusifs</a>
                <a href="#sections" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#c5a880] transition-colors">Hébergement</a>
                <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#c5a880] transition-colors">Galerie Photo</a>
                <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#c5a880] transition-colors">Témoignages</a>
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href="https://wa.me/221771022386"
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-medium tracking-wider uppercase text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Réservation
              </a>
              <button 
                onClick={() => { setIsBookingOpen(true); setIsMenuOpen(false); }}
                className="w-full bg-luxury-gold text-white py-4 rounded-xl font-medium tracking-wider uppercase text-xs hover:bg-[#b0926d] transition-all"
              >
                Réserver en Ligne
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Overlay Modal for direct customer requests */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-luxury-brand/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-2xl rounded-[1.8rem] shadow-2xl overflow-y-auto max-h-[90vh] border border-[#E5D5C5]/30"
            >
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5D5C5]/20">
                  <div>
                    <h2 className="text-2xl font-serif italic text-luxury-brand">Vérifier & Réserver</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Demande instantanée par WhatsApp Direct</p>
                  </div>
                  <button 
                    onClick={() => setIsBookingOpen(false)} 
                    className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors"
                    aria-label="Fermer la boîte de dialogue"
                  >
                    <X className="w-6 h-6 text-luxury-brand" />
                  </button>
                </div>
                
                <form className="space-y-5" onSubmit={handleBookingSubmit}>
                  
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 animate-fadeIn">
                      <label id="lbl-name" className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-luxury-gold" /> Nom Complet *
                      </label>
                      <input 
                        required
                        type="text" 
                        aria-labelledby="lbl-name"
                        placeholder="Ex: Seydina Cissé"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full bg-[#FCFAF5] border border-[#a38760]/20 rounded-xl p-3.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label id="lbl-phone" className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-luxury-gold" /> Numéro WhatsApp *
                      </label>
                      <input 
                        required
                        type="tel" 
                        aria-labelledby="lbl-phone"
                        placeholder="Ex: +221 77 123 45 67"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-[#FCFAF5] border border-[#a38760]/20 rounded-xl p-3.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-sm transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label id="lbl-email" className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-luxury-gold" /> Adresse E-mail (Recommandé)
                    </label>
                    <input 
                      type="email" 
                      aria-labelledby="lbl-email"
                      placeholder="Ex: client@hotel.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      className="w-full bg-[#FCFAF5] border border-[#a38760]/20 rounded-xl p-3.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-sm transition-all" 
                    />
                  </div>

                  {/* Check-in / Check-out Times Notice */}
                  <div className="bg-[#4a3e3d]/5 border border-luxury-gold/30 rounded-xl p-3 text-xs text-luxury-brand flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span className="font-bold">Horaires du séjour :</span>
                      <span>Arrivée à partir de 14h &mdash; Départ avant 12h</span>
                    </div>
                  </div>

                  {/* Multi-Room Booking Section */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-luxury-gold" />
                        <h3 className="text-xs font-display font-bold uppercase tracking-widest text-luxury-brand">
                          Hébergements ({bookingRooms.length} chambre{bookingRooms.length > 1 ? "s" : ""})
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#a39080] font-medium">
                        Ajoutez autant de chambres que nécessaire
                      </span>
                    </div>

                    <div className="space-y-4">
                      {bookingRooms.map((room, index) => {
                        const roomNights = countNights(room.checkIn, room.checkOut);
                        const roomRate = getEstimatedRate(room.roomType, room.guests);
                        const roomTotal = roomNights > 0 ? roomRate * roomNights : 0;
                        const isRoomPromo = isFlashDiscountApplicable(room.checkIn);
                        const isBlocked = checkOverlappingDates(room.roomType, room.checkIn, room.checkOut);

                        return (
                          <div 
                            key={room.id}
                            className="bg-[#FCFAF5] border border-luxury-gold/25 rounded-2xl p-4 md:p-5 space-y-4 relative transition-all"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-[#E5D5C5]/30">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-luxury-brand text-luxury-gold text-xs font-bold flex items-center justify-center font-display">
                                  {index + 1}
                                </span>
                                <span className="font-serif font-bold text-luxury-brand text-sm md:text-base">
                                  Chambre {index + 1}
                                </span>
                                {isRoomPromo && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                    Remise Flash 20%
                                  </span>
                                )}
                              </div>

                              {bookingRooms.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBookingRoom(room.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
                                  title="Supprimer cette chambre"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline text-[11px]">Supprimer</span>
                                </button>
                              )}
                            </div>

                            {/* Row 1: Dates & Arrival Time */}
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080] flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-luxury-gold" /> Dates (Arrivée & Départ) *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  <input 
                                    required
                                    type="date" 
                                    aria-label={`Date d'arrivée chambre ${index + 1}`}
                                    value={room.checkIn}
                                    onChange={(e) => updateBookingRoom(room.id, "checkIn", e.target.value)}
                                    className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-xs transition-all" 
                                  />
                                  <input 
                                    required
                                    type="date" 
                                    aria-label={`Date de départ chambre ${index + 1}`}
                                    value={room.checkOut}
                                    onChange={(e) => updateBookingRoom(room.id, "checkOut", e.target.value)}
                                    className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-xs transition-all" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-luxury-gold" /> Heure d'arrivée
                                </label>
                                <input 
                                  type="time" 
                                  aria-label={`Heure d'arrivée chambre ${index + 1}`}
                                  value={room.arrivalTime}
                                  onChange={(e) => updateBookingRoom(room.id, "arrivalTime", e.target.value)}
                                  className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-xs transition-all" 
                                />
                              </div>
                            </div>

                            {/* Row 2: Room Type, Adults, Children */}
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080]">
                                  Catégorie de Chambre *
                                </label>
                                <select 
                                  value={room.roomType}
                                  onChange={(e) => updateBookingRoom(room.id, "roomType", e.target.value)}
                                  className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 outline-none text-xs text-[#4a3e3d]"
                                >
                                  <option value="Bungalow 1,2 pers.">Bungalow 1,2 pers.</option>
                                  <option value="Bungalow chambre familiale 3,4 pers">Bungalow chambre familiale 3,4 pers</option>
                                  <option value="Bungalow 3,4,5 pers">Bungalow 3,4,5 pers</option>
                                  <option value="Chambre à l'étage 2,3 pers">Chambre à l'étage 2,3 pers</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080]">
                                  Adultes
                                </label>
                                <select 
                                  value={room.guests}
                                  onChange={(e) => updateBookingRoom(room.id, "guests", e.target.value)}
                                  className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 outline-none text-xs text-[#4a3e3d]"
                                >
                                  <option value="1">1 Adulte</option>
                                  <option value="2">2 Adultes</option>
                                  <option value="3">3 Adultes</option>
                                  <option value="4">4 Adultes (Groupe)</option>
                                  <option value="5">5 Adultes (Groupe)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080]">
                                  Enfants (-12 ans)
                                </label>
                                <select 
                                  value={room.childrenCount}
                                  onChange={(e) => updateBookingRoom(room.id, "childrenCount", e.target.value)}
                                  className="w-full bg-white border border-[#a38760]/20 rounded-xl p-2.5 outline-none text-xs text-[#4a3e3d]"
                                >
                                  <option value="0">Aucun</option>
                                  <option value="1">1 Enfant</option>
                                  <option value="2">2 Enfants</option>
                                  <option value="3">3 Enfants</option>
                                </select>
                              </div>
                            </div>

                            {/* Single room pricing & status footer */}
                            <div className="flex flex-wrap items-center justify-between pt-2 text-xs border-t border-[#E5D5C5]/20 text-[#4a3e3d]">
                              <span>
                                {roomNights > 0 ? (
                                  <span className="font-medium text-gray-600">
                                    {roomNights} nuit{roomNights > 1 ? "s" : ""} &times; {roomRate.toLocaleString()} FCFA/nuit
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px]">Choisissez les dates de cette chambre</span>
                                )}
                              </span>
                              <span className="font-bold text-luxury-brand font-display">
                                Sous-total : {roomTotal.toLocaleString()} FCFA
                              </span>
                            </div>

                            {isBlocked && (
                              <div className="bg-amber-100/90 text-amber-900 border border-amber-300 rounded-xl p-2.5 text-xs">
                                ⚠️ Cette catégorie de chambre est indisponible pour ces dates (synchronisation Booking.com/iCal).
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add another room button */}
                    <button
                      type="button"
                      onClick={addBookingRoom}
                      className="w-full py-3.5 px-4 border-2 border-dashed border-luxury-gold/40 hover:border-luxury-gold bg-luxury-gold/5 hover:bg-luxury-gold/10 text-luxury-brand rounded-2xl font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4 text-luxury-gold" />
                      Ajouter une autre chambre
                    </button>
                  </div>

                  {/* Specific Special Extras Requested by Hotel Owner */}
                  <div className="border-t border-[#E5D5C5]/20 pt-4 space-y-4">
                    <h4 className="text-xs font-display font-bold uppercase tracking-widest text-luxury-brand">Services optionnels du propriétaire</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Navette Aéroport */}
                      <div className="space-y-1.5 p-3.5 bg-luxury-gold/5 rounded-xl border border-luxury-gold/10">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-luxury-gold" />
                          <span className="text-xs font-bold text-luxury-brand uppercase font-display tracking-wider">Transfert Aéroport</span>
                        </div>
                        <p className="text-[11px] text-[#8a7a6e] mt-1 mb-2">
                          Tarif : 30 000 FCFA (~45€) — 40km (véhicule 5 places). Facturé en supplément.
                        </p>
                        <select 
                          value={bookingForm.airportTransport}
                          onChange={(e) => setBookingForm({...bookingForm, airportTransport: e.target.value})}
                          className="w-full bg-white border border-[#a38760]/20 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-luxury-gold outline-none"
                        >
                          <option value="Non">Non requis</option>
                          <option value="Oui, Aller uniquement">Oui, Aller uniquement</option>
                          <option value="Oui, Retour uniquement">Oui, Retour uniquement</option>
                          <option value="Oui, Aller & Retour">Oui, Aller & Retour (Complet)</option>
                        </select>
                      </div>

                      {/* Bureau de change rapide */}
                      <div className="space-y-1.5 p-3.5 bg-[#4a3e3d]/5 rounded-xl border border-[#4a3e3d]/10">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-luxury-gold" />
                          <span className="text-xs font-bold text-luxury-brand uppercase font-display tracking-wider">Change de Monnaie</span>
                        </div>
                        <p className="text-[11px] text-[#8a7a6e] mt-1 mb-2">Service de conversion disponible directement à la réception.</p>
                        <div className="flex gap-2">
                          <select 
                            value={bookingForm.currencyExchange}
                            onChange={(e) => setBookingForm({...bookingForm, currencyExchange: e.target.value})}
                            className="bg-white border border-[#a38760]/20 rounded-lg p-2.5 text-xs outline-none"
                          >
                            <option value="Non">Non</option>
                            <option value="Oui">Oui, je souhaite changer</option>
                          </select>
                          {bookingForm.currencyExchange === "Oui" && (
                            <input 
                              type="text" 
                              placeholder="Montant (ex: EUR/USD)"
                              value={bookingForm.exchangeAmount}
                              onChange={(e) => setBookingForm({...bookingForm, exchangeAmount: e.target.value})}
                              className="w-full bg-white border border-[#a38760]/20 rounded-lg p-2 text-xs focus:ring-1 focus:ring-luxury-gold outline-none"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label id="lbl-reqs" className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a39080]">Notes & demandes spécifiques</label>
                    <textarea 
                      aria-labelledby="lbl-reqs"
                      rows={3}
                      placeholder="Ex: Option lit bébé, heure d'arrivée tardive, végétarien..."
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                      className="w-full bg-[#FCFAF5] border border-[#a38760]/20 rounded-xl p-3.5 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 outline-none text-sm transition-all"
                    ></textarea>
                  </div>

                  {/* Summary and Calculation Box */}
                  {(() => {
                    const summary = calculateBookingSummary();
                    const anyBlocked = bookingRooms.some(r => checkOverlappingDates(r.roomType, r.checkIn, r.checkOut));

                    return (
                      <>
                        {/* Flash Discount Highlight Banner if applicable */}
                        {summary.isFlashDiscount && (
                          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-4 flex items-start gap-3 text-xs animate-fadeIn">
                            <span className="text-xl">🎉</span>
                            <div>
                              <strong className="text-emerald-900 text-sm block font-bold">
                                Remise Flash Anticipée (-20%) activée !
                              </strong>
                              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                                Votre réservation est effectuée au moins 60 jours avant la date d'arrivée. La réduction exceptionnelle de 20% a été appliquée sur l'ensemble de votre séjour ! (Offre valable jusqu'au 31 octobre 2026).
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="bg-[#FCFAF5] p-5 rounded-2xl border border-luxury-gold/25 space-y-4 text-left shadow-sm">
                          {/* Itemized rooms summary */}
                          <div className="space-y-2 border-b border-[#E5D5C5]/30 pb-3">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#a39080] block">
                              Détail du calcul ({bookingRooms.length} chambre{bookingRooms.length > 1 ? "s" : ""})
                            </span>
                            {summary.roomSummaries.map((rs) => (
                              <div key={rs.room.id} className="flex justify-between items-center text-xs text-[#4a3e3d]">
                                <span>
                                  Chambre {rs.roomNumber} ({rs.room.roomType})
                                  {rs.nights > 0 && (
                                    <span className="text-gray-500 text-[11px]"> &bull; {rs.nights} nuit{rs.nights > 1 ? "s" : ""}</span>
                                  )}
                                </span>
                                <span className="font-semibold text-luxury-brand">
                                  {rs.roomTotal.toLocaleString()} FCFA
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Pricing totals */}
                          <div className="space-y-2">
                            {summary.isFlashDiscount ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
                                  <span>Prix initial :</span>
                                  <span className="line-through font-semibold">{summary.rawTotalPrice.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs md:text-sm text-emerald-700 font-bold">
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Remise Flash (-20%) :
                                  </span>
                                  <span>-{summary.discountAmount.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-luxury-brand text-sm md:text-base pt-2 border-t border-luxury-gold/20">
                                  <span>Montant total à payer :</span>
                                  <div className="text-right">
                                    <span className="text-luxury-gold font-display text-lg md:text-xl block">
                                      {summary.finalTotalPrice.toLocaleString()} FCFA
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      (~{Math.round(summary.finalTotalPrice / 655.957)} €)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center font-bold text-luxury-brand text-sm md:text-base">
                                <span>Montant total à payer :</span>
                                <div className="text-right">
                                  <span className="text-luxury-gold font-display text-lg md:text-xl block">
                                    {summary.finalTotalPrice.toLocaleString()} FCFA
                                  </span>
                                  {summary.finalTotalPrice > 0 && (
                                    <span className="text-xs text-gray-500 font-normal">
                                      (~{Math.round(summary.finalTotalPrice / 655.957)} €)
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between text-xs text-[#4a3e3d] pt-1 gap-1 font-medium border-t border-[#E5D5C5]/30">
                            <span className="text-gray-600 font-semibold">Modes de paiement acceptés :</span>
                            <span className="font-bold text-luxury-brand">Carte bancaire, Euro ou monnaie locale</span>
                          </div>

                          <div className="text-xs md:text-sm text-[#2D2726] leading-relaxed space-y-2 pt-2 border-t border-dashed border-[#E5D5C5]/40 font-normal">
                            <p className="font-bold text-luxury-brand bg-luxury-gold/10 p-3 rounded-lg border-l-4 border-luxury-gold">
                              Vous ne versez aucun acompte au moment de la réservation. La totalité du séjour sera réglée à votre arrivée à l'hôtel !
                            </p>
                            <p className="text-gray-600 text-xs">
                              Paiement accepté en FCFA, euros ou par carte bancaire.
                            </p>
                            <p className="italic text-luxury-gold font-semibold text-xs">
                              PS : Si annulation, merci de nous prévenir rapidement.
                            </p>
                          </div>
                          <p className="text-gray-500 font-medium text-xs pt-1">
                            Le transfert aéroport et le change de devises seront confirmés directement avec notre réception.
                          </p>
                        </div>

                        {anyBlocked && (
                          <div className="bg-[#4a3e3d] border border-luxury-gold/30 text-white rounded-xl p-4 flex gap-3 text-xs leading-relaxed animate-fadeIn">
                            <span className="text-luxury-gold text-lg">⚠️</span>
                            <div className="space-y-1 text-left">
                              <p className="font-bold uppercase tracking-wider text-[10px] text-luxury-gold">Chambre indisponible (iCal Sync)</p>
                              <p className="text-gray-300">Au moins une chambre sélectionnée est occupée pour ces dates en raison d'une réservation Booking.com ou en direct. Veuillez ajuster les dates.</p>
                            </div>
                          </div>
                        )}

                        {anyBlocked ? (
                          <button 
                            type="button"
                            disabled
                            className="w-full bg-[#E5D5C5]/10 text-gray-400 py-4 rounded-xl font-bold font-display text-sm uppercase tracking-widest cursor-not-allowed border border-dashed border-gray-400/20"
                          >
                            Dates Indisponibles (Vérifier Sync)
                          </button>
                        ) : (
                          <button 
                            type="submit"
                            className="w-full bg-luxury-brand text-luxury-gold py-4 rounded-xl font-bold font-display text-sm uppercase tracking-widest hover:bg-luxury-brand/90 hover:text-white transition-all transform duration-150 shadow-lg"
                          >
                            Confirmer & Ouvrir WhatsApp Direct
                          </button>
                        )}
                      </>
                    );
                  })()}
                  
                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                    <Lock className="w-3.5 h-3.5 text-green-500" />
                    <span>Synchronisation iCal Sécurisée active. Aucun frais additionnel en direct.</span>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section Master Stage with dynamic background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-luxury-brand">
        <div className="absolute inset-0 z-0 w-full h-full">
          <SafeImage 
            src={imgHero} 
            alt="Le Chamama" 
            className="w-full h-full object-cover brightness-[0.45] scale-100 transition-transform duration-10000 ease-out"
            fallbackLabel="Auberge Le Chamama"
          />
        </div>
        
        {/* Welcoming brand elements */}
        <div className="relative z-10 text-center text-white px-6 w-full max-w-5xl flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 px-4 py-1 border border-luxury-gold/30 rounded-full bg-white/5 backdrop-blur-md"
          >
            <p className="uppercase tracking-[0.25em] text-[10px] md:text-xs text-luxury-gold font-semibold font-display">
              Hôtel Le Chamama &bull; Niaga Peulh
            </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-7xl font-serif tracking-tight text-white leading-tight uppercase my-4 font-bold"
          >
            L'ÉVASION ET LE CONFORT <br /> DANS UN CADRE AFRICAIN
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-200 md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed"
          >
            Découvrez le charme et l'ambiance conviviale de l'hôtel. Prise en charge rapide et efficace dès votre arrivée. Staff soucieux de votre bien-être et toujours à l'écoute.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
          >
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-luxury-gold text-white font-display uppercase tracking-widest text-xs font-semibold px-8 py-4 sm:py-5 rounded-full hover:bg-white hover:text-luxury-brand transition-all shadow-xl w-full sm:w-auto"
            >
              Calculer votre séjour
            </button>
            <a 
              href="#sections"
              className="border border-white/20 hover:border-luxury-gold hover:text-luxury-gold bg-black/10 backdrop-blur-md text-white font-display uppercase tracking-widest text-xs px-8 py-4 sm:py-5 rounded-full transition-all w-full sm:w-auto"
            >
              Découvrir nos hébergements
            </a>
          </motion.div>
        </div>

        {/* Dynamic Horizontal Reservation Bar at the Base of Hero */}
        <div className="absolute bottom-12 left-0 right-0 z-20 px-6 hidden md:block">
          <div className="max-w-5xl mx-auto bg-luxury-brand/90 backdrop-blur-lg border border-luxury-gold/25 rounded-2xl p-6 shadow-2xl flex items-center justify-between gap-4">
            
            <div className="flex-1 grid grid-cols-4 gap-4 divide-x divide-luxury-gold/20 text-white">
              
              <div className="pl-2 space-y-1">
                <span className="text-[10px] uppercase font-display tracking-widest text-[#a39080] font-bold block">Arrivée</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-luxury-gold" />
                  <input 
                    type="date" 
                    value={bookingRooms[0]?.checkIn || ""}
                    onChange={(e) => updateBookingRoom(bookingRooms[0]?.id || "room-1", "checkIn", e.target.value)}
                    aria-label="Sélectionner la date d'arrivée"
                    className="bg-transparent border-none text-white text-xs outline-none focus:ring-0 w-full"
                  />
                </div>
              </div>

              <div className="pl-4 space-y-1">
                <span className="text-[10px] uppercase font-display tracking-widest text-[#a39080] font-bold block">Départ</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-luxury-gold" />
                  <input 
                    type="date" 
                    value={bookingRooms[0]?.checkOut || ""}
                    onChange={(e) => updateBookingRoom(bookingRooms[0]?.id || "room-1", "checkOut", e.target.value)}
                    aria-label="Sélectionner la date de départ"
                    className="bg-transparent border-none text-white text-xs outline-none focus:ring-0 w-full"
                  />
                </div>
              </div>

              <div className="pl-4 space-y-1">
                <span className="text-[10px] uppercase font-display tracking-widest text-[#a39080] font-bold block">Voyageurs</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-luxury-gold" />
                  <select 
                    value={bookingRooms[0]?.guests || "2"}
                    onChange={(e) => updateBookingRoom(bookingRooms[0]?.id || "room-1", "guests", e.target.value)}
                    aria-label="Sélectionner le nombre d'adultes"
                    className="bg-transparent border-none text-white text-xs outline-none cursor-pointer focus:ring-0 w-full"
                  >
                    <option value="1" className="bg-[#2d2726]">1 Adulte</option>
                    <option value="2" className="bg-[#2d2726]">2 Adultes</option>
                    <option value="3" className="bg-[#2d2726]">3 Adultes</option>
                    <option value="4" className="bg-[#2d2726]">4 Adultes</option>
                  </select>
                </div>
              </div>

              <div className="pl-4 space-y-1">
                <span className="text-[10px] uppercase font-display tracking-widest text-[#a39080] font-bold block">Logement</span>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-luxury-gold" />
                  <select 
                    value={bookingRooms[0]?.roomType || "Bungalow 1,2 pers."}
                    onChange={(e) => updateBookingRoom(bookingRooms[0]?.id || "room-1", "roomType", e.target.value)}
                    aria-label="Sélectionner le type de chambre"
                    className="bg-transparent border-none text-white text-xs outline-none cursor-pointer focus:ring-0 w-full"
                  >
                    <option value="Bungalow 1,2 pers." className="bg-[#2d2726]">Bungalow 1,2 pers.</option>
                    <option value="Bungalow chambre familiale 3,4 pers" className="bg-[#2d2726]">Bungalow chambre familiale 3,4 pers</option>
                    <option value="Bungalow 3,4,5 pers" className="bg-[#2d2726]">Bungalow 3,4,5 pers</option>
                    <option value="Chambre à l'étage 2,3 pers" className="bg-[#2d2726]">Chambre à l'étage 2,3 pers</option>
                  </select>
                </div>
              </div>

            </div>

            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-luxury-gold text-white hover:bg-white hover:text-luxury-brand px-8 py-4 rounded-xl font-display uppercase tracking-widest text-xs font-bold transition-all shrink-0"
            >
              Vérifier
            </button>

          </div>
        </div>
      </section>

      {/* About Section - Introducing the Hotel owner services */}
      <section id="about" className="py-28 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-102">
                <SafeImage src={imgInterior2} alt="Intérieur Le Chamama" className="w-full h-full object-cover" fallbackLabel="Intérieurs" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-102">
                <SafeImage src={imgInterior3} alt="Restaurant Le Chamama" className="w-full h-full object-cover" fallbackLabel="Restaurant" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-102 font-serif">
                <SafeImage src={imgInterior5} alt="Objets typiques" className="w-full h-full object-cover" fallbackLabel="Décoration" />
              </div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-102">
                <SafeImage src={imgInterior7} alt="Deco" className="w-full h-full object-cover" fallbackLabel="Artisanat d'art" />
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 left-1/4 bg-luxury-brand text-white border border-[#c5a880]/30 rounded-2xl p-6 max-w-xs shadow-2xl">
            <p className="font-serif italic text-luxury-gold text-lg">"Robert et Mama vous font vivre le Sénégal authentique."</p>
            <span className="text-[10px] uppercase font-display tracking-widest text-gray-300 block mt-3 font-semibold">&mdash; Accueil Le Chamama</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">Un Accueil Chaleureux</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-brand font-normal tracking-tight">
              Bienvenue chez <span className="italic block mt-1">Robert, Mama & toute l'équipe</span>
            </h2>
          </div>

          <div className="bg-luxury-gold/10 border-l-4 border-luxury-gold p-4 rounded-r-2xl my-4">
            <p className="font-bold text-luxury-brand text-sm md:text-base leading-relaxed">
              Vous ne versez aucun acompte au moment de la réservation. La totalité du séjour sera réglée à votre arrivée à l'hôtel !
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm md:text-base font-light font-sans">
            Niché dans le petit village de Niaga Peulh et à proximité du lac rose, l'hôtel ''Le CHAMAMA'' est un concept pensé pour le confort, le repos et la convivialité. Venez profiter d'un hébergement parfaitement équipé, vous détendre dans la piscine ou profiter du billard et du jeu de fléchettes. Wifi gratuite sur tout l'espace de l'hôtel. Cuisine locale ou européenne. Bar.
          </p>

          <p className="text-gray-600 leading-relaxed text-sm md:text-base font-light font-sans">
            Nous ne nous limitons pas seulement à gérer votre bien-être à l'hôtel. Vous conseiller et planifier vos activités, réserver un 4x4 ou un quad, requérir un taxi ou un bus fait partie de nos services. Nous pouvons également vous réserver des tickets de bus ou de bateau pour votre prochaine étape sur votre demande avant même votre arrivée à l'hôtel.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#E5D5C5]/40 text-[#4a3e3d]">
            <div>
              <h3 className="font-display font-bold text-[#c5a880] text-3xl">4.7 / 5</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#a39080] font-bold mt-1">Recommandation Client</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-[#c5a880] text-3xl">100% Secure</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#a39080] font-bold mt-1">Double-Synchro Anti Surbooking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Remise Flash Banner Section - Right after About / Welcome */}
      <section className="bg-gradient-to-r from-amber-50 via-[#FCFAF5] to-amber-100/60 py-12 px-6 border-y border-luxury-gold/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/15 text-luxury-brand border border-luxury-gold/40 text-xs font-display font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            Offre Spéciale Séjour
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-luxury-brand font-bold">
            🎉 Remise Flash
          </h2>
          <p className="text-base md:text-lg text-[#4a3e3d] leading-relaxed max-w-2xl mx-auto font-medium">
            <strong>20% de réduction</strong> pour toute réservation effectuée au moins <strong>60 jours</strong> avant votre date d'arrivée. Offre valable jusqu'au <strong>31 octobre 2026</strong>.
          </p>
          <div className="pt-2">
            <button 
              onClick={openBookingWithFlashOffer}
              className="inline-flex items-center gap-2 bg-luxury-brand hover:bg-luxury-brand/90 text-luxury-gold hover:text-white px-8 py-3.5 rounded-full font-display uppercase tracking-widest text-xs font-bold transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Profiter de la remise de 20%
            </button>
          </div>
        </div>
      </section>

      {/* Services Section - Airport transport and Money change */}
      <section id="services" className="bg-[#4a3e3d]/5 py-24 px-6 border-y border-[#E5D5C5]/20">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">Services & Commodité</span>
            <h2 className="text-4xl font-serif text-luxury-brand font-normal">Services à l'Hôtel</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Service 1: Taxi & Navette Aéroport */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-[#E5D5C5]/30 flex flex-col justify-between transition-all hover:shadow-xl">
              <div>
                <div className="w-16 h-16 bg-luxury-brand rounded-full flex items-center justify-center text-luxury-gold mb-6">
                  <Plane className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-brand mb-3">Navette Aéroport – Hôtel – Aéroport</h3>
                <p className="text-[#8a7a6e] text-sm leading-relaxed font-light mb-4">
                  Si vous le souhaitez, nous vous prenons en charge dès votre arrivée à l'aéroport. Un chauffeur vous y attendra et vous ramènera directement à l'hôtel.
                </p>
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-medium space-y-1 mb-6">
                  <p className="font-bold text-luxury-brand">
                    Tarif : 30 000 FCFA (environ 45$ / 45€) — Distance : 40km entre l'aéroport et l'hôtel. Notre véhicule dispose de 5 places. Pour un groupe de 6 personnes ou plus, deux véhicules seront nécessaires.
                  </p>
                  <p className="text-[#8a7a6e] text-[11px]">
                    ℹ️ Note : Le transfert aéroport est un service optionnel facturé en supplément (non inclus dans le prix de la chambre).
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-luxury-brand font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Véhicule climatisé
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Chauffeur expérimenté, sérieux et attentionné trilingue (français-anglais-wolof)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Service assuré 7jr/7jr et 24h/24h
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => {
                  setBookingForm(prev => ({...prev, airportTransport: "Oui, Aller & Retour"}));
                  setIsBookingOpen(true);
                }}
                className="w-full bg-[#FCFAF5] hover:bg-luxury-brand hover:text-white text-luxury-brand py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all"
              >
                Demander un Transfert Aéroport
              </button>
            </div>

            {/* Service 2: Bureau de Change et Devise */}
            <div id="currency-tool" className="bg-white rounded-3xl p-8 shadow-md border border-[#E5D5C5]/30 flex flex-col justify-between transition-all hover:shadow-xl">
              <div>
                <div className="w-16 h-16 bg-luxury-brand rounded-full flex items-center justify-center text-luxury-gold mb-6">
                  <Coins className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-brand mb-3">Change de Devises</h3>
                <p className="text-[#8a7a6e] text-sm leading-relaxed font-light mb-6">
                  Pour vous éviter les longues files d'attente à l'aéroport au milieu de la nuit, ''Le CHAMAMA'' assure le change de vos euros ou vos dollars dès votre arrivée à l'hôtel à un taux nettement plus attractif qu'à l'aéroport ou dans une banque.
                </p>
                <ul className="space-y-2 text-xs text-luxury-brand font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Euros (EUR) et Dollars (USD) acceptés
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Change direct à l'hôtel dès votre arrivée
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-luxury-gold" /> Taux nettement plus attractif qu'à l'aéroport
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => {
                  setBookingForm(prev => ({...prev, currencyExchange: "Oui"}));
                  setIsBookingOpen(true);
                }}
                className="w-full bg-luxury-brand text-luxury-gold hover:text-white py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all"
              >
                Déclarer un besoin de change
              </button>
            </div>

          </div>
        </div>
      </section>



      {/* Rooms Grid Section */}
      <section id="sections" className="py-28 px-6 bg-[#FCFAF5] relative border-t border-[#E5D5C5]/20">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">HÉBERGEMENT</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-brand font-normal tracking-tight">Nos Logements</h2>
            
            <div className="bg-white rounded-2xl p-6 border border-luxury-gold/30 shadow-md max-w-3xl mx-auto text-center space-y-3">
              <p className="text-[#2D2726] text-sm md:text-base leading-relaxed font-normal">
                Toutes nos chambres sont climatisées et disposent d'une salle de bain privée. Tous les lits sont équipés de moustiquaires. Télévision. Wifi gratuite dans tout l'hôtel.
              </p>
              <p className="text-luxury-brand font-bold text-base md:text-lg tracking-wide border-t border-luxury-gold/20 pt-3">
                Nos prix sont TTC et s'entendent avec petit déjeuner compris.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROOMS_DATA.map((room) => {
              const activeIdx = carouselIndices[room.id] || 0;
              const activeImg = room.images[activeIdx];
              
              return (
                <div 
                  key={room.id} 
                  className="bg-white rounded-[1.8rem] overflow-hidden shadow-md border border-[#E5D5C5]/30 flex flex-col justify-between group transition-all hover:shadow-2xl"
                >
                  <div 
                    className="relative aspect-[4/3] overflow-hidden bg-black w-full cursor-pointer select-none"
                    onTouchStart={(e) => {
                      swipeStartRef.current = e.changedTouches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      if (swipeStartRef.current === null) return;
                      const touchEndX = e.changedTouches[0].clientX;
                      const diff = swipeStartRef.current - touchEndX;
                      if (Math.abs(diff) > 40) {
                        if (diff > 0) {
                          handleCarouselNext(room.id, room.images.length);
                        } else {
                          handleCarouselPrev(room.id, room.images.length);
                        }
                      }
                      swipeStartRef.current = null;
                    }}
                  >
                    <div 
                      onClick={() => {
                        setLightboxImage(activeImg);
                        setLightboxAlt(room.name);
                      }}
                      className="w-full h-full cursor-zoom-in"
                      title="Cliquer pour agrandir l'image"
                    >
                      <SafeImage 
                        src={activeImg} 
                        alt={`${room.name} Carousel View`} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103 pointer-events-none"
                        fallbackLabel={room.name}
                      />
                    </div>
                    
                    {/* Carousel navigation overlay buttons */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCarouselPrev(room.id, room.images.length);
                        }}
                        className="bg-white/80 hover:bg-white text-luxury-brand p-1.5 rounded-full shadow-lg transition-transform active:scale-95 pointer-events-auto"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCarouselNext(room.id, room.images.length);
                        }}
                        className="bg-white/80 hover:bg-white text-luxury-brand p-1.5 rounded-full shadow-lg transition-transform active:scale-95 pointer-events-auto"
                        aria-label="Image suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
 
                    {/* Carousel Dots indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                      {room.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeIdx ? 'bg-luxury-gold w-3' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
 
                    <div className="absolute top-4 right-4 bg-luxury-brand/90 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-display font-bold text-luxury-gold tracking-wider">
                      {room.priceCFA} / Nuit
                    </div>
                  </div>
 
                  <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-serif text-luxury-brand font-bold leading-tight">{room.name}</h3>
                          {room.subtitle && <p className="text-[10px] text-luxury-gold uppercase tracking-wider font-semibold mt-0.5">{room.subtitle}</p>}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono italic shrink-0">~{room.priceEUR} €</span>
                      </div>
 
                      <p className="text-[#2D2726] text-sm font-normal leading-relaxed">
                        {room.description}
                      </p>
                    </div>
 
                    <div>
                      {/* Room features grid list */}
                      <div className="flex flex-wrap gap-1.5 py-2">
                        {room.features.map((f, i) => (
                          <span key={i} className="bg-[#4a3e3d]/10 border border-luxury-brand/20 text-luxury-brand text-[10px] font-semibold font-display px-2.5 py-1 rounded-md">
                            {f}
                          </span>
                        ))}
                      </div>
 
                      <div className="pt-3 border-t border-[#E5D5C5]/20 flex items-center justify-between text-[11px] font-medium text-gray-500 mb-4">
                        <span>📏 {room.size}</span>
                        <span>👥 {room.capacity}</span>
                      </div>
 
                      <button 
                        onClick={() => {
                          setBookingRooms(prev => {
                            if (prev.length === 0) {
                              return [{
                                id: "room-1",
                                roomType: room.name,
                                checkIn: "",
                                checkOut: "",
                                arrivalTime: "",
                                guests: room.name.includes("1,2") ? "2" : room.name.includes("familiale") ? "3" : room.name.includes("3,4,5") ? "3" : "2",
                                childrenCount: "0"
                              }];
                            }
                            return prev.map((r, idx) => idx === 0 ? {
                              ...r,
                              roomType: room.name,
                              guests: room.name.includes("1,2") ? "2" : room.name.includes("familiale") ? "3" : room.name.includes("3,4,5") ? "3" : "2"
                            } : r);
                          });
                          setIsBookingOpen(true);
                        }}
                        className="w-full bg-luxury-brand text-luxury-gold group-hover:text-white py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all hover:bg-luxury-brand/90 block text-center"
                      >
                        {room.name.includes("Bungalow") ? "Réserver ce Bungalow" : "Réserver cette Chambre"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modes de paiement acceptés */}
          <div className="mt-12 text-center max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-[1.5rem] border border-[#E5D5C5]/45 shadow-sm text-xs text-[#4a3e3d] space-y-3">
              <div className="flex items-center justify-center gap-2 pb-2 border-b border-[#E5D5C5]/20 flex-wrap">
                <span className="text-luxury-gold text-base">💳</span>
                <span className="font-bold uppercase tracking-wider text-[10px] text-luxury-brand">Modes de paiement acceptés :</span>
                <span className="text-[#8a7a6e] font-semibold">Carte bancaire, Euro ou monnaie locale</span>
              </div>
              <div className="space-y-2 text-center text-[#8a7a6e] font-light leading-relaxed">
                <p>
                  Vous ne versez rien à la réservation. Le règlement se fait à votre arrivée à l'hôtel. Paiement accepté en Fcfa, euros ou par carte bancaire.
                </p>
                <p className="italic text-[11px] text-luxury-gold font-medium">
                  PS : Si annulation, merci de nous prévenir rapidement.
                </p>
              </div>
            </div>
          </div>
 
        </div>
      </section>

      {/* Restaurant and Bar Section */}
      <section id="restaurant" className="py-24 px-6 bg-[#4a3e3d]/5 border-t border-[#E5D5C5]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">Saveurs & Convivialité</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-brand font-normal tracking-tight">LA RESTAURATION ET LE BAR</h2>
            <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed">
              Un petit déjeuner copieux pour commencer la journée. De succulents plats locaux et européens et un bar très diversifié complètent ce bien-être au CHAMAMA.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5D5C5]/30 group relative">
              <SafeImage src={imgRestaurant} alt="Le Restaurant" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel="Le Restaurant" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-display text-xs uppercase tracking-wider font-semibold">Notre Salle de Restaurant</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5D5C5]/30 group relative">
              <SafeImage src={imgThiof} alt="Plat de Thiof" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel="Thiof" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-display text-xs uppercase tracking-wider font-semibold">Le Thiof Local</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5D5C5]/30 group relative">
              <SafeImage src={imgSteack} alt="Steack" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel="Steack" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-display text-xs uppercase tracking-wider font-semibold">Viandes Grillées</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5D5C5]/30 group relative">
              <SafeImage src={imgSole} alt="Plat de Sole" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel="Sole" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-display text-xs uppercase tracking-wider font-semibold">La Sole Meunière</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E5D5C5]/30 group relative col-span-2 md:col-span-1">
              <SafeImage src={imgSaladeFruits} alt="Salade de Fruits" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel="Salade de fruits" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-display text-xs uppercase tracking-wider font-semibold">Fruits Frais de Saison</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highly polished Multi-category Photo Gallery with Zoom effects */}
      <section id="gallery" className="py-28 px-6 bg-white border-t border-[#E5D5C5]/20">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">Immersion Visuelle</span>
              <h2 className="text-4xl font-serif text-luxury-brand font-normal leading-none">Découvrir Le Chamama</h2>
            </div>
            
            {/* Elegant category filter links */}
            <div className="flex gap-2 font-display text-[10px] md:text-xs uppercase tracking-widest flex-wrap">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2.5 rounded-full font-bold transition-all ${activeTab === "all" ? "bg-luxury-brand text-luxury-gold" : "bg-[#FCFAF5] text-luxury-brand hover:bg-[#F5F2EA]"}`}
              >
                Tout voir
              </button>
              <button 
                onClick={() => setActiveTab("pool")}
                className={`px-5 py-2.5 rounded-full font-bold transition-all ${activeTab === "pool" ? "bg-luxury-brand text-luxury-gold" : "bg-[#FCFAF5] text-luxury-brand hover:bg-[#F5F2EA]"}`}
              >
                Piscine
              </button>
              <button 
                onClick={() => setActiveTab("interior")}
                className={`px-5 py-2.5 rounded-full font-bold transition-all ${activeTab === "interior" ? "bg-luxury-brand text-luxury-gold" : "bg-[#FCFAF5] text-luxury-brand hover:bg-[#F5F2EA]"}`}
              >
                Intérieurs & Bar
              </button>
              <button 
                onClick={() => setActiveTab("activities")}
                className={`px-5 py-2.5 rounded-full font-bold transition-all ${activeTab === "activities" ? "bg-luxury-brand text-luxury-gold" : "bg-[#FCFAF5] text-luxury-brand hover:bg-[#F5F2EA]"}`}
              >
                Activités
              </button>
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={i}
                  className="aspect-[4/3] rounded-3xl overflow-hidden relative group shadow-md"
                >
                  <SafeImage 
                    src={item.src} 
                    alt={item.title || "Galerie Image"} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    fallbackLabel={item.type === "interior" ? "Intérieurs & Bar" : item.type === "pool" ? "Piscine" : "Activités"}
                  />
                  {/* Visual card details overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-brand/85 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-luxury-gold uppercase font-bold font-display tracking-widest">{item.type === "interior" ? "Intérieurs & Bar" : item.type === "pool" ? "Piscine" : "Activités"}</span>
                    {item.title && <h4 className="text-xl font-serif text-white mt-1">{item.title}</h4>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Upgraded direct client reviews and testimonial slider */}
      <section id="reviews" className="bg-[#2D2A26] text-white py-28 px-6 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Globe className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-4 space-y-6">
              <span className="text-xs uppercase font-display tracking-[0.3em] text-[#c5a880] font-bold">Témoignages</span>
              <h2 className="text-3xl md:text-4xl font-serif leading-tight text-white font-bold">
                AVIS DE NOS CLIENTS
              </h2>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                <span className="text-xl font-bold ml-2">4.7 / 5</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm font-light">
                Une note très élevée construite au jour le jour grâce au sérieux, la disponibilité et la gentillesse de Robert et Mama et de toute son équipe.
              </p>
              
              {/* Robert & Mama photo with custom card styling */}
              <div className="rounded-2xl overflow-hidden border border-[#c5a880]/20 shadow-xl max-w-sm bg-white/5 backdrop-blur-md">
                <SafeImage 
                  src={imgRobertMama} 
                  alt="Robert et Mama" 
                  className="w-full aspect-[4/3] object-cover filter brightness-95" 
                  fallbackLabel="Robert et Mama" 
                />
                <div className="bg-black/40 p-4 text-center border-t border-white/10">
                  <p className="font-serif italic text-luxury-gold text-sm font-light">"Robert et Mama, vos hôtes chaleureux au Sénégal."</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
              
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-[#c5a880] text-sm">Anthony L. &bull; Tripadvisor</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                  "Super endroit pour visiter le lac rose et super rapport qualité prix. Très bel accueil ! Personnel très agréable ! Piscine propre. Je recommande sans problème."
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-[#c5a880] text-sm">Mamacanarie &bull; Client</span>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                  "Bien. Les repas sont très bons et valent la peine. Endroit propre et bien équipé. Côté familial très appréciable."
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-[#c5a880] text-sm">Jean-Pierre &bull; Client</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                  "Mama et Robert vous font sentir comme à la maison ! Un séjour parfait en tous points. Chauffeur de navette au top."
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-[#c5a880] text-sm">Fatou B. &bull; Dakar</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                  "Merveilleuse piscine et chambres confortables. J'ai utilisé le service de change pour mes invités européens, extrêmement pratique !"
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Map, Access & Reservation Form Contact CTA */}
      <section id="contact" className="py-28 px-6 max-w-7xl mx-auto scroll-mt-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase font-display tracking-[0.3em] text-luxury-gold font-bold">Nous trouver</span>
              <h2 className="text-4xl font-serif text-luxury-brand font-normal tracking-tight">SITUATION ET ACCÈS</h2>
            </div>

            <p className="text-[#8a7a6e] text-sm md:text-base leading-relaxed">
              L'hôtel est situé à Niaga Peulh. Depuis la route nationale, prendre la sortie ''lac rose'' (Niaga). Traverser Niaga en direction du lac rose. Tourner à droite au panneau ''Hôtel Le CHAMAMA''. Continuer sur 500m, un dernier panneau vous indique l'hôtel à 50m. Vous êtes arrivés, bienvenue !
            </p>

            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-luxury-gold shadow-sm shrink-0 border border-[#E5D5C5]/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#4a3e3d] uppercase tracking-wide">Notre Adresse</h4>
                  <p className="text-[#8a7a6e] text-xs mt-0.5">Niaga 21000, Lac Rose, Sénégal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-luxury-gold shadow-sm shrink-0 border border-[#E5D5C5]/20">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#4a3e3d] uppercase tracking-wide">Réservations Directes</h4>
                  <p className="text-[#8a7a6e] text-xs mt-0.5">+221 77 102 23 86 (Soutien direct propriétaires)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-luxury-gold shadow-sm shrink-0 border border-[#E5D5C5]/20">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#4a3e3d] uppercase tracking-wide">Horaires Réception</h4>
                  <p className="text-[#8a7a6e] text-xs mt-0.5">Ouvert tous les jours, 24 heures sur 24 pour les arrivées tardives</p>
                </div>
              </div>

            </div>

            {/* Quick pre-book direct button */}
            <div className="bg-[#4a3e3d] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-[#c5a880]/30 shadow-xl">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold">Séjour Direct Assuré</p>
                <h3 className="text-xl font-serif italic mt-0.5">Envie d'un accueil unique ?</h3>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-luxury-gold text-white hover:bg-white hover:text-luxury-brand px-6 py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all"
              >
                Calculer séjour
              </button>
            </div>

          </div>

          <div className="aspect-[4/3] lg:aspect-auto lg:h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15422.348107871246!2d-17.228514570023605!3d14.820579294975239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec1a396ebf456bb%3A0xea8028731d102e3b!2sNiaga!5e0!3m2!1sfr!2ssn!4v1234567890" 
              className="w-full h-full border-0"
              allowFullScreen
              title="Carte interactive de Niaga, Sénégal"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>

      {/* Footer copyright section with links */}
      <footer className="bg-[#4a3e3d] text-white py-16 px-6 border-t border-luxury-gold/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-luxury-gold text-white rounded-full flex items-center justify-center font-serif italic text-lg font-bold">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold text-[#c5a880] tracking-wider uppercase">Le Chamama</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-300">Niaga, Sénégal</span>
            </div>
          </div>

          <div className="flex gap-8 text-xs font-display font-semibold uppercase tracking-widest text-gray-300 flex-wrap justify-center">
            <a href="https://wa.me/221771022386" target="_blank" rel="noreferrer" className="hover:text-luxury-gold transition-colors">WhatsApp</a>
            <a href="#sections" className="hover:text-luxury-gold transition-colors">Nos Tarifs</a>
            <a href="#services" className="hover:text-luxury-gold transition-colors">Service De Change</a>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>&copy; 2026 Hôtel Le Chamama. Tous droits réservés.</p>
            <p className="text-[10px]">Protocole de sécurité anti-surbooking iCal actif.</p>
          </div>

        </div>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full flex flex-col items-center justify-center pointer-events-none z-10"
            >
              <div className="relative pointer-events-auto max-h-[80vh] flex items-center justify-center">
                <SafeImage 
                  src={lightboxImage} 
                  alt={lightboxAlt} 
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  fallbackLabel={lightboxAlt}
                />
                
                <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute -top-4 -right-4 md:top-4 md:right-4 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-white/20 transition-all hover:scale-105"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-white text-center mt-4 font-serif text-lg tracking-wide z-10 pointer-events-auto">
                {lightboxAlt}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
