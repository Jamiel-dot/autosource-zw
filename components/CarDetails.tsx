import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car, Profile, ListingImage, ListingFeature } from '../types';
import { Button } from './Button';
import { isInWishlist, toggleWishlist } from '../lib/wishlist';
import { CarCard } from './CarCard';

const Icons = {
  Calendar: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Mileage: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  Transmission: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Fuel: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Body: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Engine: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.321a2 2 0 01-1.583.13l-2.731-.91a1 1 0 00-1.284.945V18a2 2 0 002 2h10a2 2 0 002-2v-1.572a2 2 0 00-.572-1.414z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 8l-3 3m0 0l-3-3m3 3V3" /></svg>,
  Color: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
  Doors: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Location: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-[#237837]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Share: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Email: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>,
  ChevronLeft: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>,
  Video: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Make: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  WhatsApp: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.035c0 2.123.554 4.197 1.606 6.034L0 24l6.135-1.61a11.893 11.893 0 005.915 1.648h.005c6.635 0 12.032-5.396 12.035-12.035a11.778 11.778 0 00-3.411-8.528"/></svg>,
  Copy: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>,
  Facebook: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  TwitterX: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
};

export const CarDetails: React.FC = () => {
  const { id: carId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const trustBarRef = useRef<HTMLDivElement>(null);

  const [car, setCar] = useState<Car | null>(null);
  const [dealer, setDealer] = useState<Profile | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [features, setFeatures] = useState<ListingFeature[]>([]);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [explanation, setExplanation] = useState<{ title: string; text: string } | null>(null);
  
  // Share drawer state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Visibility states
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  useEffect(() => {
    if (!car) return;

    const updateMeta = (property: string, content: string, attr: string = 'property') => {
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const title = `${car.year} ${car.make} ${car.model} | AutoSource ZW`;
    const desc = `View this ${car.condition} ${car.make} ${car.model} listed for ${car.currency} ${car.price.toLocaleString()} in ${car.location_city}. Browse verified cars in Zimbabwe.`;
    
    document.title = title;
    updateMeta('og:title', title);
    updateMeta('og:description', desc);
    updateMeta('og:image', car.main_image_url);
    updateMeta('og:url', window.location.href);
    updateMeta('og:type', 'website');
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', desc, 'name');
    updateMeta('twitter:image', car.main_image_url, 'name');

    return () => {
       document.title = "AutoSource ZW | Zimbabwe's No.1 Car Marketplace";
    };
  }, [car]);

  useEffect(() => {
    if (!carId) return;

    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*, profiles(*)')
          .eq('id', carId)
          .single();

        if (listingError) throw listingError;
        setCar(listingData as any as Car);
        setActiveImage(listingData.main_image_url);
        setIsSaved(isInWishlist(carId));
        
        if (listingData.profiles) {
          setDealer(listingData.profiles as Profile);
          const { data: otherData } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', listingData.user_id)
            .neq('id', carId)
            .eq('status', 'approved')
            .limit(4);
          if (otherData) setRelatedCars(otherData as any as Car[]);
        }

        const { data: imgData } = await supabase.from("listing_images").select("*").eq("listing_id", carId).order("position", { ascending: true });
        if (imgData) setImages(imgData as ListingImage[]);

        const { data: featureData } = await supabase.from('listing_features').select('*').eq('listing_id', carId);
        if (featureData) setFeatures(featureData as ListingFeature[]);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [carId]);

  const allImages = [
    { id: 'main', image_url: car?.main_image_url || '' }, 
    ...images.map(img => ({ id: img.id, image_url: img.image_url }))
  ].filter(img => img.image_url);

  useEffect(() => {
    if (loading || allImages.length <= 1 || lightboxOpen) return;
    
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const currentScroll = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.offsetWidth;
      const maxScroll = carouselRef.current.scrollWidth - itemWidth;
      
      let nextScroll = currentScroll + itemWidth;
      if (nextScroll >= maxScroll + 1) nextScroll = 0;
      
      carouselRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, allImages.length, lightboxOpen]);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  const dealerPhone = dealer?.business_phone || dealer?.phone || '+263 788 832 950';
  const dealerEmail = dealer?.email || 'sales@autosource.co.zw';
  const whatsappNumber = dealerPhone.replace(/\+/g, '').replace(/\s/g, '').replace(/\-/g, '');

  /**
   * Metadata Proxy URL
   */
  const shareMetaUrl = car ? `${window.location.origin}/car-meta.html?id=${car.id}` : window.location.href;
  const shareTitle = car ? `${car.year} ${car.make} ${car.model}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Copy failed:', err); }
  };

  const handleShareWhatsApp = () => {
    const msg = `*VEHICLE ENQUIRY: ${shareTitle}*\n*Price:* ${car?.currency} ${car?.price?.toLocaleString()}\n\nCheck this out on AutoSource ZW:\n${shareMetaUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Car Listing: ${shareTitle}`;
    const body = `Hi,\n\nI thought you might be interested in this ${shareTitle} listed on AutoSource ZW.\n\nLink: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareMetaUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Check out this ${shareTitle} on @AutoSourceZW!`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareMetaUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-40 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#237837]/20 border-t-[#237837] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Loading Vehicle Data...</p>
    </div>
  );

  if (!car) return null;

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature.name);
    return acc;
  }, {} as Record<string, string[]>);

  const specs = [
    { label: 'Make', value: car.make, icon: <Icons.Make /> },
    { label: 'Model', value: car.model, icon: <Icons.Body /> },
    { label: 'Year', value: car.year, icon: <Icons.Calendar /> },
    { label: 'Mileage', value: `${car.mileage?.toLocaleString()} km`, icon: <Icons.Mileage /> },
    { label: 'Transmission', value: car.transmission, icon: <Icons.Transmission /> },
    { label: 'Fuel Type', value: car.fuel_type, icon: <Icons.Fuel /> },
    { label: 'Body Type', value: car.body_type, icon: <Icons.Body /> },
    { label: 'Engine Size', value: car.engine_size || 'N/A', icon: <Icons.Engine /> },
    { label: 'Color', value: car.color || 'N/A', icon: <Icons.Color /> },
    { label: 'Doors', value: car.doors || 'N/A', icon: <Icons.Doors /> },
  ];

  const handleWhatsAppEnquiry = () => {
    const message = `*VEHICLE ENQUIRY: ${car.year} ${car.make} ${car.model}*\n` +
                    `*Price:* ${car.currency} ${car.price?.toLocaleString()}\n` +
                    `*Condition:* ${car.condition}\n` +
                    `*Mileage:* ${car.mileage?.toLocaleString()} km\n\n` +
                    `Hi, I am interested in this vehicle listed on AutoSource ZW. Could you please confirm its availability and let me know when I can come for a viewing? Thank you.\n\n` +
                    `${window.location.href}`;
                    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const trustItems = [
    { label: 'Verified sellers', title: 'Verified Seller Promise', text: 'All dealers on our platform undergo a rigorous 5-point verification process, checking their identity, business registration, and physical premises to ensure absolute security for buyers.' },
    { label: 'Transparent pricing', title: 'Transparent Pricing Policy', text: 'We ensure all listings show the full asking price with no hidden dealer administration fees or secret charges added at the time of sale.' }
  ];

  const maskString = (str: string, visibleCount: number = 4) => {
    if (str.length <= visibleCount) return str;
    return str.substring(0, visibleCount) + '•'.repeat(str.length - visibleCount);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32 relative">
      {/* Share Drawer (Slides from Right Side) */}
      <div className={`fixed inset-0 z-[200] transition-opacity duration-500 ${isShareOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsShareOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out transform p-8 md:p-12 overflow-y-auto ${isShareOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Share Listing</h2>
            <button onClick={() => setIsShareOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100">
               <Icons.Close />
            </button>
          </div>

          {/* Share Preview Card */}
          <div className="bg-slate-50 rounded-[32px] overflow-hidden flex items-center p-4 gap-6 mb-10 shadow-sm border border-slate-100">
             <div className="w-32 h-24 rounded-2xl overflow-hidden shrink-0">
               <img src={car.main_image_url} alt="Share preview" className="w-full h-full object-cover" />
             </div>
             <div className="space-y-1">
               <p className="text-[17px] font-black text-slate-900 tracking-tight leading-none mb-1">
                 {car.currency} {car.price?.toLocaleString()}
               </p>
               <p className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">
                 {car.make} {car.model}
               </p>
               <p className="text-[12px] font-bold text-slate-500 tracking-tight italic">
                 {car.listing_title}
               </p>
             </div>
          </div>

          {/* Share Actions - Themed with #237837 */}
          <div className="space-y-2">
            {[
              { label: 'Copy link', icon: <Icons.Copy />, action: handleCopyLink, isCopied: copied },
              { label: 'Share via email', icon: <Icons.Email />, action: handleShareEmail },
              { label: 'Share via WhatsApp', icon: <Icons.WhatsApp />, action: handleShareWhatsApp },
              { label: 'Share on Facebook', icon: <Icons.Facebook />, action: handleShareFacebook },
              { label: 'Share on X (Twitter)', icon: <Icons.TwitterX />, action: handleShareTwitter }
            ].map((option, i) => (
              <button 
                key={i} 
                onClick={option.action}
                className="w-full flex items-center justify-between p-6 rounded-2xl hover:bg-slate-50 transition-all group border-b border-slate-50 last:border-none"
              >
                <div className="flex items-center gap-6 text-[#237837]">
                   <div className="transition-transform group-hover:scale-110">
                     {option.icon}
                   </div>
                   <span className="text-[16px] font-bold">
                     {option.isCopied ? 'Link Copied!' : option.label}
                   </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation Popup */}
      {explanation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setExplanation(null)} />
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
             <button onClick={() => setExplanation(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                <Icons.Close />
             </button>
             <h3 className="text-2xl font-black text-slate-900 mb-4">{explanation.title}</h3>
             <p className="text-slate-600 font-medium leading-relaxed">{explanation.text}</p>
             <Button variant="primary" fullWidth className="mt-8 rounded-2xl h-14" onClick={() => setExplanation(null)}>Got it</Button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxOpen(false)}>
           <img src={activeImage || car.main_image_url} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95" alt="Zoomed view" />
        </div>
      )}

      {/* Trust Bar */}
      <div className="bg-[#f8f9fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 flex-grow overflow-hidden relative">
              <div ref={trustBarRef} className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory whitespace-nowrap px-1">
                {trustItems.map((item, i) => (
                  <button key={i} onClick={() => setExplanation({ title: item.title, text: item.text })} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-[#237837] transition-colors snap-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#237837]" />
                    <span className="underline decoration-dotted underline-offset-4">{item.label}</span>
                  </button>
                ))}
              </div>
           </div>

           <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 shrink-0 pl-4 border-l border-slate-200">
              <Icons.Phone />
              <button 
                onClick={() => setPhoneRevealed(true)}
                className={`hover:text-[#237837] transition-colors ${!phoneRevealed ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {phoneRevealed ? <a href={`tel:${dealerPhone}`}>{dealerPhone}</a> : maskString(dealerPhone, 7)}
              </button>
           </div>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-500 hover:text-[#237837] font-black text-[11px] uppercase tracking-widest transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </button>
          <div className="flex items-center gap-3 md:gap-4">
             <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all bg-slate-50 text-slate-500 hover:bg-slate-100">
                <Icons.Share />
                <span className="hidden sm:inline">Share Car</span>
             </button>
             <button onClick={() => toggleWishlist(car.id)} className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${isSaved ? 'bg-[#237837] text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isSaved ? 'Saved' : 'Save Car'}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow space-y-10 lg:max-w-[calc(100%-400px)]">
            <div className="space-y-6">
              <div className="relative group/gallery">
                <div ref={carouselRef} className="relative aspect-[16/10] bg-white rounded-[48px] overflow-x-auto snap-x snap-mandatory flex no-scrollbar cursor-zoom-in group shadow-2xl border border-slate-100">
                  {allImages.map((img, idx) => (
                    <div key={img.id} className="w-full h-full flex-shrink-0 snap-center relative" onClick={() => { setActiveImage(img.image_url); setLightboxOpen(true); }}>
                      <img src={img.image_url} alt={`${car.listing_title} ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-5 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {idx + 1} / {allImages.length}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollGallery('left')} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white active:scale-95 z-20 hidden md:flex">
                  <Icons.ChevronLeft />
                </button>
                <button onClick={() => scrollGallery('right')} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white active:scale-95 z-20 hidden md:flex">
                  <Icons.ChevronRight />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button key={img.id} onClick={() => { carouselRef.current?.scrollTo({ left: carouselRef.current.offsetWidth * idx, behavior: 'smooth' }); }} className={`flex-shrink-0 w-28 aspect-[4/3] rounded-[20px] overflow-hidden border-4 transition-all duration-300 border-transparent opacity-60 hover:opacity-100`}>
                    <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[48px] p-10 md:p-14 shadow-sm border border-slate-100 space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#237837] text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#237837]/20">{car.condition}</span>
                    <span className="text-slate-400 text-[11px] font-bold flex items-center gap-2 uppercase tracking-widest">
                       <Icons.Location /> {car.location_city}, ZW
                    </span>
                  </div>
                  <h1 className="text-[30px] font-black text-slate-900 tracking-tighter leading-tight">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-1">{car.listing_title}</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asking Price</p>
                  <div className="text-[15px] font-black text-[#237837] tracking-tighter leading-none">
                    {car.currency} {car.price?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {specs.map((spec, i) => (
                  <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-[#237837]/5 group">
                    <div className="text-[#237837] mb-3 group-hover:scale-110 transition-transform">{spec.icon}</div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </div>

              {car.video_url && (
                <div className="space-y-6 pt-4">
                   <h2 className="text-[25px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                     <Icons.Video /> Video Tour
                   </h2>
                   <div className="aspect-video w-full rounded-[40px] overflow-hidden bg-slate-100 shadow-inner border border-slate-100">
                      {car.video_url.includes('youtube') || car.video_url.includes('youtu.be') ? (
                        <iframe src={getEmbedUrl(car.video_url)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      ) : (
                        <video src={car.video_url} controls className="w-full h-full object-cover"></video>
                      )}
                   </div>
                </div>
              )}

              <div className="space-y-6">
                <h2 className="text-[25px] font-black text-slate-900 uppercase tracking-tighter">Detailed Description</h2>
                <div className="text-slate-600 font-medium leading-relaxed text-[13px] whitespace-pre-wrap tracking-tight">
                  {car.description || "No detailed description provided."}
                </div>
              </div>

              <div className="space-y-10">
                <h2 className="text-[25px] font-black text-slate-900 uppercase tracking-tighter">Key Features & Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {Object.entries(groupedFeatures).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#237837] uppercase tracking-[0.2em] border-b border-slate-50 pb-3">{category}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-600 font-bold text-[13px] tracking-tight group">
                            <div className="w-5 h-5 rounded-lg bg-[#237837]/10 flex items-center justify-center shrink-0">
                               <Icons.Check />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[380px] flex-shrink-0 space-y-6">
            <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-[100px]">
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-slate-50 shadow-xl overflow-hidden flex items-center justify-center">
                    {dealer?.logo_url || dealer?.avatar_url ? (
                      <img src={dealer.logo_url || dealer.avatar_url || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[#237837]">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black tracking-tighter leading-none text-slate-900">{dealer?.business_name || dealer?.full_name || 'Verified Seller'}</h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="bg-[#237837] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#237837]/20">Verified Dealer</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#237837] shrink-0">
                         <Icons.Location />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[11px] font-black text-[#8a94a6] uppercase tracking-wider mb-0.5">Location</p>
                        <p className="text-[16px] font-black text-[#0f172a] tracking-tight">{car.location_city}, ZW</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setEmailRevealed(true)}
                      className="w-full flex items-center gap-5 group/item text-left outline-none"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#237837] flex items-center justify-center text-white shrink-0 group-hover/item:scale-105 transition-transform">
                         <Icons.Email />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[11px] font-black text-[#8a94a6] uppercase tracking-wider mb-0.5">Dealer Email</p>
                        <p className="text-[15px] font-black text-[#0f172a] tracking-tight truncate max-w-[180px]">
                          {emailRevealed ? dealerEmail : maskString(dealerEmail, 4)}
                        </p>
                      </div>
                    </button>
                    
                    <div className="space-y-4 pt-4">
                      <button 
                        onClick={() => setPhoneRevealed(true)}
                        className="w-full bg-[#f8f9fa] hover:bg-[#f1f5f9] text-[#0f172a] text-[18px] font-black py-6 rounded-[24px] transition-all flex items-center justify-center shadow-sm"
                      >
                        {phoneRevealed ? (
                           <a href={`tel:${dealerPhone}`} onClick={(e) => e.stopPropagation()}>{dealerPhone}</a>
                        ) : (
                           `Show Number`
                        )}
                      </button>
                      <Button 
                        fullWidth 
                        className="rounded-[24px] h-16 bg-[#25D366] text-white border-none text-[13px] font-black uppercase tracking-widest shadow-xl shadow-[#25D366]/20" 
                        onClick={handleWhatsAppEnquiry}
                      >
                        WhatsApp Enquiry
                      </Button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#237837]/10 rounded-full blur-[60px]" />
               <h4 className="text-[15px] font-black mb-4 relative z-10">Buying Securely</h4>
               <ul className="space-y-4 relative z-10">
                  {['Always meet in public spaces.', 'Never send money before viewing.', 'Verify logbook authenticity.', 'Request ZIMRA clearance.'].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-[11px] text-slate-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#237837] mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
               </ul>
            </div>
          </aside>
        </div>

        {/* Related Inventory */}
        {relatedCars.length > 0 && (
          <div className="mt-24 pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <div>
                <h2 className="text-[25px] font-black text-slate-900 tracking-tighter leading-none">More from this Seller</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Available in {dealer?.business_name || 'showroom'}</p>
              </div>
              <Button variant="ghost" className="text-[#237837] font-black text-[13px] uppercase tracking-widest group" onClick={() => navigate('/marketplace')}>
                View Showroom
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedCars.map(relatedCar => <CarCard key={relatedCar.id} car={relatedCar} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};