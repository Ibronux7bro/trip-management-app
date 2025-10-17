// DELETED - This component is no longer needed;
"use client";

import React from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";

// Simple Google Places Autocomplete input that loads the Places API when an API key exists.
// It falls back to a normal text input if the API key is not provided or script fails to load.

type PlacesAutocompleteProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

declare global {
  interface Window {
    google?: any;
  }
}

export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [ready, setReady] = React.useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const shouldLoadScript = Boolean(apiKey);

  React.useEffect(() => {
    if (!ready) return;
    if (!window.google?.maps?.places || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      fields: ["formatted_address", "geometry", "name"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const text = place?.formatted_address || place?.name || "";
      if (text) onChange(text);
    });

    return () => {
      if (listener) listener.remove();
    };
  }, [ready, onChange]);

  return (
    <>
      {shouldLoadScript && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          strategy="afterInteractive"
          onReady={() => setReady(true)}
          onError={() => setReady(false)}
        />
      )}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </>
  );
};
