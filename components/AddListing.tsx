
import React, { useEffect, useRef, useState } from "react";
import { UserProfile, VehicleListing, Car } from "../types";
import { supabase } from "../lib/supabase";
import { Button } from "./Button";
import { RegistrationPopup } from "./RegistrationPopup";
import { DASHBOARD_URL } from "../constants";

interface AddListingProps {
  user: UserProfile | null;
  onComplete: () => void;
  editingListing?: VehicleListing;
  initialData?: Partial<VehicleListing>;
}

export const AddListing: React.FC<AddListingProps> = ({ user: initialUser, onComplete, editingListing, initialData }) => {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [bodyTypes, setBodyTypes] = useState<any[]>([]);
  
  const [selectedMake, setSelectedMake] = useState<string>(editingListing?.make || initialData?.make || "");
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const reportFileInputRef = useRef<HTMLInputElement>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(editingListing?.main_image_url || initialData?.main_image_url || null);
  const [galleryPreviews, setGalleryPreviews] = useState<{ idx: number; url: string }[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialData?.features || []);
  const [selectedReportName, setSelectedReportName] = useState<string | null>(
    editingListing?.report_url ? "Current Verification Document" : null
  );

  const [showPayChoice, setShowPayChoice] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [payChoice, setPayChoice] = useState<"pay" | "skip">("skip");
  const [showRegistration, setShowRegistration] = useState(false);

  const [draftId, setDraftId] = useState<string | null>(null);

  const getSessionId = () => {
    let sid = sessionStorage.getItem('as_draft_session');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('as_draft_session', sid);
    }
    return sid;
  };

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (profile) setUser(profile as UserProfile);
    }
  };

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Load metadata + recovery hydration
  useEffect(() => {
    async function init() {
      try {
        const [modelsRes, bodyRes] = await Promise.all([
          supabase.from("vehicle_models").select("id, make_name, name").order("name", { ascending: true }),
          supabase.from("body_types").select("name").order("name", { ascending: true }),
        ]);

        const uniqueMakes = Array.from(new Set((modelsRes.data || []).map(m => m.make_name))).map(n => ({ name: n }));
        setMakes(uniqueMakes);
        setModels(modelsRes.data || []);
        setBodyTypes(bodyRes.data || []);
        setYears(Array.from({length: 40}, (_, i) => ({ year: 2025 - i })));

        const sid = getSessionId();
        
        if (editingListing) {
          const { data: features } = await supabase.from('listing_features').select('name').eq('listing_id', editingListing.id);
          if (features) setSelectedFeatures(features.map(f => f.name));
          
          const { data: images } = await supabase.from('listing_images').select('*').eq('listing_id', editingListing.id).eq('is_primary', false).order('position');
          if (images) setGalleryPreviews(images.map((img, idx) => ({ idx: idx + 1, url: img.image_url })));
        } else {
          // Recover draft by user or session
          const { data: draftData } = await supabase
            .from('listing_drafts')
            .select('*')
            .or(`user_id.eq.${user?.id},session_id.eq.${sid}`)
            .maybeSingle();

          if (draftData) {
            setDraftId(draftData.id);
            setLastSaved(new Date(draftData.updated_at));
            
            const form = formRef.current;
            if (form) {
              const restore = (name: string, val: any) => {
                const el = form.querySelector(`[name="${name}"]`) as any;
                if (el && val !== null && val !== undefined) el.value = String(val);
              };

              restore('listing-title', draftData.listing_title);
              restore('make', draftData.make);
              restore('model', draftData.model);
              restore('body_type', draftData.body_type);
              restore('year', draftData.year);
              restore('condition', draftData.condition);
              restore('stock-number', draftData.stock_number);
              restore('vin-number', draftData.vin_number);
              restore('mileage', draftData.mileage);
              restore('transmission', draftData.transmission);
              restore('driver_type', draftData.driver_type);
              restore('engine-size', draftData.engine_size);
              restore('cylinders', draftData.cylinders);
              restore('fuel_type', draftData.fuel_type);
              restore('doors', draftData.doors);
              restore('color', draftData.color);
              restore('seats', draftData.seats);
              restore('city-mpg', draftData.city_mpg);
              restore('highway-mpg', draftData.highway_mpg);
              restore('regular-price', draftData.price);
              restore('sale-price', draftData.old_price);
              restore('description', draftData.description);
              restore('address', draftData.location_address);
              restore('location-city', draftData.location_city);
              restore('location-country', draftData.location_country);
              restore('video_url', draftData.video_url);
              restore('vehicle-type', draftData.vehicle_type);

              if (draftData.make) setSelectedMake(draftData.make);
              if (Array.isArray(draftData.features)) setSelectedFeatures(draftData.features);
            }
          }
        }
      } catch (err) {
        console.error("Hydration Error:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    init();
  }, [user?.id, editingListing]);

  // Periodic Auto-Save Draft
  useEffect(() => {
    if (editingListing) return;

    const saveDraft = async () => {
      const form = formRef.current;
      if (!form) return;

      const formData = new FormData(form);
      const features = selectedFeatures;
      const sid = getSessionId();

      const payload: any = {
        user_id: user?.id || null,
        session_id: user?.id ? null : sid,
        listing_title: formData.get("listing-title")?.toString() || initialData?.listing_title || null,
        make: formData.get("make")?.toString() || selectedMake || null,
        model: formData.get("model")?.toString() || null,
        body_type: formData.get("body_type")?.toString() || null,
        year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
        condition: formData.get("condition")?.toString() || "Used",
        stock_number: formData.get("stock-number")?.toString() || null,
        vin_number: formData.get("vin-number")?.toString() || null,
        mileage: formData.get("mileage") ? parseInt(formData.get("mileage") as string) : null,
        transmission: formData.get("transmission")?.toString() || null,
        driver_type: formData.get("driver_type")?.toString() || null,
        engine_size: formData.get("engine-size")?.toString() || null,
        cylinders: formData.get("cylinders") ? parseInt(formData.get("cylinders") as string) : null,
        fuel_type: formData.get("fuel_type")?.toString() || null,
        doors: formData.get("doors") ? parseInt(formData.get("doors") as string) : null,
        color: formData.get("color")?.toString() || null,
        seats: formData.get("seats") ? parseInt(formData.get("seats") as string) : null,
        city_mpg: formData.get("city-mpg") ? parseInt(formData.get("city-mpg") as string) : null,
        highway_mpg: formData.get("highway-mpg") ? parseInt(formData.get("highway-mpg") as string) : null,
        price: formData.get("regular-price") ? parseFloat(formData.get("regular-price") as string) : null,
        old_price: formData.get("sale-price") ? parseFloat(formData.get("sale-price") as string) : null,
        description: formData.get("description")?.toString() || null,
        location_address: formData.get("address")?.toString() || null,
        location_city: formData.get("location-city")?.toString() || null,
        location_country: formData.get("location-country")?.toString() || "Zimbabwe",
        video_url: formData.get("video_url")?.toString() || null,
        vehicle_type: formData.get("vehicle-type")?.toString() || "car",
        features: features,
        updated_at: new Date().toISOString()
      };

      try {
        const { data, error } = await supabase
          .from('listing_drafts')
          .upsert(payload, { onConflict: user?.id ? 'user_id' : 'session_id' })
          .select('id')
          .single();
        
        if (!error && data) {
          setDraftId(data.id);
          setLastSaved(new Date());
        }
      } catch (err) {
        console.warn("Auto-save sync postponed:", err);
      }
    };

    const interval = setInterval(saveDraft, 8000);
    return () => clearInterval(interval);
  }, [user?.id, editingListing, selectedFeatures, selectedMake, initialData]);

  async function uploadFileToStorage(file: File, folder: string) {
    if (!file) return null;
    const ownerId = user?.id || getSessionId();
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}/${ownerId}/${filename}`;

    const { error: uploadError } = await supabase.storage.from("listing-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
    return data?.publicUrl || null;
  }

  function handleFileChange(idx: number, file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (idx === 0) {
      if (mainPreview && !mainPreview.startsWith('http')) URL.revokeObjectURL(mainPreview);
      setMainPreview(url);
    } else {
      setGalleryPreviews(prev => [...prev.filter(p => p.idx !== idx), { idx, url }]);
    }
  }

  function handleReportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedReportName(file.name);
  }

  function removePreview(idx: number) {
    if (idx === 0) {
      if (mainPreview && !mainPreview.startsWith('http')) URL.revokeObjectURL(mainPreview);
      setMainPreview(null);
      if (fileInputsRef.current[0]) fileInputsRef.current[0].value = "";
    } else {
      setGalleryPreviews(prev => prev.filter(p => p.idx !== idx));
      if (fileInputsRef.current[idx]) fileInputsRef.current[idx].value = "";
    }
  }

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const values = {
      listing_title: formData.get("listing-title") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      body_type: formData.get("body_type") as string,
      year: formData.get("year") as string,
      condition: formData.get("condition") as string,
      stock_number: formData.get("stock-number") as string,
      vin_number: formData.get("vin-number") as string,
      mileage: formData.get("mileage") as string,
      transmission: formData.get("transmission") as string,
      driver_type: formData.get("driver_type") as string,
      engine_size: formData.get("engine-size") as string,
      cylinders: formData.get("cylinders") as string,
      fuel_type: formData.get("fuel_type") as string,
      doors: formData.get("doors") as string,
      color: formData.get("color") as string,
      seats: formData.get("seats") as string,
      city_mpg: formData.get("city-mpg") as string,
      highway_mpg: formData.get("highway-mpg") as string,
      description: formData.get("description") as string,
      price: formData.get("regular-price") as string,
      old_price: formData.get("sale-price") as string,
      location_address: formData.get("address") as string,
      location_city: formData.get("location-city") as string,
      location_country: formData.get("location-country") as string,
      video_url: formData.get("video_url") as string,
      currency: formData.get("currency") as string || "USD",
      vehicle_type: formData.get("vehicle-type") as string || "car",
      features: selectedFeatures,
    };

    if (!values.listing_title || !values.make || !values.price) {
      setMessage({ type: "error", text: "Title, Make, and Price are required." });
      return;
    }

    if (!user) {
      // Force an auto-save before registration so draft exists in DB
      const sid = getSessionId();
      await supabase.from('listing_drafts').upsert({
         session_id: sid,
         listing_title: values.listing_title,
         make: values.make,
         price: parseFloat(values.price),
         features: selectedFeatures,
         updated_at: new Date().toISOString()
      }, { onConflict: 'session_id' });
      
      setShowRegistration(true);
      return;
    }

    const mainFile = fileInputsRef.current[0]?.files?.[0];
    const galleryFiles: File[] = [];
    for (let i = 1; i <= 4; i++) {
      const f = fileInputsRef.current[i]?.files?.[0];
      if (f) galleryFiles.push(f);
    }
    const reportFile = reportFileInputRef.current?.files?.[0];

    setPendingFormData({ values, mainFile, galleryFiles, reportFile });
    if (editingListing) finalizeSubmit(editingListing.is_paid);
    else setShowPayChoice(true);
  };

  async function finalizeSubmit(doPay: boolean) {
    setShowPayChoice(false);
    if (!pendingFormData || !user) return;
    setLoadingSubmit(true);
    setMessage(null);

    const toInt = (val: any) => { const parsed = parseInt(val); return isNaN(parsed) ? null : parsed; };
    const toFloat = (val: any) => { const parsed = parseFloat(val); return isNaN(parsed) ? null : parsed; };

    try {
      const { values, mainFile, galleryFiles, reportFile } = pendingFormData;
      let mainUrl = editingListing?.main_image_url || initialData?.main_image_url || null;
      if (mainFile) mainUrl = await uploadFileToStorage(mainFile, "main");
      let reportUrl = editingListing?.report_url || null;
      if (reportFile) reportUrl = await uploadFileToStorage(reportFile, "report");

      const payload = {
        user_id: user.id,
        listing_title: values.listing_title,
        make: values.make,
        model: values.model,
        body_type: values.body_type,
        year: toInt(values.year),
        condition: values.condition,
        stock_number: values.stock_number || null,
        vin_number: values.vin_number || null,
        mileage: toInt(values.mileage),
        transmission: values.transmission,
        driver_type: values.driver_type,
        engine_size: values.engine_size || null,
        cylinders: toInt(values.cylinders),
        fuel_type: values.fuel_type,
        doors: toInt(values.doors),
        color: values.color,
        seats: toInt(values.seats),
        city_mpg: toFloat(values.city_mpg),
        highway_mpg: toFloat(values.highway_mpg),
        currency: values.currency,
        price: toFloat(values.price),
        old_price: toFloat(values.old_price),
        description: values.description || null,
        location_address: values.location_address,
        location_city: values.location_city,
        location_country: values.location_country || "Zimbabwe",
        video_url: values.video_url || null,
        status: editingListing ? editingListing.status : "pending",
        is_paid: doPay,
        plan_type: doPay ? "Featured" : "Free",
        paid_until: doPay ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : '2025-12-31 23:59:59+00',
        is_featured: doPay,
        vehicle_type: values.vehicle_type,
        main_image_url: mainUrl,
        report_url: reportUrl,
      };

      let listingId = editingListing?.id;
      if (editingListing) {
        await supabase.from("listings").update(payload).eq('id', editingListing.id).eq('user_id', user.id);
      } else {
        const { data: listing, error } = await supabase.from("listings").insert([payload]).select().single();
        if (error) throw error;
        listingId = listing.id;

        const sid = getSessionId();
        await supabase.from('listing_drafts').delete().or(`user_id.eq.${user.id},session_id.eq.${sid}`);

        const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'super_admin']);
        if (admins?.length) {
          const adminNotifications = admins.map(admin => ({
            recipient_id: admin.id, sender_id: user.id, title: 'Audit Requested',
            message: `New listing "${values.listing_title}" requires approval.`,
            type: 'listing_pending', related_id: listingId, is_read: false
          }));
          await supabase.from('notifications').insert(adminNotifications);
        }
      }

      if (galleryFiles.length > 0 && listingId) {
        const galleryUrls = [];
        for (const f of galleryFiles) {
          const url = await uploadFileToStorage(f, "gallery");
          if (url) galleryUrls.push(url);
        }
        const imageRows = galleryUrls.map((u, idx) => ({
          listing_id: listingId, image_url: u, is_primary: false, position: idx + 1
        }));
        await supabase.from("listing_images").insert(imageRows);
      }

      if (values.features?.length > 0 && listingId) {
        if (editingListing) await supabase.from('listing_features').delete().eq('listing_id', editingListing.id);
        const featuresRows = values.features.map((f: string) => ({ listing_id: listingId, category: "Custom", name: f }));
        await supabase.from("listing_features").insert(featuresRows);
      }

      setMessage({ type: "success", text: "Registry updated successfully." });
      setTimeout(onComplete, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to publish unit." });
    } finally {
      setLoadingSubmit(false);
    }
  }

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]);
  };

  const filteredModels = models.filter(m => !selectedMake || m.make_name === selectedMake);

  if (loadingOptions) return <div className="p-20 text-center text-[11px] font-black text-gray-400 animate-pulse uppercase tracking-[0.2em]">Synchronizing Registry...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <form ref={formRef} onSubmit={handleOnSubmit} className="space-y-12">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 md:p-16 shadow-sm space-y-16">
          <section>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-[25px] font-black text-gray-900 tracking-tighter italic">{editingListing ? 'Refine Asset' : 'Register New Vehicle'}</h2>
                {!editingListing && lastSaved && (
                  <p className="text-[9px] text-[#237837] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#237837] animate-pulse"></span>
                    Sync Secured: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button type="button" onClick={onComplete} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">Close Form</button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Listing Title (*)</label>
                <input name="listing-title" type="text" defaultValue={editingListing?.listing_title || initialData?.listing_title} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-900 focus:bg-white focus:border-green-100 transition-all border-2 border-transparent" placeholder="e.g. 2022 Toyota Hilux Legend RS" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Make (*)</label>
                  <select name="make" value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-700 border-2 border-transparent" required>
                    <option value="">-- Select Make --</option>
                    {makes.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Model (*)</label>
                  <select name="model" defaultValue={editingListing?.model || initialData?.model} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-700 border-2 border-transparent disabled:opacity-50" required disabled={!selectedMake}>
                    <option value="">{selectedMake ? '-- Select Model --' : 'Select Make First'}</option>
                    {filteredModels.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Body Type</label>
                  <select name="body_type" defaultValue={editingListing?.body_type || initialData?.body_type} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-700 border-2 border-transparent">
                    <option value="">-- Select --</option>
                    {bodyTypes.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Year', name: 'year', type: 'select', options: years.map(y => y.year), default: editingListing?.year || initialData?.year },
                { label: 'Condition', name: 'condition', type: 'select', options: ['New', 'Used'], default: editingListing?.condition || initialData?.condition },
                { label: 'Transmission', name: 'transmission', type: 'select', options: ['Manual', 'Auto', 'CVT', 'DCT'], default: editingListing?.transmission || initialData?.transmission },
                { label: 'Fuel Type', name: 'fuel_type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: editingListing?.fuel_type || initialData?.fuel_type },
                { label: 'Stock Number', name: 'stock-number', type: 'text', default: editingListing?.stock_number },
                { label: 'VIN Number', name: 'vin-number', type: 'text', default: editingListing?.vin_number },
                { label: 'Mileage (km)', name: 'mileage', type: 'number', default: editingListing?.mileage || initialData?.mileage },
                { label: 'Driver Type', name: 'driver_type', type: 'select', options: ['FWD', 'RWD', '4WD', 'AWD'], default: editingListing?.driver_type },
                { label: 'Engine Size', name: 'engine-size', type: 'text', default: editingListing?.engine_size },
                { label: 'Cylinders', name: 'cylinders', type: 'select', options: ['1','2','3','4','5','6','8','10','12'], default: editingListing?.cylinders },
                { label: 'Doors', name: 'doors', type: 'select', options: ['2','3','4','5'], default: editingListing?.doors },
                { label: 'Color', name: 'color', type: 'text', default: editingListing?.color },
                { label: 'Seats', name: 'seats', type: 'select', options: ['1','2','3','4','5','7','8'], default: editingListing?.seats },
                { label: 'City MPG', name: 'city-mpg', type: 'text', default: editingListing?.city_mpg },
                { label: 'Highway MPG', name: 'highway-mpg', type: 'text', default: editingListing?.highway_mpg },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{field.label}</label>
                  {field.type === 'select' ? (
                    <select name={field.name} defaultValue={field.default} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-black text-gray-700 border-2 border-transparent">
                      <option value="">-- Select --</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input name={field.name} type={field.type} defaultValue={field.default} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-black text-gray-700 border-2 border-transparent" placeholder={field.label} />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Asset Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Street Address</label>
                <input name="address" type="text" defaultValue={editingListing?.location_address} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-900 focus:bg-white focus:border-green-100 transition-all border-2 border-transparent" placeholder="e.g. 123 Samora Machel Ave" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">City (*)</label>
                <input name="location-city" type="text" defaultValue={editingListing?.location_city || initialData?.location_city} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-900 focus:bg-white focus:border-green-100 transition-all border-2 border-transparent" placeholder="Harare" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Country (*)</label>
                <input name="location-country" type="text" defaultValue={editingListing?.location_country || "Zimbabwe"} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-900 focus:bg-white focus:border-green-100 transition-all border-2 border-transparent" placeholder="Zimbabwe" required />
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Financials & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Regular Price (*)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#237837]">$</span>
                    <input name="regular-price" type="number" defaultValue={editingListing?.price || initialData?.price} className="w-full pl-10 p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-900 border-2 border-transparent" placeholder="0.00" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Sale Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">$</span>
                    <input name="sale-price" type="number" defaultValue={editingListing?.old_price} className="w-full pl-10 p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-400 border-2 border-transparent" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Video Walkthrough URL</label>
                  <input name="video_url" type="url" defaultValue={editingListing?.video_url} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-gray-900 focus:bg-white focus:border-green-100 transition-all border-2 border-transparent" placeholder="https://youtube.com/watch?v=...  " />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Vehicle Description</label>
                <textarea name="description" defaultValue={editingListing?.description || initialData?.description} className="w-full p-6 bg-gray-50 rounded-[32px] h-44 outline-none font-black text-slate-700 resize-none border-2 border-transparent focus:bg-white focus:border-green-50 transition-all" placeholder="Describe mechanical state, features, and history..."></textarea>
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Features & Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
              {[
                'A/C: Front', 'A/C: Rear', 'Backup Camera', 'Cruise Control', 'Navigation', 'Power Locks',
                'AM/FM Stereo', 'CD Player', 'DVD System', 'MP3 Player', 'Premium Audio',
                'Airbag: Driver', 'Airbag: Passenger', 'Bluetooth', 'Fog Lights', 'Power Windows',
                'Sunroof', 'Leather Interior', 'Heated Seats', 'Tow Package'
              ].map(feat => (
                <label key={feat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="features" 
                    value={feat} 
                    checked={selectedFeatures.includes(feat)}
                    onChange={() => toggleFeature(feat)}
                    className="hidden peer" 
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-gray-100 peer-checked:bg-[#237837] peer-checked:border-[#237837] transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 peer-checked:text-gray-900 transition-colors">{feat}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Media Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div className="aspect-[4/3] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                  {mainPreview ? (
                    <img src={mainPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-[8px] font-black text-gray-400 uppercase">Primary</p>
                    </div>
                  )}
                  <input type="file" ref={el => { fileInputsRef.current[0] = el; }} onChange={e => handleFileChange(0, e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  {mainPreview && <button type="button" onClick={() => removePreview(0)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                </div>
                <p className="text-[8px] text-center font-black text-gray-300 uppercase">Main Photo</p>
              </div>

              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="space-y-4">
                  <div className="aspect-[4/3] bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:bg-white hover:border-green-100">
                    {galleryPreviews.find(p => p.idx === idx) ? (
                      <img src={galleryPreviews.find(p => p.idx === idx)?.url} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    )}
                    <input type="file" ref={el => { fileInputsRef.current[idx] = el; }} onChange={e => handleFileChange(idx, e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    {galleryPreviews.find(p => p.idx === idx) && <button type="button" onClick={() => removePreview(idx)} className="absolute top-2 right-2 p-2 bg-gray-900/40 text-white rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                  </div>
                  <p className="text-[8px] text-center font-black text-gray-300 uppercase">Extra {idx}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Verification Documentation</h3>
            <div className="max-w-2xl">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-4 block">Inspection Report / Ownership Proof</label>
              <div onClick={() => reportFileInputRef.current?.click()} className="group relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 transition-all hover:bg-white hover:border-[#237837] cursor-pointer flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#237837] transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-black text-gray-900 mb-1">{selectedReportName || "Upload Car Verification Document"}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">PDF, Images or Word documents supported</p>
                </div>
                <input type="file" ref={reportFileInputRef} onChange={handleReportChange} className="hidden" accept=".pdf,.doc,.docx,image/*" />
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center pt-10 border-t border-gray-50">
             <button type="submit" disabled={loadingSubmit} className="px-32 py-[30px] bg-[#237837] text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-[#237837]/30">
               {loadingSubmit ? "Processing..." : (editingListing ? "Finalize Update" : "Dispatch to Audit")}
             </button>
             {message && <p className={`text-[10px] font-black uppercase tracking-widest mt-6 ${message.type === 'error' ? 'text-red-500' : 'text-[#237837]'}`}>{message.text}</p>}
          </div>
        </div>
      </form>

      {showPayChoice && !editingListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#237837] mb-2">Promotion Tiers</h3>
            <h2 className="text-3xl font-black text-slate-900 mb-8 italic tracking-tighter">Boost Visibility?</h2>
            <div className="space-y-4 mb-10">
              <button type="button" onClick={() => setPayChoice('pay')} className={`w-full p-8 border-2 rounded-[32px] text-left transition-all flex items-center gap-6 ${payChoice === 'pay' ? 'border-[#237837] bg-green-50/30' : 'border-slate-50 hover:border-slate-100'}`}>
                <div className={`w-6 h-6 rounded-full border-4 flex-shrink-0 ${payChoice === 'pay' ? 'border-[#237837] bg-white' : 'border-slate-200'}`}></div>
                <div>
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Featured Boost ($10)</p>
                   <p className="text-[10px] text-slate-500 font-bold">Verified Featured badge & top priority ranking.</p>
                </div>
              </button>
              <button type="button" onClick={() => setPayChoice('skip')} className={`w-full p-8 border-2 rounded-[32px] text-left transition-all flex items-center gap-6 ${payChoice === 'skip' ? 'border-[#237837] bg-green-50/30' : 'border-slate-50 hover:border-slate-100'}`}>
                <div className={`w-6 h-6 rounded-full border-4 flex-shrink-0 ${payChoice === 'skip' ? 'border-[#237837] bg-white' : 'border-slate-200'}`}></div>
                <div>
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Standard Submission (Free)</p>
                   <p className="text-[10px] text-slate-500 font-bold">Standard ranking after manual platform audit.</p>
                </div>
              </button>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPayChoice(false)} className="flex-1 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Abort</button>
              <button type="button" onClick={() => finalizeSubmit(payChoice === 'pay')} className="flex-[2] py-5 bg-[#237837] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Approve & Submit</button>
            </div>
          </div>
        </div>
      )}

      <RegistrationPopup 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
        onSuccess={async (uid) => {
          setShowRegistration(false);
          // Instead of redirecting, refresh the user locally to stay in the form flow
          await refreshUser();
          setMessage({ type: "success", text: "Successfully authenticated. Please continue your listing." });
        }}
        draftContext="listing"
      />
    </div>
  );
};
