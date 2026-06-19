export type AddressComponents = {
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  placeName?: string;
};

type PlaceWithAddress = google.maps.GeocoderResult | google.maps.places.PlaceResult;

function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShortName = false,
): string | undefined {
  const match = components.find((component) => component.types.includes(type));
  if (!match) {
    return undefined;
  }

  return useShortName ? match.short_name : match.long_name;
}

export function extractAddressComponents(place: PlaceWithAddress): AddressComponents {
  const addressComponents = place.address_components ?? [];
  const formattedAddress = "formatted_address" in place ? place.formatted_address : undefined;
  const name = "name" in place ? place.name : undefined;

  const postalCode = getComponent(addressComponents, "postal_code");
  const city =
    getComponent(addressComponents, "locality") ??
    getComponent(addressComponents, "postal_town");
  const state =
    getComponent(addressComponents, "administrative_area_level_1") ??
    getComponent(addressComponents, "administrative_area_level_2");
  const country = getComponent(addressComponents, "country", true);

  let placeName: string | undefined;
  if (formattedAddress) {
    const firstSegment = formattedAddress.split(",")[0]?.trim();
    if (firstSegment && !/^\d/.test(firstSegment)) {
      placeName = firstSegment;
    }
  }

  if (!placeName && name) {
    placeName = name;
  }

  return { postalCode, city, state, country, placeName };
}

export function formatLocationLabelFromComponents(components: AddressComponents): string {
  const { postalCode, city, state, country, placeName } = components;
  const parts: string[] = [];

  if (placeName && !postalCode && !city) {
    parts.push(placeName);
  } else if (postalCode) {
    parts.push(postalCode);
    if (city) {
      parts.push(city);
    } else if (state) {
      parts.push(state);
    }
  } else if (city) {
    parts.push(city);
  } else if (placeName) {
    parts.push(placeName);
  }

  if (country) {
    parts.push(country);
  }

  return parts.length > 0 ? parts.join(", ") : "Selected Location";
}

export function formatLocationLabelFromPlace(place: PlaceWithAddress): string {
  return formatLocationLabelFromComponents(extractAddressComponents(place));
}

export function formatCoordinatesLabel(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function userLocationFromPlace(place: PlaceWithAddress): {
  latitude: number;
  longitude: number;
  label: string;
  placeName?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
} | null {
  const location = place.geometry?.location;
  if (!location) {
    return null;
  }

  const components = extractAddressComponents(place);

  return {
    latitude: location.lat(),
    longitude: location.lng(),
    label: formatLocationLabelFromComponents(components),
    ...components,
  };
}
