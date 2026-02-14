import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import type { Property } from './data/properties';

interface PanoramaInput {
  label: string;
  file: File | null;
  url?: string;
}

interface ListPropertyModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  onCreated: (property: Property) => void;
  onUpdated?: (property: Property) => void;
  mode?: 'create' | 'edit';
  initialProperty?: Property | null;
}

const LISTING_TYPES = ['sale', 'rent'] as const;
const PROPERTY_TYPES = ['house', 'condo', 'apartment', 'townhouse', 'villa'] as const;

export function ListPropertyModal({
  isOpen,
  userId,
  onClose,
  onCreated,
  onUpdated,
  mode = 'create',
  initialProperty,
}: ListPropertyModalProps) {
  const isEditing = mode === 'edit' && !!initialProperty;
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [price, setPrice] = useState('');
  const [listingType, setListingType] = useState<typeof LISTING_TYPES[number]>('sale');
  const [propertyType, setPropertyType] = useState<typeof PROPERTY_TYPES[number]>('house');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPhoto, setAgentPhoto] = useState('');
  const [matterportUrl, setMatterportUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [panoramas, setPanoramas] = useState<PanoramaInput[]>([
    { label: 'Living Room', file: null },
  ]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (!initialProperty) {
      setTitle('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
      setPrice('');
      setListingType('sale');
      setPropertyType('house');
      setBedrooms('');
      setBathrooms('');
      setSqft('');
      setYearBuilt('');
      setDescription('');
      setFeaturesText('');
      setIsNew(false);
      setIsFeatured(false);
      setAgentName('');
      setAgentPhone('');
      setAgentEmail('');
      setAgentPhoto('');
      setMatterportUrl('');
      setThumbnailFile(null);
      setThumbnailUrl('');
      setThumbnailPreview('');
      setPanoramas([{ label: 'Living Room', file: null }]);
      setError(null);
      return;
    }

    setTitle(initialProperty.title);
    setAddress(initialProperty.address);
    setCity(initialProperty.city);
    setState(initialProperty.state);
    setZip(initialProperty.zip);
    setPrice(String(initialProperty.price));
    setListingType(initialProperty.listingType);
    setPropertyType(initialProperty.propertyType);
    setBedrooms(String(initialProperty.bedrooms));
    setBathrooms(String(initialProperty.bathrooms));
    setSqft(String(initialProperty.sqft));
    setYearBuilt(String(initialProperty.yearBuilt));
    setDescription(initialProperty.description);
    setFeaturesText(initialProperty.features.join(', '));
    setIsNew(initialProperty.isNew);
    setIsFeatured(initialProperty.isFeatured);
    setAgentName(initialProperty.agent.name);
    setAgentPhone(initialProperty.agent.phone);
    setAgentEmail(initialProperty.agent.email);
    setAgentPhoto(initialProperty.agent.photo);
    setMatterportUrl(initialProperty.matterportUrl);
    setThumbnailFile(null);
    setThumbnailUrl(initialProperty.thumbnailUrl || '');
    setThumbnailPreview(initialProperty.thumbnailUrl || '');
    setPanoramas(
      initialProperty.panoramas.length > 0
        ? initialProperty.panoramas.map((panorama) => ({
            label: panorama.label,
            file: null,
            url: panorama.url,
          }))
        : [{ label: 'Living Room', file: null }]
    );
    setError(null);
  }, [initialProperty, isOpen]);

  const panoramasValid = useMemo(() => {
    const hasAny = panoramas.some((p) => p.file || p.url);
    if (!hasAny) return false;

    return panoramas.every((p) => {
      const hasLabel = Boolean(p.label.trim());
      const hasFile = Boolean(p.file);
      const hasUrl = Boolean(p.url);
      return (!hasLabel && !hasFile && !hasUrl) || (hasLabel && (hasFile || hasUrl));
    });
  }, [panoramas]);

  const canSubmit = useMemo(() => {
    return (
      title.trim() &&
      address.trim() &&
      city.trim() &&
      state.trim() &&
      price &&
      bedrooms &&
      bathrooms &&
      sqft &&
      yearBuilt &&
      agentName.trim() &&
      agentEmail.trim() &&
      panoramasValid
    );
  }, [
    title,
    address,
    city,
    state,
    price,
    bedrooms,
    bathrooms,
    sqft,
    yearBuilt,
    agentName,
    agentEmail,
    panoramasValid,
  ]);

  useEffect(() => {
    const objectUrls: string[] = [];
    const urls = panoramas.map((panorama) => {
      if (panorama.file) {
        const objectUrl = URL.createObjectURL(panorama.file);
        objectUrls.push(objectUrl);
        return objectUrl;
      }
      return panorama.url || '';
    });

    setPreviewUrls(urls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [panoramas]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(thumbnailUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile, thumbnailUrl]);

  if (!isOpen) return null;

  const updatePanorama = (index: number, patch: Partial<PanoramaInput>) => {
    setPanoramas((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const addPanorama = () => {
    setPanoramas((prev) => [...prev, { label: '', file: null }]);
  };

  const removePanorama = (index: number) => {
    setPanoramas((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setPrice('');
    setListingType('sale');
    setPropertyType('house');
    setBedrooms('');
    setBathrooms('');
    setSqft('');
    setYearBuilt('');
    setDescription('');
    setFeaturesText('');
    setIsNew(false);
    setIsFeatured(false);
    setAgentName('');
    setAgentPhone('');
    setAgentEmail('');
    setAgentPhoto('');
    setMatterportUrl('');
    setThumbnailFile(null);
    setThumbnailUrl('');
    setThumbnailPreview('');
    setPanoramas([{ label: 'Living Room', file: null }]);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    if (!panoramasValid) {
      setError('Each 360 photo must have a label, and empty rows should be removed.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const features = featuresText
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean);

    let resolvedThumbnailUrl = thumbnailUrl;

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/thumbnails/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from('property-thumbnails')
        .upload(filePath, thumbnailFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setIsSubmitting(false);
        return;
      }

      const { data: publicData } = supabase.storage.from('property-thumbnails').getPublicUrl(filePath);
      resolvedThumbnailUrl = publicData.publicUrl;
    }

    const propertyPayload = {
      title,
      address,
      city,
      state,
      zip,
      price: Number(price),
      listing_type: listingType,
      property_type: propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      year_built: Number(yearBuilt),
      description,
      is_new: isNew,
      is_featured: isFeatured,
      features,
      matterport_url: matterportUrl,
      thumbnail_url: resolvedThumbnailUrl || null,
      seller_id: userId,
      agent_name: agentName,
      agent_phone: agentPhone,
      agent_email: agentEmail,
      agent_photo: agentPhoto,
    };

    const { data: propertyRow, error: propertyError } = isEditing
      ? await supabase
          .from('properties')
          .update(propertyPayload)
          .eq('id', initialProperty?.id)
          .select()
          .single()
      : await supabase
          .from('properties')
          .insert(propertyPayload)
          .select()
          .single();

    if (propertyError || !propertyRow) {
      setError(propertyError?.message || 'Failed to save property');
      setIsSubmitting(false);
      return;
    }

    const uploadedPanoramas: { url: string; label: string }[] = [];
    const normalizedPanoramas = panoramas.filter((p) => p.label.trim() && (p.file || p.url));

    for (let i = 0; i < normalizedPanoramas.length; i += 1) {
      const panorama = normalizedPanoramas[i];
      if (panorama.file) {
        const fileExt = panorama.file.name.split('.').pop() || 'jpg';
        const safeLabel = panorama.label.trim().toLowerCase().replace(/\s+/g, '-');
        const filePath = `${userId}/${propertyRow.id}/${i + 1}-${safeLabel}.${fileExt}`;

        const { error: uploadError } = await supabase
          .storage
          .from('property-360')
          .upload(filePath, panorama.file, { upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          setIsSubmitting(false);
          return;
        }

        const { data: publicData } = supabase.storage.from('property-360').getPublicUrl(filePath);
        uploadedPanoramas.push({ url: publicData.publicUrl, label: panorama.label });
      } else if (panorama.url) {
        uploadedPanoramas.push({ url: panorama.url, label: panorama.label });
      }
    }

    if (uploadedPanoramas.length === 0) {
      setError('Please upload at least one 360 photo.');
      setIsSubmitting(false);
      return;
    }

    if (isEditing) {
      const { error: deleteError } = await supabase
        .from('property_photos')
        .delete()
        .eq('property_id', propertyRow.id);

      if (deleteError) {
        setError(deleteError.message);
        setIsSubmitting(false);
        return;
      }
    }

    const photoRows = uploadedPanoramas.map((photo, index) => ({
      property_id: propertyRow.id,
      label: photo.label,
      url: photo.url,
      sort_order: index + 1,
    }));

    const { error: photoError } = await supabase
      .from('property_photos')
      .insert(photoRows);

    if (photoError) {
      setError(photoError.message);
      setIsSubmitting(false);
      return;
    }

    const newProperty: Property = {
      id: propertyRow.id,
      sellerId: propertyRow.seller_id,
      title: propertyRow.title,
      address: propertyRow.address,
      city: propertyRow.city,
      state: propertyRow.state,
      zip: propertyRow.zip,
      price: propertyRow.price,
      listingType: propertyRow.listing_type,
      propertyType: propertyRow.property_type,
      bedrooms: propertyRow.bedrooms,
      bathrooms: propertyRow.bathrooms,
      sqft: propertyRow.sqft,
      yearBuilt: propertyRow.year_built,
      isNew: propertyRow.is_new,
      isFeatured: propertyRow.is_featured,
      description: propertyRow.description,
      features: propertyRow.features || [],
      panoramas: uploadedPanoramas,
      thumbnailUrl: propertyRow.thumbnail_url || resolvedThumbnailUrl || undefined,
      matterportUrl: propertyRow.matterport_url || '',
      agent: {
        name: propertyRow.agent_name,
        phone: propertyRow.agent_phone,
        email: propertyRow.agent_email,
        photo: propertyRow.agent_photo,
      },
    };

    if (isEditing) {
      onUpdated?.(newProperty);
    } else {
      onCreated(newProperty);
    }

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Listing' : 'List a Property'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? 'Update details and 360° photo labels.' : 'Add full details and 360° photo labels.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="Modern Loft with Skyline Views"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="1800000"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="123 Market Street"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="San Francisco"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="CA"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">ZIP</label>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="94105"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Listing Type</label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as typeof listingType)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
              >
                {LISTING_TYPES.map((type) => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sq Ft</label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Year Built</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Features (comma separated)</label>
            <input
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
              placeholder="Pool, Smart home, EV charger"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Matterport URL</label>
              <input
                value={matterportUrl}
                onChange={(e) => setMatterportUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="https://my.matterport.com/show/?m=..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnail</label>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="thumbnail-input"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Choose thumbnail
                </label>
                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
                <p className="text-xs text-gray-500">
                  {thumbnailFile?.name || (thumbnailUrl ? 'Current thumbnail' : 'No file selected')}
                </p>
              </div>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="mt-3 w-full h-32 object-cover rounded-xl border border-gray-100"
                />
              )}
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                New listing
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                Featured
              </label>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">360° Photos</h3>
                <p className="text-sm text-gray-500">Upload images and label each room.</p>
              </div>
              <button type="button" onClick={addPanorama} className="text-sm text-blue-600 font-medium flex items-center gap-1">
                <Plus size={16} /> Add photo
              </button>
            </div>

            {panoramas.map((panorama, index) => (
              <div key={`panorama-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <div className="space-y-2">
                  <input
                    value={panorama.label}
                    onChange={(e) => updatePanorama(index, { label: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                    placeholder="Living Room"
                  />
                  {panorama.file && !panorama.label.trim() && (
                    <p className="text-xs text-red-500">Add a label for this photo.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`panorama-file-${index}`}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Choose 360 photo
                  </label>
                  <input
                    id={`panorama-file-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => updatePanorama(index, { file: e.target.files?.[0] || null, url: undefined })}
                    className="sr-only"
                  />
                  <p className="text-xs text-gray-500">
                    {panorama.file?.name || (panorama.url ? 'Current photo' : 'No file selected')}
                  </p>
                  {panorama.label.trim() && !panorama.file && !panorama.url && (
                    <p className="text-xs text-red-500">Select a photo for this label.</p>
                  )}
                  {previewUrls[index] && (
                    <img
                      src={previewUrls[index]}
                      alt={panorama.label || `Preview ${index + 1}`}
                      className="w-full h-28 object-cover rounded-xl border border-gray-100"
                    />
                  )}
                </div>
                <div className="flex items-start justify-end">
                  {panoramas.length > 1 && (
                    <button type="button" onClick={() => removePanorama(index)} className="text-sm text-gray-500 hover:text-red-500">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Agent Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="Agent name"
                required
              />
              <input
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="Agent email"
                required
              />
              <input
                value={agentPhone}
                onChange={(e) => setAgentPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="Agent phone"
              />
              <input
                value={agentPhoto}
                onChange={(e) => setAgentPhoto(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
                placeholder="Agent photo URL"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pb-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isEditing ? 'Save Changes' : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
